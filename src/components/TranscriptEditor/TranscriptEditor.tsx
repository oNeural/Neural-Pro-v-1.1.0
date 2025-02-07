import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useDebounce } from '../../hooks/useDebounce';
import { FontSelector } from './FontSelector';
import { Toolbar } from './Toolbar';
import { ZoomControls } from './ZoomControls';
import './TranscriptEditor.css';
import { ClipboardPaste } from 'lucide-react';

interface TranscriptEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}

export const TranscriptEditor = forwardRef<HTMLDivElement, TranscriptEditorProps>(({
  initialContent = '',
  onChange,
}, ref) => {
  // State
  const [currentZoom, setCurrentZoom] = useLocalStorage('zoom-level', 100);
  const [selectedFont, setSelectedFont] = useLocalStorage('selected-font', "'Poppins', sans-serif");
  const [content, setContent] = useState(initialContent);
  const [undoStack, setUndoStack] = useState<string[]>([initialContent]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Refs
  const editorRef = useRef<HTMLDivElement>(null);
  const zoomContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef(content);

  // Forward the editor ref to the contentEditable div
  useImperativeHandle(ref, () => editorRef.current as HTMLDivElement);

  // Constants
  const MIN_ZOOM = 50;
  const MAX_ZOOM = 200;
  const ZOOM_STEP = 10;
  const MAX_STACK_SIZE = 100;

  // Debounced save
  const debouncedSave = useDebounce((content: string) => {
    setIsSaving(true);
    localStorage.setItem('transcript', content);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
    }, 500);
  }, 1000);

  useEffect(() => {
    loadSavedTranscript();
  }, []);

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  useEffect(() => {
    if (initialContent !== content) {
      setContent(initialContent);
      setUndoStack([initialContent]);
      setRedoStack([]);
      
      if (editorRef.current) {
        editorRef.current.innerHTML = initialContent;
      }
    }
  }, [initialContent]);

  const loadSavedTranscript = () => {
    try {
      const savedTranscript = localStorage.getItem('transcript');
      if (savedTranscript) {
        setContent(savedTranscript);
        saveState(savedTranscript);
      }
    } catch (err) {
      console.error('Failed to load saved transcript!');
    }
  };

  const saveState = useCallback((newContent: string) => {
    setUndoStack(prev => {
      if (prev[prev.length - 1] === newContent) return prev;
      const newStack = [...prev, newContent];
      if (newStack.length > MAX_STACK_SIZE) {
        newStack.shift();
      }
      return newStack;
    });
    setRedoStack([]);
  }, []);

  const handleUndo = useCallback(() => {
    if (undoStack.length > 1) {
      const currentState = undoStack[undoStack.length - 1];
      const previousState = undoStack[undoStack.length - 2];
      
      setUndoStack(prev => prev.slice(0, -1));
      setRedoStack(prev => [...prev, currentState]);
      
      setContent(previousState);
      onChange?.(previousState);
      debouncedSave(previousState);
    }
  }, [undoStack, onChange, debouncedSave]);

  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      
      setRedoStack(prev => prev.slice(0, -1));
      setUndoStack(prev => [...prev, nextState]);
      
      setContent(nextState);
      onChange?.(nextState);
      debouncedSave(nextState);
    }
  }, [redoStack, onChange, debouncedSave]);

  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      if (newContent !== contentRef.current) {
        contentRef.current = newContent;
        setContent(newContent);
        saveState(newContent);
        onChange?.(newContent);
        debouncedSave(newContent);
      }
    }
  }, [onChange, debouncedSave]);

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
    if (editorRef.current) {
      editorRef.current.style.fontFamily = font;
      if (window.getSelection()?.rangeCount) {
        document.execCommand('fontName', false, font);
      }
      editorRef.current.focus();
    }
  };

  const updateZoom = (newZoom: number) => {
    const clampedZoom = Math.min(Math.max(newZoom, MIN_ZOOM), MAX_ZOOM);
    setCurrentZoom(clampedZoom);
    if (zoomContainerRef.current) {
      zoomContainerRef.current.style.transform = `scale(${clampedZoom / 100})`;
    }
  };

  const handleZoomIn = () => updateZoom(currentZoom + ZOOM_STEP);
  const handleZoomOut = () => updateZoom(currentZoom - ZOOM_STEP);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      updateZoom(currentZoom + (e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP));
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const textNode = document.createTextNode(text);
        range.deleteContents();
        range.insertNode(textNode);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
        handleContentChange();
      }
    } catch (error) {
      console.error('Failed to paste text:', error);
      // Use window.alert instead of toast since toast is not imported/available
      window.alert('Failed to paste text from clipboard');
    }
  };

  return (
    <div className="editor-container">
      <Toolbar
        onUndo={handleUndo}
        onRedo={handleRedo}
        isSaving={isSaving}
        lastSaved={lastSaved}
        editorRef={editorRef}
        onReplace={handleContentChange}
        onPaste={handlePaste}
      >
        <FontSelector
          selectedFont={selectedFont}
          onChange={handleFontChange}
        />
        <ZoomControls
          currentZoom={currentZoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
        />
      </Toolbar>

      <div className="content-wrapper" onWheel={handleWheel}>
        <div ref={zoomContainerRef} className="zoom-container">
          <div
            ref={editorRef}
            className="transcript"
            contentEditable
            suppressContentEditableWarning
            onInput={handleContentChange}
            style={{ 
              fontFamily: selectedFont,
              direction: 'ltr',
              unicodeBidi: 'plaintext',
              padding: '1rem',
              minHeight: '100%'
            }}
          />
        </div>
      </div>
    </div>
  );
});
