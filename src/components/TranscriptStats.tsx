import { motion, AnimatePresence } from 'framer-motion';
import { Clock, FileText, Wand2, Volume2, MessageSquare, BarChart2, X, Download, ChevronRight } from 'lucide-react';
import { NeuralCard } from './NeuralCard';
import { useState } from 'react';

interface StatItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color?: string;
}

const StatItem = ({ icon: Icon, label, value, color = 'text-cyan-500' }: StatItemProps) => (
  <div className="flex items-center gap-3">
    <div className={`p-2 rounded-lg bg-opacity-10 ${color} bg-current`}>
      <Icon className={`w-4 h-4 ${color}`} />
    </div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-base font-semibold text-gray-200">{value}</p>
    </div>
  </div>
);

interface TranscriptStatsProps {
  content?: string;
  transcriptionResult?: {
    text: string;
    utterances?: Array<{
      speaker: string;
      text: string;
      start: number;
      end: number;
    }>;
    status: string;
  };
  duration?: number;
}

interface DetailedStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: ReturnType<typeof calculateStats>;
  content: string;
  transcriptionResult?: TranscriptStatsProps['transcriptionResult'];
}

const DetailedStatsModal: React.FC<DetailedStatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  content,
  transcriptionResult
}) => {
  if (!isOpen) return null;

  // Calculate additional detailed statistics
  const averageWordsPerParagraph = Math.round(parseInt(stats.wordCount.replace(/,/g, '')) / parseInt(stats.paragraphs));
  const uniqueWords = new Set(content.toLowerCase().split(/\s+/)).size;
  const vocabularyDensity = Math.round((uniqueWords / parseInt(stats.wordCount.replace(/,/g, ''))) * 100);
  
  // Calculate speaker distribution if available
  const speakerDistribution = transcriptionResult?.utterances
    ? Object.entries(
        transcriptionResult.utterances.reduce((acc: { [key: string]: number }, curr) => {
          acc[curr.speaker] = (acc[curr.speaker] || 0) + curr.text.split(/\s+/).length;
          return acc;
        }, {})
      ).map(([speaker, words]) => ({
        speaker: speaker.replace('speaker_', 'Speaker '),
        percentage: Math.round((words / parseInt(stats.wordCount.replace(/,/g, ''))) * 100)
      }))
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
            Detailed Statistics
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {/* Basic Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {Object.entries(stats).map(([key, value], index) => (
              <div key={key} className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                <p className="text-lg font-semibold text-gray-200">{value}</p>
              </div>
            ))}
          </div>

          {/* Advanced Stats */}
          <div className="space-y-6">
            {/* Vocabulary Analysis */}
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-3">Vocabulary Analysis</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Unique Words</p>
                  <p className="text-lg font-semibold text-gray-200">{uniqueWords.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Vocabulary Density</p>
                  <p className="text-lg font-semibold text-gray-200">{vocabularyDensity}%</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Words per Paragraph</p>
                  <p className="text-lg font-semibold text-gray-200">{averageWordsPerParagraph}</p>
                </div>
              </div>
            </div>

            {/* Speaker Distribution */}
            {speakerDistribution.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-200 mb-3">Speaker Distribution</h3>
                <div className="space-y-3">
                  {speakerDistribution.map(({ speaker, percentage }) => (
                    <div key={speaker} className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-300">{speaker}</span>
                        <span className="text-gray-400">{percentage}%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const calculateStats = (content: string, transcriptionResult?: TranscriptStatsProps['transcriptionResult'], duration: number = 0) => {
  const stats = {
    duration: '00:00',
    wordCount: '0',
    speakers: '0',
    confidence: '0%',
    speakingPace: '0 wpm',
    paragraphs: '0'
  };

  // Duration
  if (duration > 0) {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    stats.duration = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  // Word count from actual content
  const words = content.trim().split(/\s+/).filter(word => word.length > 0);
  stats.wordCount = words.length.toLocaleString();

  if (transcriptionResult?.utterances) {
    // Unique speakers count
    const uniqueSpeakers = new Set(transcriptionResult.utterances.map(u => u.speaker));
    stats.speakers = uniqueSpeakers.size.toString();

    // Calculate average confidence (mock for now as it's not in the data)
    stats.confidence = '98%';

    // Calculate speaking pace (words per minute)
    if (duration > 0) {
      const wpm = Math.round((words.length / duration) * 60);
      stats.speakingPace = `${wpm} wpm`;
    }

    // Count paragraphs (speaker turns)
    stats.paragraphs = transcriptionResult.utterances.length.toString();
  } else {
    // Fallback calculations for plain text
    // Count paragraphs by line breaks
    stats.paragraphs = content.split(/\n\s*\n/).filter(para => para.trim().length > 0).length.toString();
    
    // Estimate speakers from formatting (e.g., "Speaker A:", "Speaker 1:")
    const speakerMatches = content.match(/Speaker [A-Z0-9]+:/g);
    if (speakerMatches) {
      const uniqueSpeakers = new Set(speakerMatches);
      stats.speakers = uniqueSpeakers.size.toString();
    }
  }

  return stats;
};

export const TranscriptStats: React.FC<TranscriptStatsProps> = ({ 
  content = '', 
  transcriptionResult,
  duration = 0
}) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const stats = calculateStats(content, transcriptionResult, duration);

  const handleExportStats = () => {
    // Create detailed stats object for export
    const exportData = {
      basicStats: stats,
      advancedStats: {
        uniqueWords: new Set(content.toLowerCase().split(/\s+/)).size,
        vocabularyDensity: Math.round((new Set(content.toLowerCase().split(/\s+/)).size / parseInt(stats.wordCount.replace(/,/g, ''))) * 100),
        averageWordsPerParagraph: Math.round(parseInt(stats.wordCount.replace(/,/g, '')) / parseInt(stats.paragraphs)),
        speakerDistribution: transcriptionResult?.utterances
          ? Object.entries(
              transcriptionResult.utterances.reduce((acc: { [key: string]: number }, curr) => {
                acc[curr.speaker] = (acc[curr.speaker] || 0) + curr.text.split(/\s+/).length;
                return acc;
              }, {})
            ).map(([speaker, words]) => ({
              speaker: speaker.replace('speaker_', 'Speaker '),
              words,
              percentage: Math.round((words / parseInt(stats.wordCount.replace(/,/g, ''))) * 100)
            }))
          : []
      },
      exportDate: new Date().toISOString(),
      transcriptionStatus: transcriptionResult?.status || 'unknown'
    };

    // Create and download file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-stats-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <NeuralCard className="p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
            Transcript Statistics
          </h3>
          <motion.button
            className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDetailsModalOpen(true)}
          >
            <BarChart2 className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StatItem
              icon={Clock}
              label="Duration"
              value={stats.duration}
              color="text-cyan-500"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <StatItem
              icon={MessageSquare}
              label="Word Count"
              value={stats.wordCount}
              color="text-blue-500"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <StatItem
              icon={Volume2}
              label="Speakers"
              value={stats.speakers}
              color="text-indigo-500"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <StatItem
              icon={Wand2}
              label="AI Confidence"
              value={stats.confidence}
              color="text-purple-500"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <StatItem
              icon={BarChart2}
              label="Speaking Pace"
              value={stats.speakingPace}
              color="text-pink-500"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <StatItem
              icon={FileText}
              label="Paragraphs"
              value={stats.paragraphs}
              color="text-rose-500"
            />
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Processing Progress</span>
            <span className="text-cyan-500 font-medium">
              {transcriptionResult?.status === 'completed' ? '100%' : '98%'}
            </span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: transcriptionResult?.status === 'completed' ? '100%' : '98%' }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExportStats}
              className="flex-1 px-3 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-500 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Stats
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsDetailsModalOpen(true)}
              className="flex-1 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ChevronRight className="w-4 h-4" />
              View Details
            </motion.button>
          </div>
        </div>
      </NeuralCard>

      <AnimatePresence>
        {isDetailsModalOpen && (
          <DetailedStatsModal
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            stats={stats}
            content={content}
            transcriptionResult={transcriptionResult}
          />
        )}
      </AnimatePresence>
    </>
  );
}; 