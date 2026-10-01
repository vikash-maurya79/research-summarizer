import React, { useState, useRef } from 'react';
import { Upload, FileText, Sparkles, BookOpen, AlertCircle, ArrowRight, X, Check, Loader2 } from 'lucide-react';
import { SAMPLE_PAPERS } from '../data/samplePapers';
import { SamplePaper } from '../types';

interface PaperInputProps {
  onAnalyzeText: (text: string, titleHint?: string) => Promise<void>;
  onAnalyzeFile: (file: File) => Promise<void>;
  onSelectSample: (sample: SamplePaper) => void;
  isLoading: boolean;
}

export const PaperInput: React.FC<PaperInputProps> = ({
  onAnalyzeText,
  onAnalyzeFile,
  onSelectSample,
  isLoading,
}) => {
  const [inputText, setInputText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      onAnalyzeFile(selectedFile);
    } else if (inputText.trim()) {
      onAnalyzeText(inputText);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
    }
  };

  const clearInput = () => {
    setInputText('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Hero Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Strict Structural Extraction Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
          Academic Research Paper Analyzer
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Extract the essential 5 structural dimensions from research papers, preprints, and abstracts with strict factual grounding and zero hallucination.
        </p>

        {/* 5 Structural Protocol Indicators */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-2 max-w-3xl mx-auto text-left">
          {[
            { icon: '🎯', label: 'Objective', desc: 'Goal & problem' },
            { icon: '⚙️', label: 'Methodology', desc: 'Models & setup' },
            { icon: '📊', label: 'Findings', desc: 'Metrics & SOTA' },
            { icon: '⚠️️', label: 'Limitations', desc: 'Or explicit absence' },
            { icon: '💡', label: 'Takeaways', desc: 'Practical impact' },
          ].map((item, i) => (
            <div
              key={i}
              className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center gap-2.5"
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-slate-200 truncate">{item.label}</div>
                <div className="text-[10px] text-slate-400 truncate">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seminal Paper Quick Selector */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
            1-Click Benchmark Papers
          </span>
          <span className="text-[11px] text-slate-400">Click to instantly load & inspect</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SAMPLE_PAPERS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              disabled={isLoading}
              className="group p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/40 text-left transition duration-150 flex flex-col justify-between cursor-pointer disabled:opacity-50"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-indigo-400 font-mono mb-1">
                  <span>{sample.year}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    {sample.category.split('/')[0].trim()}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition line-clamp-1">
                  {sample.title}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                  {sample.description}
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 group-hover:text-indigo-400">
                <span>View analysis</span>
                <ArrowRight className="h-3 w-3 transform group-hover:translate-x-0.5 transition" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="relative rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl p-4 sm:p-6 backdrop-blur">
        {/* Upload or Drop Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
          }}
          onDrop={handleDrop}
          className={`relative rounded-xl border border-dashed transition-all p-3 mb-4 text-center cursor-pointer ${
            dragActive
              ? 'border-indigo-500 bg-indigo-500/10'
              : selectedFile
              ? 'border-emerald-500/50 bg-emerald-500/5'
              : 'border-slate-700/80 hover:border-slate-600 bg-slate-950/40'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.md"
            onChange={handleFileChange}
            className="hidden"
          />

          {selectedFile ? (
            <div className="flex items-center justify-between py-1 px-3">
              <div className="flex items-center gap-2.5 text-left">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">{selectedFile.name}</div>
                  <div className="text-[11px] text-slate-400">
                    {(selectedFile.size / 1024).toFixed(1)} KB • Document ready for analysis
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 py-2 text-slate-400 text-xs">
              <Upload className="h-4 w-4 text-indigo-400" />
              <span>
                <strong className="text-slate-300">Drop PDF, TXT, or MD paper file here</strong> or browse
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                PDF up to 25MB
              </span>
            </div>
          )}
        </div>

        {/* Text Area */}
        <div className="relative">
          <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center justify-between">
            <span>Or paste research paper text, abstract, or methodology:</span>
            {inputText.length > 0 && (
              <span className="text-[11px] text-slate-400 font-mono">
                {wordCount} words | {charCount} chars
              </span>
            )}
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading || !!selectedFile}
            rows={8}
            placeholder={`Paste research paper title, abstract, introduction, methodology, and experimental results here...\n\nExample:\nTitle: High-Throughput Transformer Ingestion\nAbstract: We propose an asynchronous attention dispatch kernel...\nMethodology: Evaluated across 8x H100 GPUs using FP8 precision...\nFindings: 3.4x higher token generation rate at equivalent perplexity...`}
            className="w-full rounded-xl bg-slate-950/80 border border-slate-800 p-3.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 font-mono-code transition disabled:opacity-50"
          />
        </div>

        {/* Actions & Submit */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-400" />
            <span>Strict constraints: No fact fabrication • Explicit limitations check</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {(inputText.trim() || selectedFile) && (
              <button
                type="button"
                onClick={clearInput}
                disabled={isLoading}
                className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
              >
                Clear
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading || (!inputText.trim() && !selectedFile)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Extracting 5 Components...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Extract Structural Components</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
