import { TranscriptFormatType } from './transcriptFormats';

export type TimestampFormat = 'HH:mm:ss' | 'mm:ss' | 'ss.SSS' | 'none';

export interface KeyboardShortcut {
  id: string;
  description: string;
  defaultKey: string;
  currentKey: string;
}

export interface Speaker {
  id: string;
  name: string;
  label: string;
}

export interface TranscriptionSegment {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  speaker?: Speaker;
}

export interface TranscriptionProject {
  id: string;
  name: string;
  fileName: string;
  content: string;
  lastModified: number;
  segments: any[];
  mediaType: 'audio' | 'video';
  mediaData?: number[];
  duration: number;
  transcriptFormat: TranscriptFormatType;
  transcriptionResult?: {
    text: string;
    utterances?: any[];
    status: string;
  };
}

export interface PlaybackSettings {
  speed: number;
  volume: number;
}

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  playbackSettings: PlaybackSettings;
  onPlaybackSettingsChange: (settings: PlaybackSettings) => void;
}
