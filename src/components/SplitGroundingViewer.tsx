import React, { useState } from 'react';
import { X, Search, ShieldCheck, Check, Copy, ArrowLeft, ExternalLink, HelpCircle } from 'lucide-react';
import { PaperAnalysis } from '../types';

interface SplitGroundingViewerProps {
  analysis: PaperAnalysis;
  onClose: () => void;
}

export const SplitGroundingViewer: React.FC<SplitGroundingViewerProps> = ({
  analysis,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);

  const sourceContent = analysis.sourceText || 'Source document was provided via direct PDF upload or benchmark reference.';

  // Highlight terms in source text
  const renderSourceWithHighlight = () => {
    const termToHighlight = searchTerm || activeHighlight || '';
    if (!termToHighlight.trim() || termToHighlight.length < 3) {
      return <div className="whitespace-pre-wrap font-mono-code text-xs text-slate-300 leading-relaxed">{sourceContent}</div>;
    }

    try {
      const escaped = termToHighlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'gi');
      const parts = sourceContent.split(regex);

      return (
        <div className="whitespace-pre-wrap font-mono-code text-xs text-slate-300 leading-relaxed">
          {parts.map((part, index) =>
            regex.test(part) ? (
              <mark key={index} className="bg-amber-400/30 text-amber-200 px-0.5 rounded border border-amber-500/40">
                {part}
              </mark>
            ) : (
              <span key={index}>{part}</span>
            )
          )}
        </div>
      );
    } catch {
      return <div className="whitespace-pre-wrap font-mono-code text-xs text-slate-300 leading-relaxed">{sourceContent}</div>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col">
      {/* Top Bar */}
      <div className="border-b border-slate-800 bg-slate-900/90 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">Split Grounding Verification</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                Zero-Hallucination Audit
              </span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-1">{analysis.title}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Split Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
        {/* Left Pane: Source Text */}
        <div className="flex flex-col h-full overflow-hidden bg-slate-950/60">
          <div className="p-3 border-b border-slate-800/80 bg-slate-900/50 flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>Source Research Text</span>
            </span>

            {/* In-text search */}
            <div className="relative w-48 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Find in source..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-200 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 p-5 overflow-y-auto">
            {renderSourceWithHighlight()}
          </div>
        </div>

        {/* Right Pane: Extracted 5 Components */}
        <div className="flex flex-col h-full overflow-hidden bg-slate-900/40">
          <div className="p-3 border-b border-slate-800/80 bg-slate-900/50 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Extracted Structural Components
            </span>
            <span className="text-[11px] text-slate-400">Click section to cross-reference</span>
          </div>

          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {/* Objective */}
            <div
              onClick={() => setActiveHighlight(analysis.objective.slice(0, 30))}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 transition cursor-pointer group"
            >
              <div className="text-xs font-semibold text-indigo-400 mb-1 flex items-center gap-1.5">
                <span>🎯 Objective</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">{analysis.objective}</p>
            </div>

            {/* Methodology */}
            <div
              onClick={() => setActiveHighlight(analysis.methodology.coreTechniques[0] || '')}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-blue-500/50 transition cursor-pointer group"
            >
              <div className="text-xs font-semibold text-blue-400 mb-1 flex items-center gap-1.5">
                <span>⚙️ Methodology</span>
              </div>
              <p className="text-xs text-slate-300 mb-2">{analysis.methodology.summary}</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.methodology.coreTechniques.map((tech, i) => (
                  <span
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveHighlight(tech);
                    }}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-blue-300 hover:border-blue-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Findings */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-1.5">
                <span>📊 Findings</span>
              </div>
              <div className="space-y-2">
                {analysis.findings.map((finding, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveHighlight(finding.metricOrDiscovery)}
                    className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 transition cursor-pointer text-xs"
                  >
                    <div className="font-semibold text-emerald-300">{finding.metricOrDiscovery}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">{finding.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Limitations */}
            <div
              onClick={() => setActiveHighlight(analysis.limitations.text.slice(0, 30))}
              className={`p-4 rounded-xl border transition cursor-pointer ${
                analysis.limitations.isMentioned
                  ? 'bg-amber-500/5 border-amber-500/30 text-amber-200'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 italic'
              }`}
            >
              <div className="text-xs font-semibold mb-1 flex items-center gap-1.5">
                <span>⚠️️ Limitations</span>
              </div>
              <p className="text-xs leading-relaxed">{analysis.limitations.text}</p>
            </div>

            {/* Key Takeaways */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-xs font-semibold text-amber-300 mb-2 flex items-center gap-1.5">
                <span>💡 Key Takeaways</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {analysis.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
