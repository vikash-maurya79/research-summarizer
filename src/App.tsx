import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PaperInput } from './components/PaperInput';
import { AnalysisViewer } from './components/AnalysisViewer';
import { SplitGroundingViewer } from './components/SplitGroundingViewer';
import { CitationModal } from './components/CitationModal';
import { ComparisonModal } from './components/ComparisonModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { PaperAnalysis, SamplePaper } from './types';
import { SAMPLE_PAPERS } from './data/samplePapers';
import { AlertCircle, X, Sparkles, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'scholarextract_history_v1';

export default function App() {
  const [currentAnalysis, setCurrentAnalysis] = useState<PaperAnalysis | null>(null);
  const [history, setHistory] = useState<PaperAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Modals state
  const [isCitationOpen, setIsCitationOpen] = useState(false);
  const [isSplitViewOpen, setIsSplitViewOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load history from localStorage on startup
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load history from localStorage', e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (newAnalysis: PaperAnalysis) => {
    setHistory((prev) => {
      const filtered = prev.filter((p) => p.id !== newAnalysis.id && p.title !== newAnalysis.title);
      const updated = [newAnalysis, ...filtered].slice(0, 30);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      return updated;
    });
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAnalyzeText = async (text: string, titleHint?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, titleHint }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      const analysis: PaperAnalysis = {
        ...data,
        id: `paper-${Date.now()}`,
        sourceText: text,
        analyzedAt: Date.now(),
        sourceType: 'text',
      };

      setCurrentAnalysis(analysis);
      saveToHistory(analysis);
      showToast('Structural analysis extracted successfully!');
    } catch (err: any) {
      console.error('Extraction error:', err);
      setError(err.message || 'An error occurred while analyzing the paper.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeFile = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const text = await file.text();
        await handleAnalyzeText(text, file.name);
        return;
      }

      // Handle PDF via base64 upload
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const res = reader.result as string;
          const base64Data = res.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });

      const base64 = await base64Promise;

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileData: {
            base64,
            mimeType: file.type || 'application/pdf',
            filename: file.name,
          },
          titleHint: file.name.replace(/\.[^/.]+$/, ''),
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      const analysis: PaperAnalysis = {
        ...data,
        id: `paper-${Date.now()}`,
        sourceText: `[Extracted from uploaded document: ${file.name}]`,
        analyzedAt: Date.now(),
        sourceType: 'file',
        fileName: file.name,
      };

      setCurrentAnalysis(analysis);
      saveToHistory(analysis);
      showToast('Document analyzed successfully!');
    } catch (err: any) {
      console.error('File extraction error:', err);
      setError(err.message || 'Failed to analyze uploaded document.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (sample: SamplePaper) => {
    const analysis: PaperAnalysis = {
      ...sample.cachedAnalysis,
      sourceText: sample.text,
      analyzedAt: Date.now(),
    };
    setCurrentAnalysis(analysis);
    saveToHistory(analysis);
    showToast(`Loaded "${sample.title}"`);
  };

  const handleDeletePaper = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    if (currentAnalysis?.id === id) {
      setCurrentAnalysis(null);
    }
    showToast('Removed from history');
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    showToast('History cleared');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <Header
        onNewAnalysis={() => setCurrentAnalysis(null)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        historyCount={history.length}
        hasActivePaper={!!currentAnalysis}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-2xl shadow-indigo-500/30 border border-indigo-400/30 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 mt-4 w-full">
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="p-1 rounded hover:bg-rose-500/20 text-rose-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 pb-16">
        {currentAnalysis ? (
          <AnalysisViewer
            analysis={currentAnalysis}
            onOpenCitation={() => setIsCitationOpen(true)}
            onOpenSplitView={() => setIsSplitViewOpen(true)}
          />
        ) : (
          <PaperInput
            onAnalyzeText={handleAnalyzeText}
            onAnalyzeFile={handleAnalyzeFile}
            onSelectSample={handleSelectSample}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* Split Grounding Modal */}
      {isSplitViewOpen && currentAnalysis && (
        <SplitGroundingViewer
          analysis={currentAnalysis}
          onClose={() => setIsSplitViewOpen(false)}
        />
      )}

      {/* Citation Modal */}
      {isCitationOpen && currentAnalysis && (
        <CitationModal
          citation={currentAnalysis.citation}
          onClose={() => setIsCitationOpen(false)}
        />
      )}

      {/* Cross-Paper Comparison Modal */}
      {isCompareOpen && (
        <ComparisonModal
          availablePapers={history.length > 0 ? history : SAMPLE_PAPERS.map((s) => s.cachedAnalysis)}
          onClose={() => setIsCompareOpen(false)}
        />
      )}

      {/* History Slide-Over Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectPaper={(paper) => setCurrentAnalysis(paper)}
        onDeletePaper={handleDeletePaper}
        onClearHistory={handleClearHistory}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-4 py-5 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">ScholarExtract</span>
            <span>—</span>
            <span>Zero-hallucination structural research component extraction</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Gemini 3.8 Flash</span>
            <span>•</span>
            <span>Client & Server Separation</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
