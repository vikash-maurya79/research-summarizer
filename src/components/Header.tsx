import React from 'react';
import { BookOpen, GitCompare, History, Plus, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onNewAnalysis: () => void;
  onOpenHistory: () => void;
  onOpenCompare: () => void;
  historyCount: number;
  hasActivePaper: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onNewAnalysis,
  onOpenHistory,
  onOpenCompare,
  historyCount,
  hasActivePaper,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md px-4 sm:px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo and Identity */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg tracking-tight text-white flex items-center gap-1.5">
                ScholarExtract
              </span>
              <span className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Academic Analyzer
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Zero-Hallucination 5-Component Structural Extraction
            </p>
          </div>
        </div>

        {/* Center Badge: Strict Protocol Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-slate-400">Model:</span>
          <span className="font-medium text-slate-200">Gemini 3.8 Flash</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Strict Grounding
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {hasActivePaper && (
            <button
              onClick={onNewAnalysis}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition cursor-pointer"
              title="Start a new paper analysis"
            >
              <Plus className="h-3.5 w-3.5 text-indigo-400" />
              <span className="hidden sm:inline">New Analysis</span>
            </button>
          )}

          <button
            onClick={onOpenCompare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition cursor-pointer"
            title="Compare two research papers"
          >
            <GitCompare className="h-3.5 w-3.5 text-violet-400" />
            <span className="hidden sm:inline">Compare</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition cursor-pointer"
            title="Analysis history"
          >
            <History className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-indigo-600 text-[10px] font-semibold text-white">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
