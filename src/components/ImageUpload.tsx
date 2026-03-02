import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ImageIcon, X } from "lucide-react";

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  preview: string | null;
  onClear: () => void;
}

const ImageUpload = ({ onImageSelect, preview, onClear }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files?.[0]) processFile(files[0]);
    },
    [onImageSelect]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) processFile(files[0]);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      onImageSelect(file, e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative glass rounded-2xl overflow-hidden glow-border"
          >
            <img
              src={preview}
              alt="Uploaded reference"
              className="w-full max-h-[400px] object-contain"
            />
            <button
              onClick={onClear}
              className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-destructive/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <motion.label
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
              flex flex-col items-center justify-center gap-4 p-12 rounded-2xl cursor-pointer
              border-2 border-dashed transition-all duration-300
              ${
                isDragging
                  ? "border-primary bg-primary/5 glow-border"
                  : "border-border/60 hover:border-primary/50 hover:bg-card/40"
              }
            `}
          >
            <motion.div
              animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
              className="p-4 rounded-2xl bg-primary/10"
            >
              {isDragging ? (
                <ImageIcon className="w-10 h-10 text-primary" />
              ) : (
                <Upload className="w-10 h-10 text-primary" />
              )}
            </motion.div>
            <div className="text-center">
              <p className="text-lg font-medium text-foreground">
                {isDragging ? "Drop your image here" : "Drop your reference image"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse • PNG, JPG, WEBP
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </motion.label>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageUpload;
