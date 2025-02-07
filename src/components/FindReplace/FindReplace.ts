interface Match {
  start: number;
  end: number;
  text: string;
}

export interface SearchHistory {
  searchText: string;
  replaceText?: string;
  timestamp: number;
}

export interface FindReplaceElements {
  transcript: HTMLDivElement;
  panel: HTMLDivElement;
  findInput: HTMLInputElement;
  replaceInput: HTMLInputElement;
  findPrev: HTMLButtonElement;
  findNext: HTMLButtonElement;
  replaceBtn: HTMLButtonElement;
  replaceAllBtn: HTMLButtonElement;
  matchCount: HTMLSpanElement;
  toggleBtn: HTMLButtonElement;
  caseSensitive: HTMLInputElement;
  wordBoundary: HTMLInputElement;
  regex: HTMLInputElement;
}

export class FindReplace {
  private transcript: HTMLDivElement;
  private panel: HTMLDivElement;
  private findInput: HTMLInputElement;
  private replaceInput: HTMLInputElement;
  private findPrev: HTMLButtonElement;
  private findNext: HTMLButtonElement;
  private replaceBtn: HTMLButtonElement;
  private replaceAllBtn: HTMLButtonElement;
  private matchCount: HTMLSpanElement;
  private toggleBtn: HTMLButtonElement;
  private caseSensitive: HTMLInputElement;
  private wordBoundary: HTMLInputElement;
  private regex: HTMLInputElement;
  private matches: Match[];
  private currentMatchIndex: number;
  private searchHistory: SearchHistory[];
  private readonly MAX_HISTORY = 10;

  constructor(elements: FindReplaceElements) {
    this.transcript = elements.transcript;
    this.panel = elements.panel;
    this.findInput = elements.findInput;
    this.replaceInput = elements.replaceInput;
    this.findPrev = elements.findPrev;
    this.findNext = elements.findNext;
    this.replaceBtn = elements.replaceBtn;
    this.replaceAllBtn = elements.replaceAllBtn;
    this.matchCount = elements.matchCount;
    this.toggleBtn = elements.toggleBtn;
    this.caseSensitive = elements.caseSensitive;
    this.wordBoundary = elements.wordBoundary;
    this.regex = elements.regex;

    this.matches = [];
    this.currentMatchIndex = -1;
    this.searchHistory = [];

    this.loadSearchHistory();
    this.initializeEventListeners();
  }

  private loadSearchHistory(): void {
    const savedHistory = localStorage.getItem('findReplaceHistory');
    if (savedHistory) {
      this.searchHistory = JSON.parse(savedHistory);
    }
  }

  private saveSearchHistory(): void {
    localStorage.setItem('findReplaceHistory', JSON.stringify(this.searchHistory));
  }

  private addToHistory(searchText: string, replaceText?: string): void {
    const newEntry: SearchHistory = {
      searchText,
      replaceText,
      timestamp: Date.now()
    };

    this.searchHistory = [
      newEntry,
      ...this.searchHistory.filter(item => 
        item.searchText !== searchText || item.replaceText !== replaceText
      )
    ].slice(0, this.MAX_HISTORY);

    this.saveSearchHistory();
  }

