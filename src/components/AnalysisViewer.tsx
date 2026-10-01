import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Quote,
  Split,
  LayoutGrid,
  FileCode,
  Share2,
  Calendar,
  Users,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  Cpu,
  Database,
  BarChart3,
  Target,
  Layers,
  ExternalLink
} from 'lucide-react';
import { PaperAnalysis } from '../types';

interface AnalysisViewerProps {
  analysis: PaperAnalysis;
  onOpenCitation: () => void;
  onOpenSplitView: () => void;
}

export const AnalysisViewer: React.FC<AnalysisViewerProps> = ({
  analysis,
  onOpenCitation,
  onOpenSplitView,
}) => {
  const [activeTab, setActiveTab] = useState<'structured' | 'markdown'>('structured');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, sectionName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([analysis.markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${analysis.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_analysis.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${analysis.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_analysis.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* Top Banner: Paper Metadata */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 mb-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <ShieldCheck className="h-3.5 w-3.5" />
              Strict Grounding Verified
            </span>
            <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
              {analysis.venue || 'Research Paper'}
            </span>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSplitView}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer"
              title="Side-by-side verification against source text"
            >
              <Split className="h-3.5 w-3.5 text-indigo-400" />
              <span>Split Grounding View</span>
            </button>

            <button
              onClick={onOpenCitation}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer"
              title="View BibTeX & APA citations"
            >
              <Quote className="h-3.5 w-3.5 text-violet-400" />
              <span>Cite</span>
            </button>

            <button
              onClick={downloadMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer"
              title="Download clean Markdown file"
            >
              <Download className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden sm:inline">Export .md</span>
            </button>

            <button
              onClick={() => handleCopy(analysis.markdown, 'all')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition cursor-pointer shadow"
              title="Copy formatted analysis markdown"
            >
              {copiedSection === 'all' ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-300" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Paper Title */}
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2 leading-snug">
          {analysis.title}
        </h2>

        {/* Authors & Meta */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-400 mt-2">
          {analysis.authors && analysis.authors.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-slate-400" />
              <span>{analysis.authors.slice(0, 4).join(', ')}{analysis.authors.length > 4 ? ` +${analysis.authors.length - 4} others` : ''}</span>
            </div>
          )}

          {analysis.year && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>{analysis.year}</span>
            </div>
          )}

          <div className="text-[11px] text-slate-400 font-mono">
            Analyzed {new Date(analysis.analyzedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 mb-6 pb-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('structured')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === 'structured'
                ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Structured Cards</span>
          </button>

          <button
            onClick={() => setActiveTab('markdown')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === 'markdown'
                ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>Raw Markdown (Template)</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400">
          5 Required Components: Objective, Methodology, Findings, Limitations, Takeaways
        </span>
      </div>

      {/* Main Content Area */}
      {activeTab === 'structured' ? (
        <div className="space-y-5">
          {/* SECTION 1: 🎯 Objective */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-5 shadow-lg relative group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🎯</span>
                <h3 className="text-base font-semibold text-white tracking-wide">
                  Objective
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Primary Research Goal
                </span>
              </div>
              <button
                onClick={() => handleCopy(`## 🎯 Objective\n${analysis.objective}`, 'objective')}
                className="opacity-0 group-hover:opacity-100 transition p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
                title="Copy section"
              >
                {copiedSection === 'objective' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-sans pl-1 border-l-2 border-indigo-500/50">
              {analysis.objective}
            </p>
          </div>

          {/* SECTION 2: ⚙️ Methodology */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-5 shadow-lg relative group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">⚙️</span>
                <h3 className="text-base font-semibold text-white tracking-wide">
                  Methodology
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Techniques & Setup
                </span>
              </div>
              <button
                onClick={() => handleCopy(
                  `## ⚙️ Methodology\n${analysis.methodology.summary}\n\nCore Techniques:\n${analysis.methodology.coreTechniques.map(t => `- ${t}`).join('\n')}\n\nDatasets: ${analysis.methodology.datasets.join(', ')}`,
                  'methodology'
                )}
                className="opacity-0 group-hover:opacity-100 transition p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
                title="Copy section"
              >
                {copiedSection === 'methodology' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {analysis.methodology.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Core Techniques */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
                  <Layers className="h-3.5 w-3.5 text-blue-400" />
                  <span>Core Techniques & Models</span>
                </div>
                <ul className="space-y-1.5">
                  {analysis.methodology.coreTechniques.map((tech, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                      <span>{tech}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Datasets & Compute */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
                    <Database className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Datasets & Benchmarks</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {analysis.methodology.datasets.map((dataset, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-cyan-300"
                      >
                        {dataset}
                      </span>
                    ))}
                  </div>
                </div>

                {analysis.methodology.hardwareOrCompute && (
                  <div className="pt-2 border-t border-slate-800/60 flex items-center gap-2 text-[11px] text-slate-400">
                    <Cpu className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="line-clamp-1">{analysis.methodology.hardwareOrCompute}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: 📊 Findings */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-5 shadow-lg relative group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">📊</span>
                <h3 className="text-base font-semibold text-white tracking-wide">
                  Findings
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Empirical Results & Metrics
                </span>
              </div>
              <button
                onClick={() => handleCopy(
                  `## 📊 Findings\n${analysis.findings.map(f => `- **${f.metricOrDiscovery}**: ${f.detail}`).join('\n')}`,
                  'findings'
                )}
                className="opacity-0 group-hover:opacity-100 transition p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
                title="Copy section"
              >
                {copiedSection === 'findings' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {analysis.findings.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between"
                >
                  <div className="text-xs font-semibold text-emerald-400 mb-1.5 flex items-center gap-1.5">
                    <BarChart3 className="h-3.5 w-3.5 shrink-0" />
                    <span>{item.metricOrDiscovery}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: ⚠️️ Limitations */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-5 shadow-lg relative group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">⚠️️</span>
                <h3 className="text-base font-semibold text-white tracking-wide">
                  Limitations
                </h3>
                <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
                  analysis.limitations.isMentioned
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {analysis.limitations.isMentioned ? 'Identified Constraints' : 'Zero Hallucination Protocol'}
                </span>
              </div>
              <button
                onClick={() => handleCopy(`## ⚠️️ Limitations\n${analysis.limitations.text}`, 'limitations')}
                className="opacity-0 group-hover:opacity-100 transition p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
                title="Copy section"
              >
                {copiedSection === 'limitations' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>

            {analysis.limitations.isMentioned ? (
              <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200 leading-relaxed flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>{analysis.limitations.text}</div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 italic flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-slate-400 shrink-0" />
                <span>"Not explicitly mentioned in the text." (Strict adherence to facts present in input)</span>
              </div>
            )}
          </div>

          {/* SECTION 5: 💡 Key Takeaways */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-5 shadow-lg relative group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">💡</span>
                <h3 className="text-base font-semibold text-white tracking-wide">
                  Key Takeaways
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Practical Implications
                </span>
              </div>
              <button
                onClick={() => handleCopy(
                  `## 💡 Key Takeaways\n${analysis.keyTakeaways.map(t => `- ${t}`).join('\n')}`,
                  'takeaways'
                )}
                className="opacity-0 group-hover:opacity-100 transition p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
                title="Copy section"
              >
                {copiedSection === 'takeaways' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>

            <div className="space-y-2.5">
              {analysis.keyTakeaways.map((takeaway, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3"
                >
                  <span className="flex items-center justify-center h-5 w-5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {takeaway}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Raw Markdown View matching exactly the required Output Template */
        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 shadow-2xl relative">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Exact Output Template Format (.md)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={downloadJSON}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs transition cursor-pointer"
              >
                Export JSON
              </button>
              <button
                onClick={() => handleCopy(analysis.markdown, 'raw')}
                className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
              >
                {copiedSection === 'raw' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedSection === 'raw' ? 'Copied' : 'Copy Clean Markdown'}</span>
              </button>
            </div>
          </div>

          <pre className="text-xs text-slate-300 font-mono-code whitespace-pre-wrap leading-relaxed overflow-x-auto selection:bg-indigo-500/30 p-2">
            {analysis.markdown}
          </pre>
        </div>
      )}
    </div>
  );
};
