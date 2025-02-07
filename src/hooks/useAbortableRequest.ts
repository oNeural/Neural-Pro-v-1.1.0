import { useEffect, useRef, useCallback } from 'react';

interface RequestOptions extends RequestInit {
  signal?: AbortSignal;
}

export const useAbortableRequest = () => {
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup function to abort any pending request
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Function to make abortable requests
  const makeRequest = useCallback(async <T>(
    url: string,
    options: RequestOptions = {}
  ): Promise<T> => {
    // Clean up any existing request
    cleanup();

    // Create new AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      // If the error is due to an aborted request, throw a custom error
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request was cancelled');
      }
      throw error;
    } finally {
      // Clear the reference if this is still the current controller
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, [cleanup]);

  return { makeRequest, abort: cleanup };
};
