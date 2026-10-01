import React, { useState } from 'react';
import { X, Copy, Check, Quote, BookOpen } from 'lucide-react';
import { CitationInfo } from '../types';

interface CitationModalProps {
  citation: CitationInfo;
  onClose: () => void;
}

export const CitationModal: React.FC<CitationModalProps> = ({ citation, onClose }) => {
  const [copiedType, setCopiedType] = useState<'bibtex' | 'apa' | null>(null);

  const handleCopy = (text: string, type: 'bibtex' | 'apa') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Quote className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Cite Paper</h3>
              <p className="text-xs text-slate-400">Formatted citations for academic bibliographies</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Paper title preview */}
        <div className="mb-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="text-xs font-semibold text-slate-200 mb-1">{citation.title}</div>
          <div className="text-[11px] text-slate-400">
            {citation.authors.join(', ')} ({citation.year}) • {citation.venue}
          </div>
        </div>

        {/* APA Format */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
              APA 7th Edition
            </span>
            <button
              onClick={() => handleCopy(citation.apa, 'apa')}
              className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              {copiedType === 'apa' ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy APA</span>
                </>
              )}
            </button>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans select-all">
            {citation.apa}
          </div>
        </div>

        {/* BibTeX Format */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
              BibTeX Entry
            </span>
            <button
              onClick={() => handleCopy(citation.bibtex, 'bibtex')}
              className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              {copiedType === 'bibtex' ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy BibTeX</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono-code leading-relaxed overflow-x-auto select-all">
            {citation.bibtex}
          </pre>
        </div>
      </div>
    </div>
  );
};
