import { useState } from "react";
import Hero from "@/components/Hero";
import ImageUpload from "@/components/ImageUpload";
import PromptResult from "@/components/PromptResult";
import SuggestedStyles from "@/components/SuggestedStyles";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2 } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

interface PromptData {
  prompt: string;
  negativePrompt: string;
  tags: string[];
  details: {
    style: string;
    lighting: string;
    mood: string;
    composition: string;
    camera: string;
  };
}

const Index = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PromptData | null>(null);

  const handleImageSelect = (file: File, preview: string) => {
    setImageFile(file);
    setImagePreview(preview);
    setResult(null);
  };

  const handleClear = () => {
    setImageFile(null);
    setImagePreview(null);
    setResult(null);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis - will be replaced with real AI once Cloud is enabled
    setTimeout(() => {
      setResult({
        prompt:
          "Ultra-realistic cinematic portrait, golden hour lighting, warm amber tones, shallow depth of field, 85mm lens, soft diffused shadows, natural skin texture with subtle imperfections, professional color grading with warm highlights, volumetric light rays, high detail, 8K quality, shot on Hasselblad.",
        negativePrompt:
          "blurry, low quality, distorted face, extra fingers, bad anatomy, overexposed, watermark, text, logo, cartoon, illustration, painting, drawing, noise, grain, pixelated",
        tags: ["8K", "ultra realistic", "cinematic", "golden hour", "portrait", "Hasselblad", "high detail"],
        details: {
          style: "Cinematic Realism",
          lighting: "Golden Hour, Warm",
          mood: "Intimate & Cinematic",
          composition: "Close-up Portrait",
          camera: "85mm f/1.4 Hasselblad",
        },
      });
      setIsAnalyzing(false);
    }, 2500);
  };

  const handleStyleSelect = (style: any) => {
    setResult(style);
    setImagePreview(null);
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Ambient hero background */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none opacity-20">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-10 pb-20">
        <Hero />

        {/* Upload Section */}
        <section className="w-full px-4">
          <ImageUpload
            onImageSelect={handleImageSelect}
            preview={imagePreview}
            onClear={handleClear}
          />

          {/* Analyze Button */}
          <AnimatePresence>
            {imagePreview && !result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-center mt-6"
              >
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Wand2 className="w-5 h-5" />
                  {isAnalyzing ? "Analyzing Style…" : "Generate Prompt"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Results */}
        <AnimatePresence>
          {(isAnalyzing || result) && (
            <section className="w-full px-4">
              <PromptResult
                prompt={result?.prompt || ""}
                negativePrompt={result?.negativePrompt || ""}
                tags={result?.tags || []}
                details={result?.details || { style: "", lighting: "", mood: "", composition: "", camera: "" }}
                isLoading={isAnalyzing}
              />
            </section>
          )}
        </AnimatePresence>

        {/* Suggested Styles */}
        <section className="w-full px-4 mt-8">
          <SuggestedStyles onSelect={handleStyleSelect} />
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground pt-10">
          <p>StylePrompt AI • Turn visual inspiration into perfect AI prompts</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
