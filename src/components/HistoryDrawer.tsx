import React from 'react';
import { X, Trash2, Clock, ChevronRight, FileText, Download } from 'lucide-react';
import { PaperAnalysis } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: PaperAnalysis[];
  onSelectPaper: (paper: PaperAnalysis) => void;
  onDeletePaper: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectPaper,
  onDeletePaper,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  const exportAllHistory = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scholarextract_history_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Analysis History</h3>
                <p className="text-[11px] text-slate-400">{history.length} papers analyzed</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Actions toolbar */}
          {history.length > 0 && (
            <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-xs">
              <button
                onClick={exportAllHistory}
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export All (JSON)</span>
              </button>
              <button
                onClick={onClearHistory}
                className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          )}

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <FileText className="h-10 w-10 mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-400">No past analyses yet.</p>
                <p className="text-xs text-slate-400 mt-1">
                  Analyses from pasted text or uploads will be saved here automatically.
                </p>
              </div>
            ) : (
              history.map((paper) => (
                <div
                  key={paper.id}
                  onClick={() => {
                    onSelectPaper(paper);
                    onClose();
                  }}
                  className="group relative p-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800/90 hover:border-indigo-500/50 transition cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 font-mono">
                      <span>{new Date(paper.analyzedAt).toLocaleDateString()}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-indigo-400">
                        {paper.sourceType || 'text'}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition line-clamp-2">
                      {paper.title}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-2 mt-1.5">
                      {paper.objective}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 group-hover:text-indigo-400 flex items-center gap-1">
                      <span>View analysis</span>
                      <ChevronRight className="h-3 w-3" />
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePaper(paper.id);
                      }}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition"
                      title="Delete from history"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
