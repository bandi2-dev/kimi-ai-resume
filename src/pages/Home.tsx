import { motion } from "framer-motion";
import Hero from "@/sections/Hero";
import Features from "@/sections/Features";
import HowItWorks from "@/sections/HowItWorks";
import Testimonials from "@/sections/Testimonials";
import Pricing from "@/sections/Pricing";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />

      {/* CTA Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Ready for <span className="orbit-gradient-text">liftoff?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-8">
              Join thousands of professionals who have optimized their resumes with Orbit. Your next opportunity is waiting.
            </p>
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-[#D4AF37] text-black font-semibold px-8 py-3 rounded-lg hover:bg-[#E5C158] transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_0_40px_rgba(212,175,55,0.3)]"
            >
              Start Optimizing Now
            </a>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
