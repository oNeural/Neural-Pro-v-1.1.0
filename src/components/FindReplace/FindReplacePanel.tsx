import React, { useEffect, useRef, useState } from 'react';
import { FindReplace, FindReplaceElements, SearchHistory } from './FindReplace';
import './find-replace.css';

interface FindReplacePanelProps {
  editorRef: React.RefObject<HTMLDivElement>;
  onReplace?: () => void;
}

export const FindReplacePanel: React.FC<FindReplacePanelProps> = ({ editorRef, onReplace }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<SearchHistory[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const findInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const findPrevRef = useRef<HTMLButtonElement>(null);
  const findNextRef = useRef<HTMLButtonElement>(null);
  const replaceBtnRef = useRef<HTMLButtonElement>(null);
  const replaceAllBtnRef = useRef<HTMLButtonElement>(null);
  const matchCountRef = useRef<HTMLSpanElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const caseSensitiveRef = useRef<HTMLInputElement>(null);
  const wordBoundaryRef = useRef<HTMLInputElement>(null);
  const regexRef = useRef<HTMLInputElement>(null);
  const findReplaceRef = useRef<FindReplace | null>(null);

  useEffect(() => {
    if (
      editorRef.current &&
      panelRef.current &&
      findInputRef.current &&
      replaceInputRef.current &&
      findPrevRef.current &&
      findNextRef.current &&
      replaceBtnRef.current &&
      replaceAllBtnRef.current &&
      matchCountRef.current &&
      toggleBtnRef.current &&
      caseSensitiveRef.current &&
      wordBoundaryRef.current &&
      regexRef.current
    ) {
      const elements: FindReplaceElements = {
        transcript: editorRef.current,
        panel: panelRef.current,
        findInput: findInputRef.current,
        replaceInput: replaceInputRef.current,
        findPrev: findPrevRef.current,
        findNext: findNextRef.current,
        replaceBtn: replaceBtnRef.current,
        replaceAllBtn: replaceAllBtnRef.current,
        matchCount: matchCountRef.current,
        toggleBtn: toggleBtnRef.current,
        caseSensitive: caseSensitiveRef.current,
        wordBoundary: wordBoundaryRef.current,
        regex: regexRef.current
      };

      findReplaceRef.current = new FindReplace(elements);
      
      // Load search history
      const savedHistory = localStorage.getItem('findReplaceHistory');
      if (savedHistory) {
        setRecentSearches(JSON.parse(savedHistory));
      }
    }

    return () => {
      if (findReplaceRef.current) {
        findReplaceRef.current.destroy();
      }
    };
  }, [editorRef]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        handleToggle();
      } else if (e.key === 'Escape' && isOpen) {
        handleToggle();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    if (findReplaceRef.current) {
      if (!newIsOpen) {
        // When closing, clear highlights and reset inputs
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = editorRef.current?.innerHTML || '';
        
        const highlights = tempDiv.querySelectorAll('.find-highlight');
        highlights.forEach(highlight => {
          const text = document.createTextNode(highlight.textContent || '');
          highlight.parentNode?.replaceChild(text, highlight);
        });
        
        if (editorRef.current) {
          editorRef.current.innerHTML = tempDiv.innerHTML;
        }
        
        if (findInputRef.current) {
          findInputRef.current.value = '';
        }
        if (replaceInputRef.current) {
          replaceInputRef.current.value = '';
        }
        if (matchCountRef.current) {
          matchCountRef.current.textContent = '0/0';
        }
      } else {
        // When opening, focus the input
        setTimeout(() => {
          findInputRef.current?.focus();
        }, 0);
      }
    }
  };

  const handleSearchHistoryClick = (item: SearchHistory) => {
    if (findInputRef.current && replaceInputRef.current && findReplaceRef.current) {
      findInputRef.current.value = item.searchText;
      replaceInputRef.current.value = item.replaceText || '';
      findReplaceRef.current.performSearch();
    }
  };

  return (
    <div className="find-replace-container">
      <button
        ref={toggleBtnRef}
        className="find-replace-toggle"
        title="Find and Replace (Ctrl+F)"
        onClick={handleToggle}
      >
        <i className="fa-solid fa-search" />
      </button>

      <div ref={panelRef} className={`find-replace-panel ${!isOpen ? 'hidden' : ''}`}>
        <div className="find-replace-inputs">
          <div className="search-container">
            <div className="input-with-history">
              <input
                ref={findInputRef}
                type="text"
                placeholder="Find..."
                className="find-input"
              />
              {recentSearches.length > 0 && (
                <button 
                  className="history-toggle"
                  onClick={() => setShowOptions(!showOptions)}
                  title="Search History"
                >
                  <i className="fa-solid fa-clock-rotate-left" />
                </button>
              )}
            </div>
            {showOptions && recentSearches.length > 0 && (
              <div className="search-history">
                {recentSearches.map((item, index) => (
                  <div 
                    key={index}
                    className="history-item"
                    onClick={() => handleSearchHistoryClick(item)}
                  >
                    <span className="search-text">{item.searchText}</span>
                    {item.replaceText && (
                      <span className="replace-text">→ {item.replaceText}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="find-replace-buttons">
              <button
                ref={findPrevRef}
                title="Previous match (Shift+Enter)"
                className="find-prev"
              >
                <i className="fa-solid fa-chevron-up" />
              </button>
              <button
                ref={findNextRef}
                title="Next match (Enter)"
                className="find-next"
              >
                <i className="fa-solid fa-chevron-down" />
              </button>
              <span ref={matchCountRef} className="match-count">
                0/0
              </span>
            </div>
          </div>

          <div>
            <input
              ref={replaceInputRef}
              type="text"
              placeholder="Replace with..."
              className="replace-input"
            />
            <div className="find-replace-buttons">
              <button
                ref={replaceBtnRef}
                className="replace-btn"
                onClick={() => onReplace?.()}
                title="Replace current match"
              >
                Replace
              </button>
              <button
                ref={replaceAllBtnRef}
                className="replace-all-btn"
                title="Replace all matches"
              >
                Replace All
              </button>
            </div>
          </div>

          <div className="search-options">
            <label className="option">
              <input
                ref={caseSensitiveRef}
                type="checkbox"
                className="option-checkbox"
                defaultChecked={false}
              />
              <span className="option-text">Match Case</span>
            </label>
            <label className="option">
              <input
                ref={wordBoundaryRef}
                type="checkbox"
                className="option-checkbox"
                defaultChecked={false}
              />
              <span className="option-text">Whole Words</span>
            </label>
            <label className="option">
              <input
                ref={regexRef}
                type="checkbox"
                className="option-checkbox"
                defaultChecked={false}
              />
              <span className="option-text">RegEx</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}; 