  private initializeEventListeners(): void {
    // Toggle panel
    this.toggleBtn.addEventListener('click', () => this.togglePanel());
    
    // Search and navigation
    this.findInput.addEventListener('input', () => this.performSearch());
    this.findPrev.addEventListener('click', () => this.navigateMatches('prev'));
    this.findNext.addEventListener('click', () => this.navigateMatches('next'));
    
    // Replace actions
    this.replaceBtn.addEventListener('click', () => this.replaceMatch());
    this.replaceAllBtn.addEventListener('click', () => this.replaceAllMatches());

    // Keyboard shortcuts
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        const selection = window.getSelection();
        const selectedText = selection ? selection.toString().trim() : '';
        this.togglePanel(selectedText);
      }
    });
  }

  public isPanelHidden(): boolean {
    return this.panel.classList.contains('hidden');
  }

  public togglePanel(selectedText: string = ''): void {
    const wasHidden = this.isPanelHidden();
    this.panel.classList.toggle('hidden');
    
    if (wasHidden) {
      if (selectedText && !this.findInput.value) {
        this.findInput.value = selectedText;
      }
      this.findInput.focus();
      this.performSearch();
    } else {
      this.clearHighlights();
      this.findInput.value = '';
      this.replaceInput.value = '';
      this.updateMatchCount();
    }
  }

  public performSearch(): void {
    this.clearHighlights();
    const searchText = this.findInput.value.trim();
    
    if (!searchText) {
      this.matches = [];
      this.currentMatchIndex = -1;
      this.updateMatchCount();
      return;
    }

    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = this.transcript.innerHTML;
      this.findTextInNode(tempDiv, this.createSearchRegex(searchText));

      if (this.matches.length > 0) {
        this.currentMatchIndex = 0;
        this.highlightMatches();
        this.addToHistory(searchText);
      }

      this.updateMatchCount();
    } catch (error) {
      console.error('Search error:', error);
    }
  }

  private createSearchRegex(searchText: string): RegExp {
    let pattern = searchText;
    
    if (!this.regex.checked) {
      pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    if (this.wordBoundary.checked) {
      pattern = `\\b${pattern}\\b`;
    }
    
    try {
      return new RegExp(pattern, this.caseSensitive.checked ? 'g' : 'gi');
    } catch (error) {
      console.error('Invalid regex pattern:', error);
      return new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    }
  }

  private findTextInNode(node: Node, regex: RegExp): void {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      let match;
      
      while ((match = regex.exec(text)) !== null) {
        const absoluteStart = this.getAbsoluteOffset(node) + match.index;
        this.matches.push({
          start: absoluteStart,
          end: absoluteStart + match[0].length,
          text: match[0]
        });
      }
    } else {
      const childNodes = Array.from(node.childNodes);
      childNodes.forEach(child => this.findTextInNode(child, regex));
    }
  }

  private getAbsoluteOffset(node: Node): number {
    let offset = 0;
    let current = node;

    while (current && current !== this.transcript) {
      let sibling = current.previousSibling;
      while (sibling) {
        offset += sibling.textContent?.length || 0;
        sibling = sibling.previousSibling;
      }
      current = current.parentNode as Node;
    }

    return offset;
  }

  private highlightMatches(): void {
    if (this.matches.length === 0) return;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.transcript.innerHTML;
    
    // Sort matches in reverse order to preserve positions
    const sortedMatches = [...this.matches].sort((a, b) => b.start - a.start);

    for (const [index, match] of sortedMatches.entries()) {
      const range = this.findRangeForMatch(tempDiv, match);
      if (range) {
        const span = document.createElement('span');
        span.className = index === this.matches.length - 1 - this.currentMatchIndex 
          ? 'find-highlight current' 
          : 'find-highlight';
        span.setAttribute('data-match-index', (this.matches.length - 1 - index).toString());
        
        try {
          range.surroundContents(span);
        } catch (e) {
          console.error('Failed to highlight match:', e);
        }
      }
    }

    // Preserve scroll position
    const scrollTop = this.transcript.scrollTop;
    this.transcript.innerHTML = tempDiv.innerHTML;
    this.transcript.scrollTop = scrollTop;

    // Scroll current match into view
    if (this.currentMatchIndex >= 0) {
      const currentHighlight = this.transcript.querySelector(`.find-highlight[data-match-index="${this.currentMatchIndex}"]`);
      if (currentHighlight) {
        currentHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  private findRangeForMatch(root: Node, match: Match): Range | null {
    const range = document.createRange();
    let currentOffset = 0;
    let startNode: Node | null = null;
    let endNode: Node | null = null;
    let startOffset = 0;
    let endOffset = 0;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();

    while (node) {
      const nodeLength = node.textContent?.length || 0;
      const nodeEndOffset = currentOffset + nodeLength;

      if (!startNode && match.start >= currentOffset && match.start < nodeEndOffset) {
        startNode = node;
        startOffset = match.start - currentOffset;
      }

      if (!endNode && match.end > currentOffset && match.end <= nodeEndOffset) {
        endNode = node;
        endOffset = match.end - currentOffset;
        break;
      }

      currentOffset += nodeLength;
      node = walker.nextNode();
    }

    if (startNode && endNode) {
      range.setStart(startNode, startOffset);
      range.setEnd(endNode, endOffset);
      return range;
    }

    return null;
  }

  private navigateMatches(direction: 'prev' | 'next'): void {
    if (this.matches.length === 0) return;

    if (direction === 'prev') {
      this.currentMatchIndex = this.currentMatchIndex <= 0 
        ? this.matches.length - 1 
        : this.currentMatchIndex - 1;
    } else {
      this.currentMatchIndex = this.currentMatchIndex >= this.matches.length - 1 
        ? 0 
        : this.currentMatchIndex + 1;
    }

    this.highlightMatches();
    this.updateMatchCount();
  }

  private updateMatchCount(): void {
    this.matchCount.textContent = this.matches.length > 0 
      ? `${this.currentMatchIndex + 1}/${this.matches.length}`
      : '0/0';
  }

  private replaceMatch(): void {
    if (this.currentMatchIndex === -1 || this.matches.length === 0) return;

    const currentHighlight = this.transcript.querySelector(`.find-highlight[data-match-index="${this.currentMatchIndex}"]`);
    if (!currentHighlight) return;

    const replacement = document.createTextNode(this.replaceInput.value);
    currentHighlight.parentNode?.replaceChild(replacement, currentHighlight);
    
    // Add to history
    this.addToHistory(this.findInput.value, this.replaceInput.value);
    
    // Re-run search to update matches
    this.performSearch();
  }

  private replaceAllMatches(): void {
    if (this.matches.length === 0) return;

    const highlights = this.transcript.querySelectorAll('.find-highlight');
    highlights.forEach(highlight => {
      const replacement = document.createTextNode(this.replaceInput.value);
      highlight.parentNode?.replaceChild(replacement, highlight);
    });
    
    // Add to history
    this.addToHistory(this.findInput.value, this.replaceInput.value);
    
    this.performSearch();
  }

  public clearHighlights(): void {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.transcript.innerHTML;
    
    const highlights = tempDiv.querySelectorAll('.find-highlight');
    highlights.forEach(highlight => {
      const text = document.createTextNode(highlight.textContent || '');
      highlight.parentNode?.replaceChild(text, highlight);
    });
    
    this.transcript.innerHTML = tempDiv.innerHTML;
    this.matches = [];
    this.currentMatchIndex = -1;
  }

  public destroy(): void {
    // Clean up event listeners
    this.toggleBtn.removeEventListener('click', () => this.togglePanel());
    this.findInput.removeEventListener('input', () => this.performSearch());
    this.findPrev.removeEventListener('click', () => this.navigateMatches('prev'));
    this.findNext.removeEventListener('click', () => this.navigateMatches('next'));
    this.replaceBtn.removeEventListener('click', () => this.replaceMatch());
    this.replaceAllBtn.removeEventListener('click', () => this.replaceAllMatches());
  }
} 