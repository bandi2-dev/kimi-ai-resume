import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrbitParticles from "@/components/OrbitParticles";
import ResumeCard3D from "@/components/ResumeCard3D";

export default function Hero() {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Upload your resume. Our AI analyzes, optimizes, and elevates your professional narrative to pass any filter.";
  const indexRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (indexRef.current < fullText.length) {
        setDisplayText(fullText.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(timer);
      }
    }, 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Particle Background */}
      <OrbitParticles />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="flex items-center justify-between gap-12">
          {/* Left Content */}
          <div className="w-full lg:w-[55%] pt-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-[64px] font-bold leading-[1.1] tracking-[-1.5px] mb-6">
                <span className="text-foreground">Precision-engineered</span>
                <br />
                <span className="orbit-gradient-text">resumes.</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              <p className="text-lg sm:text-xl text-muted-foreground max-w-[480px] mb-8 leading-relaxed typewriter-cursor min-h-[3.5em]">
                {displayText}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/dashboard">
                <Button
                  size="lg"
                  className="bg-[#D4AF37] text-black hover:bg-[#E5C158] font-semibold px-8 transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Start Optimizing
                </Button>
              </Link>
              <a href="#pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border/50 hover:bg-white/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  View Pricing
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="flex gap-8 mt-12"
            >
              {[
                { value: "10K+", label: "Resumes Optimized" },
                { value: "94%", label: "ATS Pass Rate" },
                { value: "3x", label: "More Interviews" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-[#D4AF37] font-mono">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - 3D Resume Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex-shrink-0"
          >
            <ResumeCard3D />
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
    </section>
  );
}
