import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for trying out Orbit.",
    features: [
      "1 resume analysis",
      "Basic ATS score",
      "3 optimization suggestions",
      "PDF export",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "Everything you need to land interviews.",
    features: [
      "Unlimited resume analyses",
      "Full 5-dimension scoring",
      "AI resume optimization",
      "All 4 templates",
      "Job match analysis",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$29",
    period: "/month",
    description: "For teams and career coaches.",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Custom branding",
      "API access",
      "Dedicated account manager",
      "SSO integration",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function Pricing() {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  return (
    <section id="pricing" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Simple <span className="orbit-gradient-text">Pricing.</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Choose the plan that fits your career goals. Upgrade or downgrade anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredPlan(plan.name)}
              onMouseLeave={() => setHoveredPlan(null)}
              className={`relative rounded-xl p-6 transition-all duration-300 ${
                plan.popular
                  ? "gradient-border-pro"
                  : "border border-border/50"
              } ${
                hoveredPlan === plan.name && !plan.popular
                  ? "border-[#2DD4BF]/30 bg-[#121212]/50 -translate-y-1 shadow-xl shadow-black/20"
                  : "bg-[#121212]/30"
              } ${
                hoveredPlan === plan.name && plan.popular
                  ? "-translate-y-1 shadow-xl shadow-[#D4AF37]/10"
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 bg-[#D4AF37] text-black text-xs font-semibold px-3 py-1 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold font-mono">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.popular ? "text-[#D4AF37]" : "text-[#2DD4BF]"}`} />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/dashboard">
                <Button
                  className={`w-full transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    plan.popular
                      ? "bg-[#D4AF37] text-black hover:bg-[#E5C158]"
                      : "bg-white/5 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
