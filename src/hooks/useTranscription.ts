import { useState } from 'react';
import {
  uploadAudioToAssemblyAI,
  startTranscription,
  pollTranscriptionResult,
  TranscriptionResponse
} from '../services/assemblyAI';

interface TranscriptionState {
  status: 'idle' | 'uploading' | 'transcribing' | 'completed' | 'error';
  progress: string;
  error: string | null;
  result: TranscriptionResponse | null;
}

export const useTranscription = (apiKey: string) => {
  const [state, setState] = useState<TranscriptionState>({
    status: 'idle',
    progress: '',
    error: null,
    result: null
  });

  const transcribeAudio = async (audioFile: File) => {
    try {
      // Reset state
      setState({
        status: 'uploading',
        progress: 'Uploading audio file...',
        error: null,
        result: null
      });

      // Upload audio file
      const transcriptId = await uploadAudioToAssemblyAI(audioFile, apiKey);

      // Start transcription
      setState(prev => ({
        ...prev,
        status: 'transcribing',
        progress: 'Starting transcription with speaker diarization...'
      }));

      // Poll for results
      const result = await pollTranscriptionResult(
        transcriptId,
        apiKey,
        (status) => {
          setState(prev => ({
            ...prev,
            progress: status
          }));
        }
      );

      // Process and validate speaker diarization
      if (result.utterances && result.utterances.length > 0) {
        // Sort utterances by start time
        result.utterances.sort((a, b) => a.start - b.start);

        // Ensure consistent speaker labeling
        const speakerMap = new Map<string, string>();
        let nextSpeakerIndex = 0;

        result.utterances = result.utterances.map(utterance => {
          if (!speakerMap.has(utterance.speaker)) {
            speakerMap.set(utterance.speaker, `speaker_${nextSpeakerIndex + 1}`);
            nextSpeakerIndex++;
          }
          return {
            ...utterance,
            speaker: speakerMap.get(utterance.speaker) || utterance.speaker
          };
        });
      }

      // Update state with results
      setState({
        status: 'completed',
        progress: 'Transcription completed',
        error: null,
        result
      });

      return result;

    } catch (error) {
      setState({
        status: 'error',
        progress: '',
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        result: null
      });
      throw error;
    }
  };

  const reset = () => {
    setState({
      status: 'idle',
      progress: '',
      error: null,
      result: null
    });
  };

  return {
    transcribeAudio,
    reset,
    ...state
  };
}; 