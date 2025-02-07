import { TranscriptFormatType, TRANSCRIPT_FORMATS } from '../types/transcriptFormats';
import { TranscriptionUtterance } from '../services/assemblyAI';

const formatTimestamp = (ms: number, format: string): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((ms % 1000) / 100); // One digit millisecond

  switch (format) {
    case 'h:mm:ss:ms':
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${milliseconds}`;
    case '[hh:mm:ss]':
      return `[${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}]`;
    default:
      return '';
  }
};

export const formatTranscript = (
  utterances: TranscriptionUtterance[],
  format: TranscriptFormatType
): string => {
  const formatConfig = TRANSCRIPT_FORMATS[format];
  let formattedText = '';
  let lastSpeaker = '';

  utterances.forEach((utterance, index) => {
    const timestamp = formatConfig.hasTimestamps && formatConfig.timestampFormat
      ? formatTimestamp(utterance.start, formatConfig.timestampFormat)
      : '';
    
    const speakerLabel = utterance.speaker.replace('speaker_', 'Speaker ');

    switch (format) {
      case 'iScribe+':
        formattedText += `${speakerLabel}:\n\n${utterance.text}\n\n`;
        break;

      case 'LT-QC-CF':
        if (index > 0 && (lastSpeaker !== utterance.speaker || utterance.text.length > 150)) {
          formattedText += '\n';
        }
        formattedText += `${timestamp} ${speakerLabel}: ${utterance.text}\n`;
        lastSpeaker = utterance.speaker;
        break;

      case 'ZkPo+':
        formattedText += `${timestamp}: ${speakerLabel}:\n\n${utterance.text}\n\n`;
        break;
    }
  });

  return formattedText.trim();
}; 