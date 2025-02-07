import React from 'react';
import { Check } from 'lucide-react';
import { TranscriptFormatType, TRANSCRIPT_FORMATS } from '../types/transcriptFormats';

interface TranscriptFormatSelectorProps {
  selectedFormat: TranscriptFormatType;
  onFormatChange: (format: TranscriptFormatType) => void;
  onClose?: () => void;
}

export const TranscriptFormatSelector: React.FC<TranscriptFormatSelectorProps> = ({
  selectedFormat,
  onFormatChange,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-xl font-semibold text-gray-100">Select Transcript Format</h3>
          <p className="text-gray-400 mt-2">Choose how you want your transcript to be formatted</p>
        </div>

        {/* Format Options */}
        <div className="p-6 space-y-4">
          {Object.values(TRANSCRIPT_FORMATS).map((format) => (
            <div
              key={format.id}
              onClick={() => onFormatChange(format.id)}
              className={`group relative p-4 rounded-lg cursor-pointer transition-all ${
                selectedFormat === format.id
                  ? 'bg-indigo-500/10 border-indigo-500'
                  : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-gray-600'
              } border`}
            >
              <div className="flex items-start gap-4">
                {/* Selection indicator */}
                <div className={`mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                  selectedFormat === format.id
                    ? 'border-indigo-500 bg-indigo-500'
                    : 'border-gray-600 group-hover:border-gray-500'
                }`}>
                  {selectedFormat === format.id && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>

                {/* Format details */}
                <div className="flex-1">
                  <h4 className={`font-medium mb-1 ${
                    selectedFormat === format.id ? 'text-indigo-400' : 'text-gray-200'
                  }`}>
                    {format.label}
                  </h4>
                  <p className="text-sm text-gray-400">{format.description}</p>

                  {/* Format example */}
                  <div className="mt-3 p-3 rounded bg-gray-950/50 border border-gray-800 font-mono text-sm">
                    {format.id === 'iScribe+' && (
                      <div className="text-gray-300">
                        Speaker A:<br/><br/>
                        This is what Speaker A said.
                      </div>
                    )}
                    {format.id === 'LT-QC-CF' && (
                      <div className="text-gray-300">
                        0:56:32:0 Speaker A: This is what Speaker A said.
                      </div>
                    )}
                    {format.id === 'ZkPo+' && (
                      <div className="text-gray-300">
                        [00:56:32]: Speaker A:<br/><br/>
                        This is what Speaker A said.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onClose?.()}
            className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}; 