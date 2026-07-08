import { useRef } from "react";
import { motion } from "framer-motion";
import { ScanText, Wand2, LayoutTemplate, TrendingUp, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: ScanText,
    title: "ATS Score Analysis",
    description: "Deep compatibility check with Applicant Tracking Systems. Know exactly how your resume performs against automated filters.",
    size: "large",
    metric: "Score",
    metricValue: "94%",
  },
  {
    icon: Wand2,
    title: "AI Rewrite Engine",
    description: "Transform passive language into powerful, action-oriented statements that recruiters notice.",
    size: "medium",
    beforeAfter: true,
  },
  {
    icon: LayoutTemplate,
    title: "Smart Templates",
    description: "Choose from 4 professionally designed layouts optimized for your industry.",
    size: "medium",
    preview: true,
  },
  {
    icon: TrendingUp,
    title: "Impact Metrics",
    description: "Quantify achievements with data-driven suggestions. Turn responsibilities into measurable results.",
    size: "medium",
  },
  {
    icon: Zap,
    title: "Keyword Optimization",
    description: "Identify and fill critical skill gaps. Match industry keywords that recruiters search for.",
    size: "medium",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data stays encrypted and secure. We never share or sell your resume information.",
    size: "large",
  },
];

function SpotlightCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  const isLarge = feature.size === "large";
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`spotlight-card glass-card rounded-lg p-6 cursor-default group transition-all duration-300 hover:border-[#2DD4BF]/20 ${
        isLarge ? "md:col-span-2" : ""
      }`}
      onMouseMove={handleMouseMove}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2.5 rounded-lg bg-[#2DD4BF]/10 group-hover:bg-[#2DD4BF]/20 transition-colors">
            <Icon className="w-5 h-5 text-[#2DD4BF]" />
          </div>
          {feature.metric && (
            <div className="text-right">
              <span className="text-2xl font-bold text-[#D4AF37] font-mono">{feature.metricValue}</span>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{feature.metric}</p>
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold mb-2 group-hover:text-[#2DD4BF] transition-colors">
          {feature.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>

        {/* AI Rewrite text morphing demo */}
        {feature.beforeAfter && (
          <div className="mt-4 p-3 rounded-md bg-black/30 border border-white/5">
            <div className="flex gap-4 text-xs">
              <div className="flex-1">
                <span className="text-red-400/60 line-through">Responsible for managing team</span>
              </div>
              <div className="flex-1">
                <span className="text-[#2DD4BF]">Led 12-person team, increasing output by 47%</span>
              </div>
            </div>
          </div>
        )}

        {/* Template preview mini */}
        {feature.preview && (
          <div className="mt-4 flex gap-2">
            {["Modern", "Classic", "Tech", "Creative"].map((name, i) => (
              <div
                key={name}
                className="w-10 h-14 rounded border border-white/10 bg-white/5 flex items-center justify-center text-[7px] text-muted-foreground hover:border-[#2DD4BF]/30 hover:scale-110 transition-all cursor-pointer"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {name[0]}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section id="features" className="py-24 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            The <span className="orbit-gradient-text">AI Engine.</span>
          </h2>
          <p className="text-muted-foreground max-w-lg">
            Six powerful modules work together to transform your resume from overlooked to unignorable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <SpotlightCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
