import { motion } from "framer-motion";

interface MascotProps {
  mood?: "happy" | "thinking" | "celebrate" | "sad";
  size?: number;
}

export function Mascot({ mood = "happy", size = 96 }: MascotProps) {
  const face = mood === "celebrate" ? "🤩" : mood === "thinking" ? "🤔" : mood === "sad" ? "😟" : "😊";
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1, rotate: mood === "celebrate" ? [0, -10, 10, -6, 6, 0] : 0 }}
      transition={{
        scale: { type: "spring", stiffness: 200, damping: 12 },
        rotate: { duration: 0.6, ease: "easeInOut" },
      }}
      className="relative"
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 rounded-full gradient-primary blur-2xl opacity-60 animate-pulse-glow"
      />
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex h-full w-full items-center justify-center rounded-full glass-strong glow-green"
        style={{ fontSize: size * 0.55 }}
      >
        {face}
      </motion.div>
    </motion.div>
  );
}
