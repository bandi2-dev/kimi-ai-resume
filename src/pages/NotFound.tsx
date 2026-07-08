import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-16 px-6 min-h-screen flex items-center justify-center"
    >
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 mb-6">
          <Sparkles className="w-10 h-10 text-[#2DD4BF]" />
        </div>
        <h1 className="text-6xl font-bold mb-4 font-mono">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          This page has drifted into deep space.
        </p>
        <Link to="/">
          <Button className="bg-[#D4AF37] text-black hover:bg-[#E5C158] transition-all hover:scale-[1.02]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orbit
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
