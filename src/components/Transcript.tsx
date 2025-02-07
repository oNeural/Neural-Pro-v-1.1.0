import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { TranscriptionProject } from '../types/types';

interface TranscriptProps {
  value: string;
  duration: number;
  transcriptionResult?: TranscriptionProject['transcriptionResult'];
  onChange: (content: string) => void;
}

export const Transcript: React.FC<TranscriptProps> = ({
  value,
  duration,
  transcriptionResult,
  onChange
}) => {
  return (
    <div className="flex flex-col gap-4">
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={{
          toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['clean']
          ]
        }}
      />
    </div>
  );
}; 