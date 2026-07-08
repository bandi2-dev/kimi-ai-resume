import { useRef, useEffect } from "react";

export default function ResumeCard3D() {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;
      const floatY = Math.sin(time) * 10;

      if (card) {
        card.style.transform = `rotateY(${mouseX * 10}deg) rotateX(${-mouseY * 10}deg) translateY(${floatY}px)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="hidden lg:block" style={{ perspective: "1000px" }}>
      <div
        ref={cardRef}
        className="w-[320px] h-[440px] rounded-3xl p-6 transition-transform duration-100 ease-out"
        style={{
          transformStyle: "preserve-3d",
          willChange: "transform",
          background: "linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(244, 244, 245, 0.1)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(45, 212, 191, 0.1)",
        }}
      >
        {/* Resume Header */}
        <div className="border-b border-white/10 pb-4 mb-4">
          <div className="h-3 w-24 bg-[#D4AF37]/60 rounded mb-2" />
          <div className="h-2 w-32 bg-white/20 rounded" />
          <div className="flex gap-3 mt-3">
            <div className="h-1.5 w-14 bg-white/10 rounded" />
            <div className="h-1.5 w-14 bg-white/10 rounded" />
            <div className="h-1.5 w-14 bg-white/10 rounded" />
          </div>
        </div>

        {/* Summary */}
        <div className="mb-4">
          <div className="h-2 w-16 bg-[#2DD4BF]/40 rounded mb-2" />
          <div className="space-y-1.5">
            <div className="h-1.5 w-full bg-white/10 rounded" />
            <div className="h-1.5 w-5/6 bg-white/10 rounded" />
            <div className="h-1.5 w-4/6 bg-white/10 rounded" />
          </div>
        </div>

        {/* Experience */}
        <div className="mb-4">
          <div className="h-2 w-20 bg-[#2DD4BF]/40 rounded mb-2" />
          <div className="mb-2">
            <div className="h-2 w-28 bg-white/20 rounded mb-1" />
            <div className="h-1.5 w-20 bg-white/10 rounded mb-2" />
            <div className="space-y-1">
              <div className="h-1 w-full bg-white/10 rounded" />
              <div className="h-1 w-5/6 bg-white/10 rounded" />
            </div>
          </div>
        </div>

        {/* Skills - ATS Score */}
        <div className="mb-3">
          <div className="h-2 w-10 bg-[#2DD4BF]/40 rounded mb-2" />
          <div className="flex items-center gap-2 mb-1">
            <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-[85%] bg-[#2DD4BF] rounded-full" />
            </div>
            <span className="text-[8px] text-[#2DD4BF] font-mono">85%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-[72%] bg-[#D4AF37] rounded-full" />
            </div>
            <span className="text-[8px] text-[#D4AF37] font-mono">72%</span>
          </div>
        </div>

        {/* Mini circular score */}
        <div className="flex justify-center mt-3">
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="3"
                strokeDasharray={`${0.78 * 125.6} 125.6`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono text-[#D4AF37]">
              78
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
