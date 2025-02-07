import React from 'react';

interface ZoomControlsProps {
  currentZoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  currentZoom,
  onZoomIn,
  onZoomOut
}) => {
  return (
    <div className="zoom-controls">
      <button
        onClick={onZoomOut}
        title="Zoom Out (Ctrl + -)"
        className="zoom-button"
      >
        <i className="fa-solid fa-minus" style={{ fontSize: '10px' }} />
      </button>
      <span className="zoom-level" title="Zoom Level">{currentZoom}%</span>
      <button
        onClick={onZoomIn}
        title="Zoom In (Ctrl + +)"
        className="zoom-button"
      >
        <i className="fa-solid fa-plus" style={{ fontSize: '10px' }} />
      </button>
    </div>
  );
};