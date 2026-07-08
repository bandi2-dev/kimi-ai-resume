import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Copy,
  Share2,
  Edit3,
  Check,
  FileText,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import type { OptimizationResult } from "@contracts/types";
import { marked } from "marked";

const templateStyles: Record<string, string> = {
  modern: "resume-modern",
  classic: "resume-classic",
  technical: "resume-technical",
  creative: "resume-creative",
};

const templateNames: Record<string, string> = {
  modern: "Modern",
  classic: "Classic",
  technical: "Technical",
  creative: "Creative",
};

// ─── Split Editor ───
function SplitEditor({
  markdown,
  onChange,
  template,
}: {
  markdown: string;
  onChange: (val: string) => void;
  template: string;
}) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState("");
  const isScrolling = useRef(false);

  useEffect(() => {
    Promise.resolve(marked(markdown)).then(setHtml);
  }, [markdown]);

  // Sync scroll
  const handleEditorScroll = useCallback(() => {
    if (isScrolling.current || !editorRef.current || !previewRef.current) return;
    isScrolling.current = true;
    const ratio =
      editorRef.current.scrollTop /
      (editorRef.current.scrollHeight - editorRef.current.clientHeight);
    previewRef.current.scrollTop =
      ratio * (previewRef.current.scrollHeight - previewRef.current.clientHeight);
    setTimeout(() => {
      isScrolling.current = false;
    }, 50);
  }, []);

  const handlePreviewScroll = useCallback(() => {
    if (isScrolling.current || !editorRef.current || !previewRef.current) return;
    isScrolling.current = true;
    const ratio =
      previewRef.current.scrollTop /
      (previewRef.current.scrollHeight - previewRef.current.clientHeight);
    editorRef.current.scrollTop =
      ratio * (editorRef.current.scrollHeight - editorRef.current.clientHeight);
    setTimeout(() => {
      isScrolling.current = false;
    }, 50);
  }, []);

  // Line numbers
  const lines = markdown.split("\n").length;
  const lineNumbers = Array.from({ length: Math.max(lines, 1) }, (_, i) => i + 1);

  const templateStyle = templateStyles[template] || "resume-modern";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
      {/* Editor */}
      <div className="glass-card rounded-lg overflow-hidden flex flex-col">
        <div className="px-4 py-2 border-b border-border/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[#2DD4BF]" />
            <span className="text-xs font-medium">Editor</span>
          </div>
          <Badge variant="outline" className="text-xs bg-white/5 text-muted-foreground">
            Markdown
          </Badge>
        </div>
        <div className="flex-1 flex overflow-hidden">
          {/* Line numbers */}
          <div className="w-10 bg-black/20 flex-shrink-0 overflow-hidden py-4 text-right pr-2 select-none">
            {lineNumbers.map((n) => (
              <div key={n} className="text-xs text-muted-foreground/40 leading-6">
                {n}
              </div>
            ))}
          </div>
          <Textarea
            ref={editorRef}
            value={markdown}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleEditorScroll}
            className="flex-1 border-0 bg-transparent resize-none rounded-none font-mono text-sm leading-6 p-4 focus-visible:ring-0 focus-visible:ring-offset-0"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Preview */}
      <div className="glass-card rounded-lg overflow-hidden flex flex-col">
        <div className="px-4 py-2 border-b border-border/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-medium">Preview</span>
          </div>
          <Badge variant="outline" className="text-xs bg-white/5 text-muted-foreground capitalize">
            {templateNames[template] || "Modern"} Template
          </Badge>
        </div>
        <div
          ref={previewRef}
          onScroll={handlePreviewScroll}
          className="flex-1 overflow-auto bg-[#1a1a1a] p-6"
        >
          <div className="max-w-[210mm] mx-auto bg-white shadow-xl">
            <div className={templateStyle}>
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Template Carousel ───
function TemplateCarousel({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (slug: string) => void;
}) {
  const templatesQuery = trpc.template.list.useQuery();
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!containerRef.current) return;
    const scrollAmount = 200;
    containerRef.current.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const templates = templatesQuery.data || [];

  return (
    <div className="relative">
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-background/80 border border-border/50 hover:bg-background transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-background/80 border border-border/50 hover:bg-background transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-8 py-2"
        style={{ scrollbarWidth: "none" }}
      >
        {templates.map((t) => {
          const isActive = selected === t.slug;
          return (
            <button
              key={t.slug}
              onClick={() => onSelect(t.slug)}
              className={`flex-shrink-0 w-32 p-3 rounded-lg border transition-all duration-300 text-left ${
                isActive
                  ? "border-[#D4AF37] bg-[#D4AF37]/10 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                  : "border-border/30 hover:border-[#2DD4BF]/30 hover:bg-[#121212]/50"
              }`}
            >
              <div
                className={`w-full h-20 rounded border border-border/20 mb-2 flex items-center justify-center text-2xl font-bold ${
                  isActive ? "text-[#D4AF37]" : "text-muted-foreground"
                }`}
              >
                {t.name[0]}
              </div>
              <p className="text-xs font-medium truncate">{t.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{t.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Floating Action Bar ───
function FloatingActionBar({
  markdown,
  onCopy,
}: {
  markdown: string;
  onCopy: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleDownload = async () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "optimized-resume.md";
    a.click();
    URL.revokeObjectURL(url);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#D4AF37", "#2DD4BF", "#F4F4F5"],
    });
    toast.success("Resume downloaded!");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    onCopy();
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard!");
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: "My Optimized Resume", text: markdown });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
    >
      <div className="flex items-center gap-2 px-4 py-3 rounded-full glass-card border border-border/50 shadow-2xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          className="rounded-full hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-all hover:scale-105"
        >
          <Download className="w-4 h-4 mr-1.5" />
          PDF
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="rounded-full hover:bg-[#2DD4BF]/10 hover:text-[#2DD4BF] transition-all hover:scale-105"
        >
          {copied ? <Check className="w-4 h-4 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
          {copied ? "Copied" : "Copy"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="rounded-full hover:bg-white/10 transition-all hover:scale-105"
        >
          <Share2 className="w-4 h-4 mr-1.5" />
          Share
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Main Optimize Page ───
export default function Optimize() {
  const [markdown, setMarkdown] = useState("");
  const [template, setTemplate] = useState("modern");
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [resumeText, setResumeText] = useState("");

  // Get analysis from session storage
  useEffect(() => {
    const saved = sessionStorage.getItem("lastAnalysis");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setResumeText(parsed.resumeText || "");
      } catch {
        // ignore
      }
    }
  }, []);

  const optimizeMutation = trpc.resume.optimize.useMutation({
    onSuccess: (data: unknown) => {
      const res = data as OptimizationResult;
      setResult(res);
      setMarkdown(res.optimizedResume);
      toast.success("Resume optimized successfully!");
    },
    onError: (err) => {
      toast.error(err.message || "Optimization failed.");
    },
  });

  const handleOptimize = () => {
    const text = resumeText || sessionStorage.getItem("lastResumeText") || "";
    if (!text || text.length < 50) {
      toast.error("Please provide resume text to optimize.");
      return;
    }
    optimizeMutation.mutate({ resumeText: text, template });
  };

  // If no result yet, show input + optimize button
  if (!result) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pt-24 pb-16 px-6 min-h-screen"
      >
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Optimize <span className="orbit-gradient-text">Resume.</span>
          </h1>
          <p className="text-muted-foreground mb-8">
            AI-powered rewrite to maximize impact and ATS compatibility.
          </p>

          <Textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
            className="min-h-[300px] bg-[#121212]/50 border-border/50 focus:border-[#2DD4BF]/50 resize-none mb-6 text-sm leading-relaxed"
          />

          <Button
            onClick={handleOptimize}
            disabled={optimizeMutation.isPending}
            size="lg"
            className="bg-[#D4AF37] text-black hover:bg-[#E5C158] font-semibold px-10 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {optimizeMutation.isPending ? (
              <span className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                />
                Optimizing...
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Optimize with AI
              </>
            )}
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-20 pb-16 px-6 min-h-screen"
    >
      {/* Changes summary */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="glass-card rounded-lg p-4 flex flex-wrap items-center gap-6">
          <div>
            <span className="text-xs text-muted-foreground">Impact Statements</span>
            <p className="text-lg font-bold text-[#2DD4BF] font-mono">+{result.improvements.impactStatements}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Quantified Metrics</span>
            <p className="text-lg font-bold text-[#D4AF37] font-mono">+{result.improvements.quantifiedMetrics}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Keyword Optimization</span>
            <p className="text-lg font-bold text-[#A78BFA] font-mono">+{result.improvements.keywordOptimization}%</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Readability</span>
            <p className="text-lg font-bold text-[#34D399] font-mono">+{result.improvements.readability}%</p>
          </div>
          <div className="ml-auto">
            <span className="text-xs text-muted-foreground">Changes Made</span>
            <p className="text-sm font-medium">{result.changesMade.length} improvements</p>
          </div>
        </div>
      </div>

      {/* Template Carousel */}
      <div className="max-w-6xl mx-auto mb-6">
        <TemplateCarousel selected={template} onSelect={setTemplate} />
      </div>

      {/* Split Editor */}
      <div className="max-w-6xl mx-auto">
        <SplitEditor
          markdown={markdown}
          onChange={setMarkdown}
          template={template}
        />
      </div>

      {/* Floating Action Bar */}
      <FloatingActionBar markdown={markdown} onCopy={() => {}} />
    </motion.div>
  );
}
