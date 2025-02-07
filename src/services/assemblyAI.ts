import { AssemblyAI } from 'assemblyai';

// Types
export interface TranscriptionWord {
  text: string;
  start: number;
  end: number;
  confidence: number;
}

export interface TranscriptionUtterance {
  speaker: string;
  text: string;
  start: number;
  end: number;
}

export interface TranscriptionResponse {
  text: string;
  confidence: number;
  words: TranscriptionWord[];
  utterances?: TranscriptionUtterance[];
  status?: string;
  error?: string;
}

// Configuration
const TRANSCRIPTION_CONFIG = {
  speaker_labels: true,
  format_text: true,
  punctuate: true,
  language_detection: true
};

const MAX_POLLING_ATTEMPTS = 600; // 10 minutes maximum
const POLLING_INTERVAL = 1000; // 1 second

// Client management
let client: AssemblyAI | null = null;

const initializeClient = (apiKey: string): AssemblyAI => {
  if (!client) {
    client = new AssemblyAI({
      apiKey: apiKey.trim()
    });
  }
  return client;
};

// Error handling
class TranscriptionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TranscriptionError';
  }
}

// API functions
export const uploadAudioToAssemblyAI = async (
  audioFile: File,
  apiKey: string
): Promise<string> => {
  try {
    const client = initializeClient(apiKey);
    const transcript = await client.transcripts.transcribe({
      audio: audioFile,
      ...TRANSCRIPTION_CONFIG
    });

    if (transcript.status === 'error') {
      throw new TranscriptionError(transcript.error || 'Unknown error during upload');
    }

    return transcript.id;
  } catch (error) {
    if (error instanceof TranscriptionError) {
      throw error;
    }
    throw new TranscriptionError(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getTranscriptionResult = async (
  transcriptId: string,
  apiKey: string
): Promise<TranscriptionResponse> => {
  try {
    const client = initializeClient(apiKey);
    const transcript = await client.transcripts.get(transcriptId);

    if (transcript.status === 'error') {
      throw new TranscriptionError(transcript.error || 'Unknown error getting transcript');
    }

    return {
      text: transcript.text || '',
      confidence: transcript.confidence || 0,
      words: transcript.words || [],
      status: transcript.status || 'unknown',
      utterances: transcript.utterances || [],
    };
  } catch (error) {
    if (error instanceof TranscriptionError) {
      throw error;
    }
    throw new TranscriptionError(`Failed to get transcript: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const pollTranscriptionResult = async (
  transcriptId: string,
  apiKey: string,
  onProgress: (status: string) => void
): Promise<TranscriptionResponse> => {
  const client = initializeClient(apiKey);
  let attempts = 0;

  try {
    while (attempts < MAX_POLLING_ATTEMPTS) {
      const transcript = await client.transcripts.get(transcriptId);
      
      switch (transcript.status) {
        case 'completed':
          return {
            text: transcript.text || '',
            confidence: transcript.confidence || 0,
            words: transcript.words || [],
            status: 'completed',
            utterances: transcript.utterances || []
          };

        case 'error':
          throw new TranscriptionError(transcript.error || 'Unknown error during polling');

        case 'processing':
          const progress = Math.round((attempts / MAX_POLLING_ATTEMPTS) * 100);
          onProgress(`Processing transcript (${progress}%)`);
          break;

        default:
          onProgress(`Status: ${transcript.status}`);
      }

      await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL));
      attempts++;
    }

    throw new TranscriptionError('Transcription timed out');
  } catch (error) {
    if (error instanceof TranscriptionError) {
      throw error;
    }
    throw new TranscriptionError(`Polling failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const startTranscription = async (
  audioFile: File,
  apiKey: string,
  onProgress: (status: string) => void
): Promise<TranscriptionResponse> => {
  try {
    const transcriptId = await uploadAudioToAssemblyAI(audioFile, apiKey);
    return await pollTranscriptionResult(transcriptId, apiKey, onProgress);
  } catch (error) {
    throw new TranscriptionError(`Transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}; 