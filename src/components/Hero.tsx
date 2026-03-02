import { motion } from "framer-motion";
import { Wand2 } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative text-center py-20 px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-pulse-glow" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
            <Wand2 className="w-6 h-6 text-primary" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
          <span className="text-foreground">Style</span>
          <span className="text-gradient">Prompt</span>
          <span className="text-foreground"> AI</span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Upload any reference image. Get a perfect AI prompt to recreate that style in Midjourney, DALL·E, or Stable Diffusion.
        </p>
      </motion.div>
    </section>
  );
};

export default Hero;
