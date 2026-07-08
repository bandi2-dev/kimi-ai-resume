import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Upload, Brain, FileCheck, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Your Resume",
    description: "Drop your PDF, DOCX, or paste text directly. Our system accepts all major resume formats with drag-and-drop simplicity.",
    color: "#2DD4BF",
  },
  {
    number: "02",
    icon: Brain,
    title: "AI Deep Analysis",
    description: "Gemini AI scans every section, evaluating ATS compatibility, keyword density, impact statements, and formatting quality.",
    color: "#D4AF37",
  },
  {
    number: "03",
    icon: FileCheck,
    title: "Smart Optimization",
    description: "Get personalized rewrite suggestions, skill gap analysis, and a quantified score across five critical dimensions.",
    color: "#2DD4BF",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Download & Apply",
    description: "Export your optimized resume in your chosen template. Track performance and iterate for continuous improvement.",
    color: "#D4AF37",
  },
];

// SVG paths for morphing
const paths = [
  "M40,10 L160,10 Q170,10 170,20 L170,180 Q170,190 160,190 L40,190 Q30,190 30,180 L30,20 Q30,10 40,10 Z M50,40 L150,40 M50,60 L120,60 M50,80 L140,80 M50,100 L100,100 M50,130 L150,130 M50,150 L110,150",
  "M85,20 L115,20 L125,40 L140,55 L160,60 L160,90 L150,110 L160,130 L160,160 L140,165 L125,180 L115,200 L85,200 L75,180 L60,165 L40,160 L40,130 L50,110 L40,90 L40,60 L60,55 L75,40 Z M100,60 L100,160 M60,110 L140,110",
  "M100,15 L120,40 L150,35 L135,60 L160,80 L130,90 L140,120 L110,110 L100,140 L90,110 L60,120 L70,90 L40,80 L65,60 L50,35 L80,40 Z",
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeStep, setActiveStep] = useState(0);
  const [currentPath, setCurrentPath] = useState(paths[0]);

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        const next = (prev + 1) % steps.length;
        const pathIndex = Math.min(next, paths.length - 1);
        setCurrentPath(paths[pathIndex]);
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <section id="how-it-works" className="py-24 lg:py-32 relative overflow-hidden" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How It <span className="orbit-gradient-text">Works.</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Four steps to a resume that opens doors.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === activeStep;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className={`flex gap-5 p-5 rounded-lg transition-all duration-500 cursor-pointer ${
                    isActive
                      ? "bg-[#121212] border border-[#2DD4BF]/20"
                      : "border border-transparent hover:bg-[#121212]/50"
                  }`}
                  onClick={() => {
                    setActiveStep(index);
                    setCurrentPath(paths[Math.min(index, paths.length - 1)]);
                  }}
                >
                  <div className="flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-500 ${
                        isActive ? "bg-[#2DD4BF]/20" : "bg-white/5"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 transition-colors duration-500 ${
                          isActive ? "text-[#2DD4BF]" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">{step.number}</span>
                      <h3
                        className={`font-semibold transition-colors duration-500 ${
                          isActive ? "text-[#2DD4BF]" : "text-foreground"
                        }`}
                      >
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}

            {/* Connecting line */}
            <div className="hidden lg:block absolute left-[calc(50%-2px)] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#2DD4BF]/20 to-transparent" />
          </div>

          {/* Right Column - SVG Visualization */}
          <div className="hidden lg:flex items-center justify-center sticky top-32">
            <motion.div
              className="relative w-[300px] h-[300px]"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border border-[#2DD4BF]/10" />
              <div className="absolute inset-4 rounded-full border border-[#D4AF37]/10" />
              <div className="absolute inset-8 rounded-full border border-[#2DD4BF]/5" />

              {/* Center SVG */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  width="200"
                  height="220"
                  viewBox="0 0 200 220"
                  className="drop-shadow-[0_0_8px_rgba(45,212,191,0.4)]"
                >
                  <motion.path
                    d={currentPath}
                    fill="none"
                    stroke="#2DD4BF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={false}
                    animate={{ d: currentPath }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                  />
                </svg>
              </div>

              {/* Orbiting dots */}
              {[0, 90, 180, 270].map((angle) => (
                <motion.div
                  key={angle}
                  className="absolute w-2 h-2 rounded-full bg-[#D4AF37]"
                  style={{
                    top: "50%",
                    left: "50%",
                    marginLeft: "-4px",
                    marginTop: "-4px",
                  }}
                  animate={{
                    x: Math.cos((angle * Math.PI) / 180) * 140,
                    y: Math.sin((angle * Math.PI) / 180) * 140,
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
