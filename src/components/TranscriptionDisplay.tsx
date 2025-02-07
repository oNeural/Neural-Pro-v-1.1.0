import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useAutoSaveStore } from '../store/autoSaveStore';
import { TranscriptionResponse } from '../services/assemblyAI';
import { TranscriptFormatType } from '../types/transcriptFormats';
import { formatTranscript } from '../utils/transcriptFormatter';
import { TranscriptFormatSelector } from './TranscriptFormatSelector';
import { TranscriptContainer } from './TranscriptContainer';

interface TranscriptionDisplayProps {
  initialContent: string | TranscriptionResponse;
  onContentChange: (content: string) => void;
}

export const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({
  initialContent,
  onContentChange
}) => {
  const [selectedFormat, setSelectedFormat] = useState<TranscriptFormatType>('iScribe+');
  const [formattedContent, setFormattedContent] = useState('');
  const setLastSaved = useAutoSaveStore(state => state.setLastSaved);

  // Memoize the content formatting
  const formatContent = useCallback((content: string | TranscriptionResponse, format: TranscriptFormatType) => {
    if (typeof content === 'string') {
      return content;
    } else if (content?.utterances) {
      return formatTranscript(content.utterances, format);
    }
    return '';
  }, []);

  // Update content when initialContent or format changes
  useEffect(() => {
    const newContent = formatContent(initialContent, selectedFormat);
    if (newContent !== formattedContent) {
      setFormattedContent(newContent);
      onContentChange(newContent);
    }
  }, [initialContent, selectedFormat, formatContent, onContentChange]);

  const handleFormatChange = useCallback((format: TranscriptFormatType) => {
    setSelectedFormat(format);
  }, []);

  // Memoize the format selector to prevent unnecessary re-renders
  const formatSelector = useMemo(() => {
    if (typeof initialContent !== 'string' && initialContent?.utterances) {
      return (
        <TranscriptFormatSelector
          selectedFormat={selectedFormat}
          onFormatChange={handleFormatChange}
        />
      );
    }
    return null;
  }, [initialContent, selectedFormat, handleFormatChange]);

  return (
    <div className="flex flex-col gap-4">
      {formatSelector}
      <TranscriptContainer
        content={formattedContent}
        onContentChange={onContentChange}
        currentTime={0}
      />
    </div>
  );
};
