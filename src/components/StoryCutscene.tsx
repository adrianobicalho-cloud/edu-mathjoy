import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mascot } from "./Mascot";
import { sfx } from "@/lib/game";
import { type DialogLine } from "@/lib/story";
import { Bot, Sparkles, ChevronRight, SkipForward } from "lucide-react";

interface StoryCutsceneProps {
  dialogs: DialogLine[];
  onComplete: () => void;
  title?: string;
}

export function StoryCutscene({ dialogs, onComplete, title }: StoryCutsceneProps) {
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const current = dialogs[index] || dialogs[0];

  useEffect(() => {
    if (!current) return;
    setDisplayedText("");
    setIsTyping(true);

    let charIndex = 0;
    const fullText = current.text;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      charIndex++;
      setDisplayedText(fullText.slice(0, charIndex));

      if (charIndex % 3 === 0) {
        sfx.speech();
      }

      if (charIndex >= fullText.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsTyping(false);
      }
    }, 24);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [index, current]);

  const handleNext = () => {
    sfx.click();
    if (isTyping) {
      // If still typing, complete current line immediately
      if (timerRef.current) clearInterval(timerRef.current);
      setDisplayedText(current.text);
      setIsTyping(false);
    } else {
      // Advance to next line
      if (index + 1 < dialogs.length) {
        setIndex((i) => i + 1);
      } else {
        onComplete();
      }
    }
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    sfx.click();
    if (timerRef.current) clearInterval(timerRef.current);
    onComplete();
  };

  const renderSpeakerVisual = () => {
    if (current.speaker === "Joy") {
      return (
        <div className="relative">
          <Mascot mood={current.mood} size={72} isSpeaking={isTyping} />
        </div>
      );
    }
    if (current.speaker === "Sigma-7") {
      return (
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-950/80 border border-cyan-400/40 shadow-[0_0_15px_#06b6d4]"
        >
          <Bot className="h-8 w-8 text-cyan-300" />
        </motion.div>
      );
    }
    return (
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 via-rose-500 to-amber-400 shadow-[0_0_20px_#f43f5e] animate-pulse">
        <Sparkles className="h-8 w-8 text-white" />
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full my-4"
    >
      {title && (
        <div className="flex items-center justify-between mb-2 px-2">
          <div className="text-xs uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> {title}
          </div>
          <button
            onClick={handleSkip}
            className="text-xs text-muted-foreground hover:text-cyan-300 flex items-center gap-1 px-2 py-0.5 rounded-full glass transition-colors"
          >
            Pular história <SkipForward className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Main Dialogue Box */}
      <div
        onClick={handleNext}
        className="relative group cursor-pointer glass-strong rounded-3xl p-5 sm:p-6 border border-cyan-400/30 shadow-[0_10px_35px_rgba(0,0,0,0.5)] overflow-hidden transition-all hover:border-cyan-400/60"
      >
        {/* Ambient subtle glow */}
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-cyan-500/15 blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-shrink-0 self-center sm:self-start">
            {renderSpeakerVisual()}
          </div>

          <div className="flex-1 min-w-0">
            {/* Speaker Name Tag */}
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-xs font-black px-2.5 py-0.5 rounded-full tracking-wider uppercase ${
                  current.speaker === "Joy"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : current.speaker === "Sigma-7"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                }`}
              >
                {current.speaker}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {index + 1} de {dialogs.length}
              </span>
            </div>

            {/* Typewritten Dialogue */}
            <p className="text-base sm:text-lg font-medium leading-relaxed text-foreground min-h-[50px] text-balance">
              {displayedText}
              {isTyping && (
                <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse" />
              )}
            </p>
          </div>
        </div>

        {/* Advance indicator bar */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
          <span className="italic">Toque em qualquer lugar para continuar</span>
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="flex items-center gap-1 text-cyan-400 font-semibold"
          >
            {index + 1 === dialogs.length ? "Iniciar Desafio" : "Avançar"}{" "}
            <ChevronRight className="h-4 w-4" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
