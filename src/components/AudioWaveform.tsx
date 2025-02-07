import React, { useEffect, useRef, forwardRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { PlaybackSettings } from '../types/types';

interface AudioWaveformProps {
  audioUrl: string;
  isPlaying: boolean;
  currentTime: number;
  playbackSettings: PlaybackSettings;
  onTimeUpdate: (time: number) => void;
}

export const AudioWaveform = forwardRef<HTMLAudioElement, AudioWaveformProps>(({
  audioUrl,
  isPlaying,
  currentTime,
  playbackSettings,
  onTimeUpdate
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    wavesurferRef.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#4B5563',
      progressColor: '#06B6D4',
      cursorColor: '#06B6D4',
      barWidth: 2,
      barGap: 1,
      height: 100,
      normalize: true,
      backend: 'MediaElement',
      mediaControls: false,
      hideScrollbar: true,
      interact: true,
      plugins: []
    });

    wavesurferRef.current.load(audioUrl);

    wavesurferRef.current.on('audioprocess', (time) => {
      if (isFinite(time)) {
        onTimeUpdate(time);
      }
    });

    wavesurferRef.current.on('ready', () => {
      try {
        if (audioRef.current && isFinite(playbackSettings.speed)) {
          audioRef.current.playbackRate = playbackSettings.speed;
        }
        if (wavesurferRef.current && isFinite(playbackSettings.speed)) {
          wavesurferRef.current.setPlaybackRate(playbackSettings.speed);
        }
      } catch (error) {
        console.error('Error setting initial playback rate:', error);
      }
    });

    return () => {
      wavesurferRef.current?.destroy();
    };
  }, [audioUrl]);

  useEffect(() => {
    if (!wavesurferRef.current) return;

    if (isPlaying) {
      wavesurferRef.current.play();
    } else {
      wavesurferRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    try {
      if (!wavesurferRef.current || !audioRef.current || !isFinite(playbackSettings.speed)) return;
      
      // Ensure speed is within valid range (0.25 to 4.0)
      const validSpeed = Math.max(0.25, Math.min(4.0, playbackSettings.speed));
      
      audioRef.current.playbackRate = validSpeed;
      wavesurferRef.current.setPlaybackRate(validSpeed);
    } catch (error) {
      console.error('Error updating playback rate:', error);
    }
  }, [playbackSettings.speed]);

  useEffect(() => {
    if (!wavesurferRef.current || !isFinite(playbackSettings.volume)) return;
    wavesurferRef.current.setVolume(playbackSettings.volume);
  }, [playbackSettings.volume]);

  useEffect(() => {
    try {
      if (!wavesurferRef.current || !isFinite(currentTime)) return;
      
      const duration = wavesurferRef.current.getDuration();
      if (!isFinite(duration) || duration <= 0) return;
      
      const currentTimeInSeconds = wavesurferRef.current.getCurrentTime();
      if (!isFinite(currentTimeInSeconds)) return;
      
      if (Math.abs(currentTimeInSeconds - currentTime) > 0.5) {
        const seekPosition = Math.max(0, Math.min(currentTime / duration, 1));
        wavesurferRef.current.seekTo(seekPosition);
      }
    } catch (error) {
      console.error('Error seeking to position:', error);
    }
  }, [currentTime]);

  return (
    <div className="rounded-lg overflow-hidden">
      <div ref={containerRef} className="w-full" />
      <audio 
        ref={(el) => {
          audioRef.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) ref.current = el;
        }}
        src={audioUrl} 
        style={{ display: 'none' }} 
      />
    </div>
  );
});
