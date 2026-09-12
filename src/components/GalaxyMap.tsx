import { motion } from "framer-motion";
import { STORY_CHAPTERS, type StoryProgress } from "@/lib/story";
import { Lock, CheckCircle2, Rocket, Sparkles } from "lucide-react";
import { sfx } from "@/lib/game";

interface GalaxyMapProps {
  progress: StoryProgress;
  onSelectChapter?: (chapterId: number) => void;
  activeChapterId?: number;
}

export function GalaxyMap({
  progress,
  onSelectChapter,
  activeChapterId,
}: GalaxyMapProps) {
  const currentActive = activeChapterId ?? progress.unlockedChapter;

  return (
    <div className="relative glass-strong rounded-3xl p-6 border border-cyan-500/20 overflow-hidden">
      {/* Starfield background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-4 left-10 w-1 h-1 bg-white rounded-full animate-ping" />
        <div className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse" />
        <div className="absolute bottom-6 right-16 w-1 h-1 bg-emerald-300 rounded-full animate-ping" />
        <div className="absolute top-8 right-1/3 w-1.5 h-1.5 bg-amber-200 rounded-full animate-pulse" />
      </div>

      <div className="relative flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" /> Mapa Cósmico de Joy
          </h3>
          <p className="text-xs text-muted-foreground">
            {progress.completedChapters.length} de {STORY_CHAPTERS.length} reinos
            restaurados
          </p>
        </div>
        <div className="flex items-center gap-2">
          {progress.unlockedRelics.length > 0 && (
            <div className="glass px-3 py-1 rounded-full text-xs font-bold text-amber-300 flex items-center gap-1 border border-amber-400/30">
              <span>{progress.unlockedRelics.length}</span> Relíquias 💎
            </div>
          )}
        </div>
      </div>

      {/* Nodes grid/timeline */}
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 py-4">
        {/* Connecting neon rail (desktop horizontal, mobile vertical) */}
        <div className="hidden md:block absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-slate-800 rounded-full z-0">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 rounded-full shadow-[0_0_12px_#38bdf8]"
            initial={{ width: "0%" }}
            animate={{
              width: `${((Math.min(progress.unlockedChapter, STORY_CHAPTERS.length) - 1) / (STORY_CHAPTERS.length - 1)) * 100}%`,
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        {STORY_CHAPTERS.map((ch) => {
          const isCompleted = progress.completedChapters.includes(ch.id);
          const isUnlocked = ch.id <= progress.unlockedChapter;
          const isCurrent = ch.id === currentActive;
          const hasRelic = progress.unlockedRelics.includes(ch.relic.id);

          return (
            <motion.div
              key={ch.id}
              whileHover={isUnlocked ? { scale: 1.08 } : {}}
              onClick={() => {
                if (isUnlocked && onSelectChapter) {
                  sfx.click();
                  onSelectChapter(ch.id);
                }
              }}
              className={`relative z-10 flex md:flex-col items-center gap-3 w-full md:w-auto p-3 rounded-2xl transition-all cursor-pointer ${
                isUnlocked
                  ? "hover:bg-white/5"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              {/* Node Orb with Status */}
              <div className="relative">
                {isCurrent && (
                  <motion.div
                    layoutId="joy-ship"
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center bg-cyan-500 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black shadow-lg shadow-cyan-500/50"
                  >
                    <Rocket className="h-3 w-3 mr-1" /> NAVE
                  </motion.div>
                )}

                <div
                  className={`h-14 w-14 rounded-2xl flex items-center justify-center text-xl font-black transition-all ${
                    isCompleted
                      ? "bg-gradient-to-tr from-emerald-500 to-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.5)]"
                      : isCurrent
                      ? "bg-gradient-to-tr from-blue-600 to-cyan-400 text-white ring-4 ring-cyan-400/40 shadow-[0_0_25px_rgba(56,189,248,0.7)]"
                      : isUnlocked
                      ? "glass border border-cyan-400/40 text-cyan-300"
                      : "bg-slate-900 border border-slate-700 text-slate-500"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-7 w-7 text-slate-950" />
                  ) : isUnlocked ? (
                    ch.id
                  ) : (
                    <Lock className="h-5 w-5 text-slate-500" />
                  )}
                </div>

                {/* Relic badge pinned to node */}
                {hasRelic && (
                  <div
                    title={`${ch.relic.name}: ${ch.relic.desc}`}
                    className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-slate-900 border border-amber-400/80 flex items-center justify-center text-xs shadow-md"
                  >
                    {ch.relic.emoji}
                  </div>
                )}
              </div>

              {/* Chapter Information */}
              <div className="text-left md:text-center">
                <div className="text-xs font-bold leading-tight">
                  {ch.realmName}
                </div>
                <div className="text-[11px] text-muted-foreground line-clamp-1">
                  Capítulo {ch.id}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
