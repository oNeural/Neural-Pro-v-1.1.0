import React, { forwardRef, useEffect } from 'react';
import { PlaybackSettings } from '../types/types';

interface VideoPlayerProps {
  videoUrl: string;
  isPlaying: boolean;
  currentTime: number;
  playbackSettings: PlaybackSettings;
  onTimeUpdate: (time: number) => void;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({
  videoUrl,
  isPlaying,
  currentTime,
  playbackSettings,
  onTimeUpdate
}, ref) => {
  useEffect(() => {
    const videoElement = (ref as React.RefObject<HTMLVideoElement>)?.current;
    if (!videoElement) return;

    if (isPlaying) {
      videoElement.play();
    } else {
      videoElement.pause();
    }
  }, [isPlaying, ref]);

  useEffect(() => {
    const videoElement = (ref as React.RefObject<HTMLVideoElement>)?.current;
    if (!videoElement) return;

    videoElement.playbackRate = playbackSettings.speed;
    videoElement.volume = playbackSettings.volume;
  }, [playbackSettings, ref]);

  return (
    <video
      ref={ref}
      src={videoUrl}
      className="w-full rounded-lg"
      onTimeUpdate={(e) => onTimeUpdate(e.currentTarget.currentTime)}
      controls={false}
    />
  );
});
