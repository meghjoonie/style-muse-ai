import { motion } from "framer-motion";
import { Copy, Check, Download, Tag, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface PromptResultProps {
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
  isLoading: boolean;
}

const PromptResult = ({ prompt, negativePrompt, tags, details, isLoading }: PromptResultProps) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-2xl mx-auto space-y-4"
      >
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-2xl p-6">
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded-full w-1/4 animate-pulse" />
              <div className="h-3 bg-muted rounded-full w-full animate-pulse" />
              <div className="h-3 bg-muted rounded-full w-3/4 animate-pulse" />
            </div>
          </div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto space-y-4"
    >
      {/* Main Prompt */}
      <div className="glass rounded-2xl p-6 glow-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Generated Prompt</h3>
          <button
            onClick={() => copyToClipboard(prompt, "prompt")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm transition-colors"
          >
            {copied === "prompt" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied === "prompt" ? "Copied!" : "Copy"}
          </button>
        </div>
        <p className="text-foreground leading-relaxed">{prompt}</p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Object.entries(details).map(([key, value]) => (
          <div key={key} className="glass rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{key}</p>
            <p className="text-sm font-medium text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Quality Tags */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Quality Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Negative Prompt */}
      <div className="glass rounded-2xl p-6 border-destructive/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <h3 className="text-sm font-semibold text-destructive uppercase tracking-wider">Negative Prompt</h3>
          </div>
          <button
            onClick={() => copyToClipboard(negativePrompt, "negative")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive text-sm transition-colors"
          >
            {copied === "negative" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied === "negative" ? "Copied!" : "Copy"}
          </button>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">{negativePrompt}</p>
      </div>

      {/* Download */}
      <button
        onClick={() => {
          const text = `PROMPT:\n${prompt}\n\nNEGATIVE PROMPT:\n${negativePrompt}\n\nTAGS: ${tags.join(", ")}`;
          const blob = new Blob([text], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "styleprompt-output.txt";
          a.click();
        }}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium transition-colors"
      >
        <Download className="w-4 h-4" />
        Download Prompt as Text
      </button>
    </motion.div>
  );
};

export default PromptResult;
