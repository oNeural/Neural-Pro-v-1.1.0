import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileAudio, FileVideo, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TranscriptFormatType, TRANSCRIPT_FORMATS } from '../types/transcriptFormats';
import { TranscriptFormatSelector } from './TranscriptFormatSelector';
import { loadProject } from '../utils/storage';

interface DropZoneProps {
  onFileSelect: (file: File | null, skipTranscription: boolean, format: TranscriptFormatType) => void;
  isExistingProject?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFileSelect, isExistingProject = false }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<TranscriptFormatType>('iScribe+');
  const [showFormatSelector, setShowFormatSelector] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      
      if (isExistingProject) {
        // For existing projects, use the project's existing format
        const project = loadProject(window.location.pathname.split('/').pop() || '');
        if (project?.transcriptFormat) {
          onFileSelect(file, true, project.transcriptFormat);
        } else {
          onFileSelect(file, true, selectedFormat);
        }
      } else {
        // For new projects, show format selector
        setShowFormatSelector(true);
      }
    }
  }, [isExistingProject, onFileSelect, selectedFormat]);

  const handleFormatSelect = (format: TranscriptFormatType) => {
    setSelectedFormat(format);
  };

  const handleFormatConfirm = () => {
    if (selectedFile) {
      onFileSelect(selectedFile, isExistingProject, selectedFormat);
    }
    setShowFormatSelector(false);
  };

  const handleEmptyEditor = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    onFileSelect(null, true, selectedFormat);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg'],
      'video/*': ['.mp4', '.webm', '.ogg']
    },
    multiple: false,
    maxSize: 500 * 1024 * 1024 // 500MB max file size
  });

  const supportedFormats = [
    { type: 'Audio', formats: ['MP3', 'WAV', 'M4A', 'OGG'], icon: FileAudio },
    { type: 'Video', formats: ['MP4', 'WEBM'], icon: FileVideo }
  ];

  // Add neural network animation
  const generateNeuralPoints = () => {
    const points = [];
    for (let i = 0; i < 15; i++) {
      points.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 3,
        velocity: Math.random() * 0.3 + 0.2
      });
    }
    return points;
  };

  const points = generateNeuralPoints();

  // Generate connections between points
  const generateConnections = (points: any[]) => {
    const connections = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const distance = Math.sqrt(
          Math.pow(points[i].x - points[j].x, 2) + 
          Math.pow(points[i].y - points[j].y, 2)
        );
        if (distance < 40) {
          connections.push({ from: points[i], to: points[j], distance });
        }
      }
    }
    return connections;
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto"
      >
        <div
          {...getRootProps()}
          className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
            isDragActive
              ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 shadow-lg shadow-cyan-500/10'
              : 'bg-gray-900/50 hover:bg-gray-900/70'
          }`}
        >
          {/* Neural Network Background */}
          <div className="absolute inset-0 overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-30">
              <pattern id="neural-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                {generateConnections(points).map((connection, index) => (
                  <motion.line
                    key={`connection-${index}`}
                    x1={connection.from.x}
                    y1={connection.from.y}
                    x2={connection.to.x}
                    y2={connection.to.y}
                    className="stroke-cyan-500/50"
                    strokeWidth={1}
                    animate={{
                      opacity: [0.3, 0.7, 0.3]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                ))}
                {points.map((point, index) => (
                  <motion.circle
                    key={`point-${index}`}
                    cx={point.x}
                    cy={point.y}
                    r={point.size}
                    className="fill-cyan-400"
                    animate={{
                      y: [point.y, point.y - 20, point.y],
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 1.3, 1]
                    }}
                    transition={{
                      duration: 5 / point.velocity,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#neural-pattern)" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent" />
          </div>

          {/* Existing animated background gradient */}
          <AnimatePresence>
            {isDragActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 blur-xl"
              />
            )}
          </AnimatePresence>

          {/* Content */}
          <div className="relative p-12 text-center">
            <input {...getInputProps()} />
            
            {/* Icon container with glow effect */}
            <div className="relative mx-auto mb-6 w-16 h-16">
              <div className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-300 ${
                isDragActive ? 'bg-cyan-500/30 opacity-100' : 'bg-cyan-500/0 opacity-0'
              }`} />
              <div className={`relative flex items-center justify-center w-16 h-16 rounded-full border-2 transition-colors duration-300 ${
                isDragActive
                  ? 'border-cyan-500/50 bg-cyan-500/10'
                  : 'border-gray-700 bg-gray-800/50'
              }`}>
                <Upload className={`w-8 h-8 transition-colors duration-300 ${
                  isDragActive ? 'text-cyan-400' : 'text-gray-400'
                }`} />
              </div>
            </div>

            {/* Text content */}
            <h3 className="text-xl font-medium text-gray-200 mb-3">
              {isExistingProject ? 'Load Media File' : 'Drop your media file here'}
            </h3>
            <p className="text-gray-400 mb-6">
              or click to browse from your computer
            </p>

            {/* Format badges */}
            <div className="flex flex-col gap-4 max-w-md mx-auto">
              {supportedFormats.map(({ type, formats, icon: Icon }) => (
                <div 
                  key={type}
                  className="flex items-center gap-2 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50"
                >
                  <Icon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-300">{type}:</span>
                  <div className="flex flex-wrap gap-2">
                    {formats.map(format => (
                      <span 
                        key={format}
                        className="px-2 py-0.5 text-xs rounded-md bg-gray-700/50 text-gray-300"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Empty editor option */}
            {!isExistingProject && (
              <div className="mt-8 pt-6 border-t border-gray-800">
                <button
                  onClick={handleEmptyEditor}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors text-gray-300 hover:text-gray-200"
                >
                  <Plus className="w-4 h-4" />
                  Start with an empty editor
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Format Selector Modal - only shown for new projects */}
      <AnimatePresence>
        {showFormatSelector && !isExistingProject && (
          <TranscriptFormatSelector
            selectedFormat={selectedFormat}
            onFormatChange={handleFormatSelect}
            onClose={() => {
              handleFormatConfirm();
              setShowFormatSelector(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};
