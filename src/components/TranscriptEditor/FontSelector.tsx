import React from 'react';

interface FontSelectorProps {
  selectedFont: string;
  onChange: (font: string) => void;
}

const FONT_OPTIONS = [
  { label: 'Poppins', value: "'Poppins', sans-serif" },
  { label: 'Inter', value: "'Inter', sans-serif" },
  { label: 'Roboto', value: "'Roboto', sans-serif" },
  { label: 'Open Sans', value: "'Open Sans', sans-serif" },
  { label: 'Lato', value: "'Lato', sans-serif" },
  { label: 'Montserrat', value: "'Montserrat', sans-serif" },
  { label: 'Source Code Pro', value: "'Source Code Pro', monospace" },
  { label: 'Fira Code', value: "'Fira Code', monospace" },
];

export const FontSelector: React.FC<FontSelectorProps> = ({
  selectedFont,
  onChange
}) => {
  return (
    <select
      value={selectedFont}
      onChange={(e) => onChange(e.target.value)}
      className="font-selector"
      title="Select Font"
    >
      {FONT_OPTIONS.map(({ label, value }) => (
        <option key={value} value={value} style={{ fontFamily: value }}>
          {label}
        </option>
      ))}
    </select>
  );
};