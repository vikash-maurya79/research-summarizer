export interface MethodologyInfo {
  summary: string;
  coreTechniques: string[];
  datasets: string[];
  hardwareOrCompute?: string;
}

export interface FindingItem {
  metricOrDiscovery: string;
  detail: string;
}

export interface LimitationsInfo {
  isMentioned: boolean;
  text: string;
}

export interface CitationInfo {
  title: string;
  authors: string[];
  year: string;
  venue: string;
  bibtex: string;
  apa: string;
}

export interface PaperAnalysis {
  id: string;
  title: string;
  authors: string[];
  year: string;
  venue: string;
  objective: string;
  methodology: MethodologyInfo;
  findings: FindingItem[];
  limitations: LimitationsInfo;
  keyTakeaways: string[];
  citation: CitationInfo;
  markdown: string;
  sourceText: string;
  analyzedAt: number;
  sourceType: 'text' | 'file' | 'sample';
  fileName?: string;
}

export interface SamplePaper {
  id: string;
  title: string;
  authors: string;
  year: string;
  category: string;
  description: string;
  text: string;
  cachedAnalysis: PaperAnalysis;
}

export interface ComparisonSynthesis {
  objectiveComparison: string;
  methodologicalDivergence: string;
  empiricalTradeoffs: string;
  keyLimitationsContrast: string;
  recommendation: string;
}

export interface ComparisonResult {
  paperA: PaperAnalysis;
  paperB: PaperAnalysis;
  synthesis?: ComparisonSynthesis;
}
