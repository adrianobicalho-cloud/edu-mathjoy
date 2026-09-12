import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { StoryCutscene } from "./StoryCutscene";
import { Mascot } from "./Mascot";
import { GalaxyMap } from "./GalaxyMap";
import {
  type Chapter,
  type Relic,
  loadStoryProgress,
  completeStoryChapter,
  STORY_CHAPTERS,
} from "@/lib/story";
import { sfx } from "@/lib/game";
import { Sparkles, Trophy, ArrowRight, BookOpen, RotateCcw, Home } from "lucide-react";

interface StageTransitionModalProps {
  chapter: Chapter;
  score: number;
  combo: number;
  onNextChapter: () => void;
  onReplayChapter: () => void;
  onGoHome: () => void;
}

export function StageTransitionModal({
  chapter,
  score,
  combo,
  onNextChapter,
  onReplayChapter,
  onGoHome,
}: StageTransitionModalProps) {
  const [step, setStep] = useState<"cutscene" | "relic" | "summary">("cutscene");
  const [newRelic, setNewRelic] = useState<Relic | null>(null);
  const [storyProgress, setStoryProgress] = useState(() => loadStoryProgress());
  const hasNextChapter = chapter.id < STORY_CHAPTERS.length;

  useEffect(() => {
    // Register completion and check for newly unlocked relic
    const result = completeStoryChapter(chapter.id);
    const updated = loadStoryProgress();
    setStoryProgress(updated);

    if (result.newRelic) {
      setNewRelic(result.newRelic);
    }

    // Trigger celebration effects
    sfx.levelUp();
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.5 },
      colors: ["#34d399", "#38bdf8", "#fbbf24", "#a855f7"],
    });
  }, [chapter.id]);

  const handleCutsceneDone = () => {
    if (newRelic) {
      sfx.relicGet();
      setStep("relic");
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.45 },
        colors: ["#fbbf24", "#f59e0b", "#6ee7b7"],
      });
    } else {
      setStep("summary");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-2xl glass-strong rounded-3xl p-6 sm:p-8 border border-cyan-400/40 shadow-2xl overflow-hidden my-8"
      >
        {/* Subtle background cosmic glows */}
        <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

        <AnimatePresence mode="wait">
          {/* STEP 1: Interactive Victory Cutscene */}
          {step === "cutscene" && (
            <motion.div
              key="cutscene"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider mb-3 border border-emerald-500/30">
                <Sparkles className="h-3.5 w-3.5" /> Fase Concluída!
              </div>

              <h2 className="text-2xl sm:text-4xl font-black gradient-text tracking-tight mb-1">
                {chapter.realmName}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                A harmonia matemática foi restaurada!
              </p>

              <StoryCutscene
                dialogs={chapter.victoryDialog}
                onComplete={handleCutsceneDone}
                title="Diálogo da Vitória com Joy"
              />
            </motion.div>
          )}

          {/* STEP 2: Cosmic Relic Acquisition */}
          {step === "relic" && newRelic && (
            <motion.div
              key="relic"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex flex-col items-center text-center py-4"
            >
              <div className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-2 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" /> Relíquia Lendária Descoberta!
              </div>

              {/* Relic Orb Animation */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 5, -5, 0],
                  boxShadow: [
                    "0 0 25px rgba(251,191,36,0.4)",
                    "0 0 50px rgba(251,191,36,0.8)",
                    "0 0 25px rgba(251,191,36,0.4)",
                  ],
                }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="h-28 w-28 rounded-3xl bg-gradient-to-tr from-amber-500/30 via-yellow-400/20 to-cyan-400/20 border-2 border-amber-300 flex items-center justify-center text-5xl my-4 backdrop-blur-md"
              >
                {newRelic.emoji}
              </motion.div>

              <h3 className="text-2xl font-black text-amber-300 mb-1">
                {newRelic.name}
              </h3>
              <p className="text-sm text-foreground/90 max-w-md font-medium mb-3">
                "{newRelic.desc}"
              </p>
              <div className="glass px-4 py-2 rounded-2xl text-xs font-semibold text-emerald-300 border border-emerald-400/30 mb-6">
                ⚡ Poder Desbloqueado: {newRelic.power}
              </div>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  sfx.click();
                  setStep("summary");
                }}
                className="gradient-primary px-8 py-3.5 rounded-2xl font-bold text-slate-950 shadow-lg glow-green flex items-center gap-2"
              >
                Equipar e Continuar <ArrowRight className="h-4 w-4" />
              </motion.button>
            </motion.div>
          )}

          {/* STEP 3: Journey Progress & Navigation */}
          {step === "summary" && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <Mascot mood="celebrate" size={56} />
                  <div>
                    <h3 className="text-xl font-black tracking-tight">
                      Jornada Atualizada!
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Capítulo {chapter.id} concluído com sucesso
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 text-right">
                  <div>
                    <div className="text-[10px] uppercase text-muted-foreground">
                      Pontos
                    </div>
                    <div className="text-xl font-black text-cyan-300">
                      +{score}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-muted-foreground">
                      Combo Máx
                    </div>
                    <div className="text-xl font-black text-amber-300">
                      {combo}×
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Cosmic Map with Updated Path */}
              <GalaxyMap
                progress={storyProgress}
                activeChapterId={
                  hasNextChapter ? chapter.id + 1 : chapter.id
                }
              />

              {/* Historical Lore Quote */}
              <div className="glass rounded-2xl p-4 border border-cyan-400/20 text-xs leading-relaxed text-muted-foreground italic flex gap-3 items-start">
                <BookOpen className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-foreground not-italic block mb-0.5">
                    Registro do Diário de Bordo da Axioma:
                  </span>
                  "{chapter.codexLore}"
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {hasNextChapter ? (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      sfx.warpJump();
                      onNextChapter();
                    }}
                    className="flex-1 gradient-primary py-3.5 px-6 rounded-2xl font-black text-slate-950 flex items-center justify-center gap-2 shadow-xl glow-blue"
                  >
                    Viajar para o Capítulo {chapter.id + 1}{" "}
                    <ArrowRight className="h-5 w-5" />
                  </motion.button>
                ) : (
                  <div className="flex-1 glass py-3 rounded-2xl font-bold text-center text-amber-300 border border-amber-400/40">
                    🏆 Parabéns! Você restaurou todo o CosmoJoy!
                  </div>
                )}

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      sfx.click();
                      onReplayChapter();
                    }}
                    title="Jogar este capítulo novamente"
                    className="glass px-4 py-3.5 rounded-2xl font-semibold flex items-center gap-2 text-sm hover:bg-white/10"
                  >
                    <RotateCcw className="h-4 w-4" /> Repetir
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      sfx.click();
                      onGoHome();
                    }}
                    title="Voltar ao início"
                    className="glass px-4 py-3.5 rounded-2xl font-semibold flex items-center gap-2 text-sm hover:bg-white/10"
                  >
                    <Home className="h-4 w-4" /> Início
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
