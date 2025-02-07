import React, { useState } from 'react';
import { Save, Download, Keyboard, FileText, Gauge } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { PlaybackSettings } from '../types/types';
import { TranscriptFormatType, TRANSCRIPT_FORMATS } from '../types/transcriptFormats';

interface ToolbarProps {
  playbackSettings: PlaybackSettings;
  setPlaybackSettings: (settings: PlaybackSettings) => void;
  fileName: string;
  lastSaved: number | null;
  isSaving: boolean;
  content: string;
  transcriptFormat?: TranscriptFormatType;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  playbackSettings,
  setPlaybackSettings,
  fileName,
  lastSaved,
  isSaving,
  content,
  transcriptFormat
}) => {
  const [isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'txt' | 'html' | 'doc' | 'pdf'>('txt');

  const handleExport = () => {
    if (!content) return;

    let exportContent = content;
    let mimeType = 'text/plain';
    let fileExtension = 'txt';

    // Get the editor's content with formatting
    const editor = document.querySelector('[contenteditable="true"]') as HTMLElement;
    if (!editor) return;

    switch (exportFormat) {
      case 'html':
        exportContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${fileName} - Transcript</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      line-height: 1.6; 
      max-width: 800px; 
      margin: 2rem auto; 
      padding: 0 1rem; 
    }
    .timestamp { 
      color: #666; 
      font-family: monospace; 
    }
    .transcript-content {
      white-space: pre-wrap;
      word-break: break-word;
    }
  </style>
</head>
<body>
  <div class="transcript-content">
    ${editor.innerHTML}
  </div>
</body>
</html>`;
        mimeType = 'text/html';
        fileExtension = 'html';
        break;

      case 'doc':
        // For .doc format, we'll use Word-specific HTML
        exportContent = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>${fileName} - Transcript</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>90</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    /* Word-specific styles */
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
    }
    .transcript-content {
      white-space: pre-wrap;
      word-break: break-word;
    }
    p {
      margin: 0;
      padding: 0;
      margin-bottom: 1em;
    }
    br {
      mso-data-placement: same-cell;
    }
  </style>
</head>
<body>
  <div class="transcript-content">
    ${editor.innerHTML
      .replace(/\n/g, '<br clear="all"/>')
      .replace(/<div>/g, '<p>')
      .replace(/<\/div>/g, '</p>')
      .replace(/<p>\s*<\/p>/g, '<p>&nbsp;</p>')}
  </div>
</body>
</html>`;
        mimeType = 'application/msword';
        fileExtension = 'doc';
        break;

      case 'pdf':
        const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${fileName} - Transcript</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      line-height: 1.6;
      padding: 2rem;
      max-width: 100%;
    }
    .timestamp { 
      color: #666; 
      font-family: monospace; 
    }
    .transcript-content {
      white-space: pre-wrap;
      word-break: break-word;
    }
    @media print {
      body {
        padding: 0;
      }
      .transcript-content {
        page-break-inside: auto;
      }
    }
  </style>
</head>
<body>
  <div class="transcript-content">
    ${editor.innerHTML}
  </div>
</body>
</html>`;
        
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(htmlContent);
          printWindow.document.close();
          printWindow.print();
        }
        return;

      default:
        // For plain text, preserve line breaks but remove HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = editor.innerHTML
          .replace(/<div>/g, '\n')
          .replace(/<\/div>/g, '')
          .replace(/<br\s*\/?>/g, '\n')
          .replace(/<p>/g, '\n')
          .replace(/<\/p>/g, '\n');
        
        // Get text content and fix line breaks
        exportContent = tempDiv.textContent || tempDiv.innerText;
        
        // Clean up multiple line breaks and trim
        exportContent = exportContent
          .replace(/\n\s*\n\s*\n/g, '\n\n')  // Replace triple line breaks with double
          .replace(/^\s+|\s+$/g, '')          // Trim start and end
          .replace(/\r\n|\r|\n/g, '\r\n');    // Normalize line endings to CRLF
        
        break;
    }

    try {
      const blob = new Blob([exportContent], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName.replace(/\.[^/.]+$/, '')}_transcript.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting file:', error);
    }
  };

  return (
    <div className="px-4 py-1 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {transcriptFormat && (
          <div className="flex items-center gap-2 px-2 py-1 bg-gray-800/50 rounded-lg border border-gray-700">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs text-indigo-400 font-medium">
              {TRANSCRIPT_FORMATS[transcriptFormat].label}
            </span>
          </div>
        )}
        {lastSaved && (
          <div className="text-xs text-gray-500">
            {isSaving ? (
              <span className="flex items-center gap-1">
                <Save className="w-3 h-3 animate-pulse" />
                Saving...
              </span>
            ) : (
              <span>
                Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value as 'txt' | 'html' | 'doc' | 'pdf')}
          className="bg-gray-800 text-gray-200 rounded-lg px-2 py-1 text-xs border border-gray-700"
        >
          <option value="txt">Plain Text (.txt)</option>
          <option value="html">HTML (.html)</option>
          <option value="doc">Word (.doc)</option>
          <option value="pdf">PDF (Print)</option>
        </select>

        <button
          onClick={handleExport}
          disabled={!content}
          className="flex items-center gap-1.5 px-2 py-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          data-export-button
        >
          <Download className="w-3.5 h-3.5" />
          Export
        </button>

        <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-800 rounded-lg border border-gray-700">
          <Gauge className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs text-gray-200">
            {playbackSettings.speed}x
          </span>
        </div>

        <button
          onClick={() => setIsKeyboardShortcutsOpen(true)}
          className="px-2 py-1 hover:bg-gray-800 rounded-lg transition-colors border border-gray-700 flex items-center gap-1.5"
          title="Keyboard shortcuts"
        >
          <Keyboard className="w-3.5 h-3.5" />
          <span className="text-xs">Shortcuts</span>
        </button>
      </div>

      <KeyboardShortcutsModal
        isOpen={isKeyboardShortcutsOpen}
        onClose={() => setIsKeyboardShortcutsOpen(false)}
        onOpenSettings={() => {}}
      />
    </div>
  );
};
