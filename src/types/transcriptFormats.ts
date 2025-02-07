export type TranscriptFormatType = 'iScribe+' | 'LT-QC-CF' | 'ZkPo+';

export interface TranscriptFormat {
  id: TranscriptFormatType;
  label: string;
  description: string;
  hasTimestamps: boolean;
  timestampFormat?: string;
  speakerFormat: string;
}

export const TRANSCRIPT_FORMATS: Record<TranscriptFormatType, TranscriptFormat> = {
  'iScribe+': {
    id: 'iScribe+',
    label: 'iScribe+',
    description: 'No timestamps, speaker labels on separate lines',
    hasTimestamps: false,
    speakerFormat: 'newline'
  },
  'LT-QC-CF': {
    id: 'LT-QC-CF',
    label: 'LT-QC-CF',
    description: 'Timestamps in h:mm:ss:ms format, speaker and text on same line',
    hasTimestamps: true,
    timestampFormat: 'h:mm:ss:ms',
    speakerFormat: 'inline'
  },
  'ZkPo+': {
    id: 'ZkPo+',
    label: 'ZkPo+',
    description: 'Timestamps in [hh:mm:ss] format, speaker labels with line breaks',
    hasTimestamps: true,
    timestampFormat: '[hh:mm:ss]',
    speakerFormat: 'newline'
  }
}; 