import { useState } from 'react';
import { Sparkles, Loader2, Users2 } from 'lucide-react';
import { TranscriptionSegment } from '../types/types';

interface AIPanelProps {
  segments: TranscriptionSegment[];
  onSegmentsUpdate: (segments: TranscriptionSegment[]) => void;
}

export const AIPanel = ({ segments, onSegmentsUpdate }: AIPanelProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const simulateAIProcessing = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
  };

  const handleIdentifySpeakers = async () => {
    await simulateAIProcessing();
    const updatedSegments = segments.map((segment, index) => ({
      ...segment,
      speaker: {
        id: `speaker_${(index % 2) + 1}`,
        name: `Speaker ${(index % 2) + 1}`,
        label: `Speaker ${(index % 2) + 1}`
      }
    }));
    onSegmentsUpdate(updatedSegments);
  };

  const handleImproveTranscription = async () => {
    await simulateAIProcessing();
    const updatedSegments = segments.map(segment => ({
      ...segment,
      confidence: Math.random() * 0.3 + 0.7 // Random confidence between 0.7 and 1.0
    }));
    onSegmentsUpdate(updatedSegments);
  };

  return (
    <div className="gradient-border">
      <div className="p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-500" />
          AI Tools
        </h3>

        <div className="space-y-4">
          <button
            onClick={handleIdentifySpeakers}
            disabled={isProcessing}
            className="w-full btn-secondary flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Users2 className="w-4 h-4" />
                Identify Speakers
              </>
            )}
          </button>

          <button
            onClick={handleImproveTranscription}
            disabled={isProcessing}
            className="w-full btn-secondary flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Improve Transcription
              </>
            )}
          </button>
        </div>

        <div className="text-sm text-gray-400">
          Use AI to enhance your transcription with speaker detection and improved accuracy.
        </div>
      </div>
    </div>
  );
};
