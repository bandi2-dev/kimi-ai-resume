import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import {
  Upload,
  FileText,
  X,
  AlertTriangle,
  Info,
  CheckCircle,
  Wand2,
  Briefcase,
  TrendingUp,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import type { AnalysisResult } from "@contracts/types";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// ─── Upload Zone ───
function UploadZone({
  onAnalyze,
  isLoading,
}: {
  onAnalyze: (text: string, fileName?: string) => void;
  isLoading: boolean;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) await processFile(file);
    },
    []
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) await processFile(file);
    },
    []
  );

  const processFile = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Max 5MB.");
      return;
    }
    setFileName(file.name);
    const text = await file.text();
    setText(text);
  };

  const handleSubmit = () => {
    if (!text.trim() || text.trim().length < 50) {
      toast.error("Please enter at least 50 characters.");
      return;
    }
    onAnalyze(text, fileName || undefined);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      {/* Drag Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 mb-6 ${
          isDragOver
            ? "border-[#2DD4BF] bg-[#2DD4BF]/5 scale-[1.02]"
            : "border-border/50 hover:border-[#2DD4BF]/40 hover:bg-[#121212]/50"
        }`}
      >
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <motion.div
          animate={isDragOver ? { y: [0, -8, 0] } : {}}
          transition={{ repeat: Infinity, duration: 0.6 }}
        >
          <Upload className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
        </motion.div>
        <p className="text-sm text-muted-foreground mb-2">
          <span className="text-[#2DD4BF]">Drag & drop</span> your resume here, or{" "}
          <span className="text-[#2DD4BF]">click to browse</span>
        </p>
        <p className="text-xs text-muted-foreground/60">
          Supports PDF, DOCX, TXT (max 5MB)
        </p>
        {fileName && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2DD4BF]/10 border border-[#2DD4BF]/20"
          >
            <FileText className="w-3.5 h-3.5 text-[#2DD4BF]" />
            <span className="text-xs text-[#2DD4BF]">{fileName}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFileName(null);
                setText("");
              }}
              className="ml-1 hover:text-red-400 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Text Area */}
      <div className="mb-6">
        <Textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Or paste your resume text here..."
          className="min-h-[200px] bg-[#121212]/50 border-border/50 focus:border-[#2DD4BF]/50 resize-none text-sm leading-relaxed"
        />
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-foreground">
            {text.length.toLocaleString()} characters
          </span>
          <span className="text-xs text-muted-foreground">Min 50 characters</span>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-center">
        <Button
          onClick={handleSubmit}
          disabled={isLoading || text.length < 50}
          size="lg"
          className="bg-[#D4AF37] text-black hover:bg-[#E5C158] font-semibold px-10 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
              />
              Analyzing...
            </span>
          ) : (
            <>
              <TrendingUp className="w-4 h-4 mr-2" />
              Analyze Resume
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Analysis Loader ───
function AnalysisLoader() {
  const messages = [
    "Parsing document...",
    "Analyzing structure...",
    "Evaluating ATS compliance...",
    "Scoring keyword density...",
    "Measuring impact statements...",
    "Generating insights...",
  ];
  const [currentMessage, setCurrentMessage] = useState(0);

  useState(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl"
    >
      {/* Animated Orb */}
      <div className="relative w-32 h-32 mb-8">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-[#2DD4BF]/30"
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 8 + i * 4, repeat: Infinity, ease: "linear" },
              scale: { duration: 3 + i, repeat: Infinity, ease: "easeInOut" },
            }}
            style={{
              borderWidth: i === 1 ? "2px" : "1px",
              borderColor: i === 1 ? "rgba(212, 175, 55, 0.3)" : "rgba(45, 212, 191, 0.2)",
            }}
          />
        ))}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#2DD4BF]/10 to-[#D4AF37]/10 flex items-center justify-center">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Wand2 className="w-8 h-8 text-[#2DD4BF]" />
          </motion.div>
        </div>
      </div>

      {/* Progress Text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={currentMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-lg text-muted-foreground font-mono"
        >
          {messages[currentMessage]}
        </motion.p>
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="w-64 mt-6">
        <motion.div
          className="h-1 bg-gradient-to-r from-[#2DD4BF] to-[#D4AF37] rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 15, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}

// ─── Circular Score Ring ───
function ScoreRing({ score, label, color, size = 120 }: { score: number; label: string; color: string; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="8"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <motion.span
          className="text-2xl font-bold font-mono"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}
        </motion.span>
      </div>
      <span className="text-xs text-muted-foreground mt-2">{label}</span>
    </div>
  );
}

// ─── Score Dashboard ───
function ScoreDashboard({
  result,
  onOptimize,
}: {
  result: AnalysisResult;
  onOptimize: () => void;
}) {
  const navigate = useNavigate();

  const radarData = [
    { metric: "ATS", score: result.atsScore, fullMark: 100 },
    { metric: "Keywords", score: result.keywordScore, fullMark: 100 },
    { metric: "Impact", score: result.impactScore, fullMark: 100 },
    { metric: "Format", score: result.formatScore, fullMark: 100 },
    { metric: "Readability", score: result.readabilityScore, fullMark: 100 },
  ];

  const skillData = [
    ...result.detectedSkills.slice(0, 6).map((s) => ({ skill: s, status: "present" as const })),
    ...result.missingSkills.slice(0, 6).map((s) => ({ skill: s, status: "missing" as const })),
  ];

  const severityIcon = (severity: string) => {
    switch (severity) {
      case "Critical":
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case "Warning":
        return <Info className="w-4 h-4 text-amber-400" />;
      default:
        return <CheckCircle className="w-4 h-4 text-[#2DD4BF]" />;
    }
  };

  const severityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "Warning":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-[#2DD4BF]/10 text-[#2DD4BF] border-[#2DD4BF]/20";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-1">Analysis Results</h2>
          <p className="text-sm text-muted-foreground">
            Estimated role: <span className="text-[#2DD4BF]">{result.estimatedRole}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={onOptimize}
            className="bg-[#D4AF37] text-black hover:bg-[#E5C158] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Optimize Resume
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/job-match")}
            className="border-border/50 hover:bg-white/5"
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Match Job
          </Button>
        </div>
      </div>

      {/* Score Rings Row */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-6 mb-8">
        <div className="col-span-2 md:col-span-1 flex flex-col items-center justify-center">
          <ScoreRing score={result.overallScore} label="Overall" color="#D4AF37" size={140} />
        </div>
        {[
          { score: result.atsScore, label: "ATS", color: "#2DD4BF" },
          { score: result.keywordScore, label: "Keywords", color: "#60A5FA" },
          { score: result.impactScore, label: "Impact", color: "#A78BFA" },
          { score: result.formatScore, label: "Format", color: "#F472B6" },
          { score: result.readabilityScore, label: "Readability", color: "#34D399" },
        ].map((item) => (
          <ScoreRing key={item.label} score={item.score} label={item.label} color={item.color} size={100} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="glass-card rounded-lg p-6">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-[#2DD4BF]" />
            Score Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "#A1A1AA", fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#2DD4BF"
                fill="#2DD4BF"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{
                  background: "#121212",
                  border: "1px solid rgba(244,244,245,0.1)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Skill Gap */}
        <div className="glass-card rounded-lg p-6">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#2DD4BF]" />
            Skill Analysis
          </h3>
          <div className="space-y-3 mb-6">
            {skillData.map((s) => (
              <div key={s.skill} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{s.skill}</span>
                <Badge
                  variant="outline"
                  className={
                    s.status === "present"
                      ? "bg-green-500/10 text-green-400 border-green-500/20 text-xs"
                      : "bg-red-500/10 text-red-400 border-red-500/20 text-xs"
                  }
                >
                  {s.status === "present" ? "Present" : "Missing"}
                </Badge>
              </div>
            ))}
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-semibold text-[#2DD4BF] mb-2">Strengths</h4>
              <ul className="space-y-1">
                {result.strengths.slice(0, 3).map((s, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <CheckCircle className="w-3 h-3 text-[#2DD4BF] mt-0.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-red-400 mb-2">Weaknesses</h4>
              <ul className="space-y-1">
                {result.weaknesses.slice(0, 3).map((w, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <AlertTriangle className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions Accordion */}
      <div className="mt-6 glass-card rounded-lg p-6">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-[#D4AF37]" />
          AI Suggestions ({result.suggestions.length})
        </h3>
        <Accordion type="multiple" className="space-y-2">
          {result.suggestions.map((suggestion) => (
            <AccordionItem
              key={suggestion.id}
              value={suggestion.id}
              className="border border-border/30 rounded-lg px-4 data-[state=open]:border-[#2DD4BF]/20"
            >
              <AccordionTrigger className="py-3 hover:no-underline">
                <div className="flex items-center gap-3 text-left">
                  {severityIcon(suggestion.severity)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{suggestion.title}</span>
                      <Badge variant="outline" className={`text-xs ${severityColor(suggestion.severity)}`}>
                        {suggestion.severity}
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-white/5 text-muted-foreground border-white/10">
                        {suggestion.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <p className="text-sm text-muted-foreground mb-3 pl-7">{suggestion.description}</p>
                {suggestion.originalText && (
                  <div className="pl-7 mb-2 p-2 rounded bg-red-500/5 border border-red-500/10">
                    <span className="text-xs text-red-400/60 line-through">{suggestion.originalText}</span>
                  </div>
                )}
                {suggestion.suggestedText && (
                  <div className="pl-7 p-2 rounded bg-[#2DD4BF]/5 border border-[#2DD4BF]/10">
                    <span className="text-xs text-[#2DD4BF]">{suggestion.suggestedText}</span>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </motion.div>
  );
}

// ─── Main Dashboard Page ───
export default function Dashboard() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showLoader, setShowLoader] = useState(false);

  const analyzeMutation = trpc.resume.analyze.useMutation({
    onMutate: () => setShowLoader(true),
    onSuccess: (data: unknown) => {
      setShowLoader(false);
      setAnalysisResult(data as AnalysisResult);
      toast.success("Analysis complete!");
    },
    onError: (err) => {
      setShowLoader(false);
      toast.error(err.message || "Analysis failed. Please try again.");
    },
  });

  const handleAnalyze = (text: string, fileName?: string) => {
    analyzeMutation.mutate({ resumeText: text, fileName });
  };

  const handleOptimize = () => {
    if (!analysisResult) return;
    // Navigate to optimize page with analysis data
    sessionStorage.setItem("lastAnalysis", JSON.stringify(analysisResult));
    window.location.href = "/optimize";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-16 px-6 min-h-screen"
    >
      {/* Loader overlay */}
      <AnimatePresence>{showLoader && <AnalysisLoader />}</AnimatePresence>

      {/* Page header */}
      {!analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Resume <span className="orbit-gradient-text">Analyzer.</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Upload your resume and get a comprehensive AI-powered analysis in seconds.
          </p>
        </motion.div>
      )}

      {/* Content */}
      {analysisResult ? (
        <ScoreDashboard result={analysisResult} onOptimize={handleOptimize} />
      ) : (
        <UploadZone onAnalyze={handleAnalyze} isLoading={analyzeMutation.isPending} />
      )}
    </motion.div>
  );
}
