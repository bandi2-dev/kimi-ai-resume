import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior Product Manager at Google",
    text: "Orbit transformed my resume from a wall of text into a compelling narrative. I went from zero callbacks to three interviews in the first week.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Software Engineer at Stripe",
    text: "The ATS optimization is game-changing. I finally understand why my applications were getting rejected. The AI suggestions are incredibly precise.",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "Marketing Director at Spotify",
    text: "I've used many resume tools, but none compare to Orbit. The keyword analysis alone helped me land a role that was a perfect match for my skills.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Data Scientist at Meta",
    text: "The quantification suggestions are brilliant. Turns out I had way more measurable achievements than I thought. Highly recommend for tech roles.",
    rating: 5,
  },
  {
    name: "Aisha Patel",
    role: "UX Designer at Airbnb",
    text: "Orbit helped me articulate my design impact in terms that business stakeholders understand. My interview rate doubled immediately.",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Engineering Manager at Netflix",
    text: "As someone who reviews resumes frequently, I can say Orbit produces outputs that genuinely stand out. Clean, impactful, and ATS-friendly.",
    rating: 5,
  },
];

function TestimonialCard({ testimonial }: { testimonial: (typeof testimonials)[0] }) {
  return (
    <div className="flex-shrink-0 w-[380px] p-5 rounded-lg glass-card mx-3">
      <div className="flex gap-1 mb-3">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
        ))}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        &ldquo;{testimonial.text}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2DD4BF] to-[#D4AF37] flex items-center justify-center text-xs font-bold text-black">
          {testimonial.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div>
          <p className="text-sm font-medium">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  // Duplicate for seamless loop
  const duplicated = [...testimonials, ...testimonials];

  return (
    <section className="py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Trusted by <span className="orbit-gradient-text">Professionals.</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Join thousands who have transformed their careers with Orbit.
          </p>
        </motion.div>
      </div>

      {/* Marquee Row 1 - Left */}
      <div className="relative mb-6">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="marquee-track py-2">
          {duplicated.map((t, i) => (
            <TestimonialCard key={`r1-${i}`} testimonial={t} />
          ))}
        </div>
      </div>

      {/* Marquee Row 2 - Right */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="marquee-track-reverse py-2">
          {[...duplicated].reverse().map((t, i) => (
            <TestimonialCard key={`r2-${i}`} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
