export interface Suggestion {
  id: string;
  category: "ATS" | "Content" | "Grammar" | "Structure";
  severity: "Critical" | "Warning" | "Info";
  title: string;
  description: string;
  originalText: string | null;
  suggestedText: string | null;
}

export interface Improvements {
  impactStatements: number;
  quantifiedMetrics: number;
  keywordOptimization: number;
  readability: number;
}

export interface AnalysisResult {
  overallScore: number;
  atsScore: number;
  keywordScore: number;
  impactScore: number;
  readabilityScore: number;
  formatScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: Suggestion[];
  missingSkills: string[];
  detectedSkills: string[];
  estimatedRole: string;
}

export interface OptimizationResult {
  optimizedResume: string;
  changesMade: string[];
  improvements: Improvements;
}

export interface JobMatchResult {
  matchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
  tailoredResume: string;
}

export interface TemplateMeta {
  id: number;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
}
