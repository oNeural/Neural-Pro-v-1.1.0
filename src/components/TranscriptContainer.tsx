import React, { forwardRef } from 'react';
import { TranscriptEditor } from './TranscriptEditor/TranscriptEditor';

interface TranscriptContainerProps {
  content: string;
  onContentChange: (content: string) => void;
  currentTime: number;
}

export const TranscriptContainer = forwardRef<HTMLDivElement, TranscriptContainerProps>(({
  content,
  onContentChange,
  currentTime
}, ref) => {
  return (
    <div className="h-full bg-gray-900 rounded-lg overflow-hidden shadow-xl">
      <TranscriptEditor
        ref={ref}
        initialContent={content}
        onChange={onContentChange}
      />
    </div>
  );
}); 