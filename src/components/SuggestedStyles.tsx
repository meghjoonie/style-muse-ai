import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const styles = [
  {
    name: "Cinematic Portrait",
    emoji: "🎬",
    prompt: "Ultra-realistic cinematic portrait, golden hour lighting, warm tones, shallow depth of field, 85mm lens, soft shadows, natural skin texture, professional color grading, high detail, 8K quality.",
    negativePrompt: "blurry, low quality, distorted face, extra fingers, bad anatomy, overexposed, watermark, text",
    tags: ["8K", "cinematic", "portrait", "golden hour", "ultra realistic"],
    details: { style: "Cinematic Realism", lighting: "Golden Hour", mood: "Warm & Dramatic", composition: "Close-up Portrait", camera: "85mm f/1.4" },
  },
  {
    name: "Korean Aesthetic",
    emoji: "🌸",
    prompt: "Korean aesthetic photography, soft pastel tones, clean minimal background, gentle natural light, youthful glow, smooth skin, light makeup, dreamy atmosphere, magazine editorial style, high resolution.",
    negativePrompt: "harsh shadows, cluttered background, oversaturated, noise, grain, low resolution",
    tags: ["pastel", "editorial", "K-beauty", "soft light", "minimal"],
    details: { style: "K-Beauty Editorial", lighting: "Soft Natural", mood: "Dreamy & Fresh", composition: "Editorial Portrait", camera: "50mm f/1.8" },
  },
  {
    name: "Studio Fashion",
    emoji: "💎",
    prompt: "High-end studio fashion photography, dramatic rim lighting, dark background, sharp details, luxury feel, professional model pose, Vogue editorial style, perfect composition, 4K ultra quality.",
    negativePrompt: "amateur, bad lighting, low contrast, blurry, wrinkled clothes, bad posture",
    tags: ["fashion", "studio", "Vogue", "dramatic", "luxury"],
    details: { style: "High Fashion", lighting: "Rim Light", mood: "Bold & Luxurious", composition: "Full Body", camera: "70-200mm f/2.8" },
  },
  {
    name: "Anime Character",
    emoji: "⚡",
    prompt: "Detailed anime character illustration, vibrant colors, dynamic pose, cel shading, clean line art, expressive eyes, fantasy setting, trending on ArtStation, digital art masterpiece.",
    negativePrompt: "realistic, photo, 3D render, bad anatomy, disproportionate, blurry lines, low detail",
    tags: ["anime", "illustration", "vibrant", "digital art", "fantasy"],
    details: { style: "Anime Illustration", lighting: "Cel Shaded", mood: "Dynamic & Vibrant", composition: "Dynamic Pose", camera: "N/A (Digital)" },
  },
  {
    name: "Fantasy Art",
    emoji: "🐉",
    prompt: "Epic fantasy landscape painting, dramatic clouds, magical lighting, ethereal atmosphere, towering mountains, ancient ruins, volumetric light rays, concept art style, ultra detailed, 8K.",
    negativePrompt: "modern elements, cars, buildings, low quality, flat colors, simple background",
    tags: ["fantasy", "concept art", "epic", "magical", "landscape"],
    details: { style: "Fantasy Concept Art", lighting: "Volumetric Rays", mood: "Epic & Mystical", composition: "Wide Landscape", camera: "N/A (Painted)" },
  },
  {
    name: "Cyberpunk Neon",
    emoji: "🌃",
    prompt: "Cyberpunk cityscape at night, neon lights reflecting on wet streets, futuristic architecture, holographic advertisements, moody atmosphere, rain, cinematic composition, Blade Runner inspired, 4K.",
    negativePrompt: "daylight, nature, simple, cartoonish, low resolution, flat lighting",
    tags: ["cyberpunk", "neon", "futuristic", "cinematic", "night"],
    details: { style: "Cyberpunk Noir", lighting: "Neon Glow", mood: "Moody & Futuristic", composition: "Street Level", camera: "24mm wide angle" },
  },
];

interface SuggestedStylesProps {
  onSelect: (style: typeof styles[0]) => void;
}

const SuggestedStyles = ({ onSelect }: SuggestedStylesProps) => {
  return (
    <section className="w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Suggested Styles</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {styles.map((style, i) => (
          <motion.button
            key={style.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => onSelect(style)}
            className="glass rounded-xl p-5 text-left hover:glow-border transition-all duration-300 group"
          >
            <span className="text-2xl mb-2 block">{style.emoji}</span>
            <p className="font-medium text-foreground group-hover:text-primary transition-colors">{style.name}</p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{style.prompt.slice(0, 60)}…</p>
          </motion.button>
        ))}
      </div>
    </section>
  );
};

export default SuggestedStyles;
export { styles };
