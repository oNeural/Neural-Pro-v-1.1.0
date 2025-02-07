import React from 'react';
import { FindReplacePanel } from '../FindReplace/FindReplacePanel';
import { ClipboardPaste } from 'lucide-react';

interface ToolbarProps {
  children: React.ReactNode;
  onUndo: () => void;
  onRedo: () => void;
  isSaving: boolean;
  lastSaved: Date | null;
  editorRef: React.RefObject<HTMLDivElement>;
  onReplace?: () => void;
  onPaste: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  children,
  onUndo,
  onRedo,
  isSaving,
  lastSaved,
  editorRef,
  onReplace,
  onPaste
}) => {
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <button title="Undo (Ctrl+Z)" onClick={onUndo}>
          <i className="fa-solid fa-rotate-left" />
        </button>
        <button title="Redo (Ctrl+Y)" onClick={onRedo}>
          <i className="fa-solid fa-rotate-right" />
        </button>
        
        <span className="divider" />
        
        <button title="Cut (Ctrl+X)" onClick={() => document.execCommand('cut')}>
          <i className="fa-solid fa-scissors" />
        </button>
        <button title="Copy (Ctrl+C)" onClick={() => document.execCommand('copy')}>
          <i className="fa-regular fa-copy" />
        </button>
        <button title="Paste (Ctrl+V)" onClick={onPaste}>
          <ClipboardPaste className="w-4 h-4" />
        </button>
        
        <span className="divider" />
        
        <button title="Bold (Ctrl+B)" onClick={() => document.execCommand('bold')}>
          <i className="fa-solid fa-bold" />
        </button>
        <button title="Italic (Ctrl+I)" onClick={() => document.execCommand('italic')}>
          <i className="fa-solid fa-italic" />
        </button>
        <button title="Underline (Ctrl+U)" onClick={() => document.execCommand('underline')}>
          <i className="fa-solid fa-underline" />
        </button>
        
        <span className="divider" />
        
        {children}

        <span className="divider" />
        
        <FindReplacePanel 
          editorRef={editorRef}
          onReplace={onReplace}
        />
      </div>

      <div className="save-status">
        {isSaving ? (
          <span className="saving">
            <i className="fa-solid fa-circle-notch fa-spin" />
            Saving...
          </span>
        ) : lastSaved ? (
          <span className="saved">
            <i className="fa-solid fa-check" />
            Saved
          </span>
        ) : null}
      </div>
    </div>
  );
};