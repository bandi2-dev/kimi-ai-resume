import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, FileText, Zap, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import type { JobMatchResult } from "@contracts/types";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// ─── Gauge Chart ───
function GaugeChart({ score }: { score: number }) {
  const radius = 80;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference * 0.75;

  const getColor = (s: number) => {
    if (s >= 80) return "#34D399";
    if (s >= 60) return "#D4AF37";
    if (s >= 40) return "#F59E0B";
    return "#EF4444";
  };

  const color = getColor(score);

  return (
    <div className="relative flex flex-col items-center">
      <svg width={radius * 2 + 40} height={radius + 60} viewBox={`0 0 ${radius * 2 + 40} ${radius + 60}`}>
        {/* Background arc */}
        <circle
          cx={radius + 20}
          cy={radius + 10}
          r={normalizedRadius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference * 0.75} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(135 ${radius + 20} ${radius + 10})`}
        />
        {/* Score arc */}
        <motion.circle
          cx={radius + 20}
          cy={radius + 10}
          r={normalizedRadius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference * 0.75} ${circumference}`}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          transform={`rotate(135 ${radius + 20} ${radius + 10})`}
        />
        {/* Score text */}
        <text
          x={radius + 20}
          y={radius + 5}
          textAnchor="middle"
          className="text-3xl font-bold"
          fill={color}
          style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "28px", fontWeight: 700 }}
        >
          {score}%
        </text>
        <text
          x={radius + 20}
          y={radius + 28}
          textAnchor="middle"
          fill="#A1A1AA"
          style={{ fontSize: "11px" }}
        >
          Match Score
        </text>
      </svg>

      {/* Color zones legend */}
      <div className="flex gap-3 mt-2">
        {[
          { label: "Low", color: "#EF4444" },
          { label: "Fair", color: "#F59E0B" },
          { label: "Good", color: "#D4AF37" },
          { label: "Excellent", color: "#34D399" },
        ].map((zone) => (
          <div key={zone.label} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: zone.color }} />
            <span className="text-[10px] text-muted-foreground">{zone.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Keyword Analysis ───
function KeywordAnalysis({
  matched,
  missing,
}: {
  matched: string[];
  missing: string[];
}) {
  const allKeywords = [
    ...matched.map((k) => ({ word: k, status: "matched" as const })),
    ...missing.map((k) => ({ word: k, status: "missing" as const })),
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {allKeywords.map((k) => (
          <motion.div
            key={k.word}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`group relative px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 cursor-default ${
              k.status === "matched"
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            <span className="flex items-center gap-1.5">
              {k.status === "matched" ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <AlertTriangle className="w-3 h-3" />
              )}
              {k.word}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-6 text-xs text-muted-foreground pt-2">
        <span className="flex items-center gap-1.5">
          <CheckCircle className="w-3 h-3 text-green-400" />
          {matched.length} matched
        </span>
        <span className="flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3 text-red-400" />
          {missing.length} missing
        </span>
      </div>
    </div>
  );
}

// ─── Match Results ───
function MatchResults({ result }: { result: JobMatchResult }) {
  const [showTailored, setShowTailored] = useState(false);

  const pieData = [
    { name: "Matched", value: result.matchedKeywords.length, color: "#34D399" },
    { name: "Missing", value: result.missingKeywords.length, color: "#EF4444" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Gauge + Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-lg p-6 flex flex-col items-center">
            <GaugeChart score={result.matchScore} />
          </div>

          <div className="glass-card rounded-lg p-6">
            <h3 className="text-sm font-semibold mb-4">Keyword Coverage</h3>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={55}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#121212",
                    border: "1px solid rgba(244,244,245,0.1)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Recommendations */}
          <div className="glass-card rounded-lg p-6">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#D4AF37]" />
              Recommendations
            </h3>
            <ul className="space-y-3">
              {result.recommendations.map((rec, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {rec}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right - Keywords + Tailored Resume */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-lg p-6">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#2DD4BF]" />
              Keyword Analysis
            </h3>
            <KeywordAnalysis
              matched={result.matchedKeywords}
              missing={result.missingKeywords}
            />
          </div>

          <div className="glass-card rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#D4AF37]" />
                Tailored Resume
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTailored(!showTailored)}
                className="text-xs"
              >
                {showTailored ? "Hide" : "View"}
              </Button>
            </div>
            {showTailored && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="max-h-[500px] overflow-auto"
              >
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed font-mono bg-black/20 p-4 rounded-lg">
                  {result.tailoredResume}
                </pre>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Job Match Page ───
export default function JobMatch() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<JobMatchResult | null>(null);

  const matchMutation = trpc.resume.jobMatch.useMutation({
    onSuccess: (data: unknown) => {
      setResult(data as JobMatchResult);
      toast.success("Job match analysis complete!");
    },
    onError: (err) => {
      toast.error(err.message || "Analysis failed.");
    },
  });

  const handleMatch = () => {
    if (resumeText.length < 50 || jobDescription.length < 50) {
      toast.error("Both resume and job description must be at least 50 characters.");
      return;
    }
    matchMutation.mutate({ resumeText, jobDescription });
  };

  // Results view
  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pt-24 pb-16 px-6 min-h-screen"
      >
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Match <span className="orbit-gradient-text">Results.</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Your resume matches {result.matchScore}% with this job description.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setResult(null);
                setResumeText("");
                setJobDescription("");
              }}
              className="border-border/50"
            >
              New Analysis
            </Button>
          </div>
        </div>
        <MatchResults result={result} />
      </motion.div>
    );
  }

  // Input view
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-16 px-6 min-h-screen"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Job <span className="orbit-gradient-text">Matcher.</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Compare your resume against any job description and get a tailored version optimized for that role.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resume Input */}
          <div className="glass-card rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border/30 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#2DD4BF]" />
              <span className="text-sm font-medium">Your Resume</span>
              <Badge variant="outline" className="text-xs ml-auto bg-white/5">
                {resumeText.length} chars
              </Badge>
            </div>
            <Textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here..."
              className="min-h-[400px] border-0 bg-transparent resize-none rounded-none font-mono text-sm leading-relaxed p-4 focus-visible:ring-0"
            />
          </div>

          {/* Animated Divider (visible on lg) */}
          <div className="hidden lg:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center"
            >
              <Zap className="w-5 h-5 text-[#D4AF37]" />
            </motion.div>
          </div>

          {/* Job Description Input */}
          <div className="glass-card rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border/30 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm font-medium">Job Description</span>
              <Badge variant="outline" className="text-xs ml-auto bg-white/5">
                {jobDescription.length} chars
              </Badge>
            </div>
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="min-h-[400px] border-0 bg-transparent resize-none rounded-none font-mono text-sm leading-relaxed p-4 focus-visible:ring-0"
            />
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Button
            onClick={handleMatch}
            disabled={matchMutation.isPending}
            size="lg"
            className="bg-[#D4AF37] text-black hover:bg-[#E5C158] font-semibold px-10 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {matchMutation.isPending ? (
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
                <Zap className="w-4 h-4 mr-2" />
                Calculate Match
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
