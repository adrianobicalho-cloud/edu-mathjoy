import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { z } from "zod";
import { Mascot, type MascotMood } from "@/components/Mascot";
import { ParticleBg } from "@/components/ParticleBg";
import { StoryCutscene } from "@/components/StoryCutscene";
import { StageTransitionModal } from "@/components/StageTransitionModal";
import {
  generateQuestion,
  loadProfile,
  saveProfile,
  sfx,
  xpForLevel,
  type Mode,
  type Question,
} from "@/lib/game";
import {
  STORY_CHAPTERS,
  loadStoryProgress,
  type Chapter,
} from "@/lib/story";
import { Heart, Timer, Flame, X, Home, RotateCcw, Trophy, Sparkles, BookOpen } from "lucide-react";

const search = z.object({
  mode: z.enum(["operations", "logic", "context", "story"]).default("operations"),
  chapter: z.coerce.number().optional(),
});

export const Route = createFileRoute("/game")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "Partida — MathJoy" }] }),
  component: Game,
});

const DEFAULT_QUESTIONS = 10;
const TIME_PER_Q = 18;

function Game() {
  const { mode, chapter: chapterParam } = Route.useSearch();
  const navigate = useNavigate();
  const [profile] = useState(() => loadProfile());
  const [storyProgress] = useState(() => loadStoryProgress());

  // Determine current chapter if in story mode
  const isStoryMode = mode === "story";
  const activeChapterId = chapterParam ?? Math.min(storyProgress.unlockedChapter, STORY_CHAPTERS.length);
  const currentChapter: Chapter =
    STORY_CHAPTERS.find((c) => c.id === activeChapterId) ?? STORY_CHAPTERS[0];

  const totalQuestions = isStoryMode ? currentChapter.targetQuestions : DEFAULT_QUESTIONS;

  const [qIndex, setQIndex] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);

  // Generate question using chapter mode if in story
  const effectiveMode = isStoryMode ? currentChapter.mode : (mode as Mode);

  useEffect(() => {
    if (!question) setQuestion(generateQuestion(effectiveMode, profile.level));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [chosen, setChosen] = useState<number | null>(null);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [time, setTime] = useState(TIME_PER_Q);
  const [phase, setPhase] = useState<"play" | "end">("play");
  const [mood, setMood] = useState<MascotMood>("thinking");

  // Story cutscene states
  const [showIntroCutscene, setShowIntroCutscene] = useState(() => isStoryMode);
  const [showTransitionModal, setShowTransitionModal] = useState(false);

  // Timer logic (paused during intro cutscene)
  useEffect(() => {
    if (phase !== "play" || chosen !== null || showIntroCutscene) return;
    if (time <= 0) {
      handleAnswer(-1);
      return;
    }
    const id = setTimeout(() => setTime((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [time, phase, chosen, showIntroCutscene]);

  function handleAnswer(opt: number) {
    if (chosen !== null || !question) return;
    setChosen(opt);
    const correct = opt === question.answer;
    if (correct) {
      sfx.correct();
      const bonus = Math.max(0, time) * 2;
      const multiplier = 1 + Math.floor(combo / 3) * 0.5;
      const gained = Math.round((15 + bonus) * multiplier);
      setScore((s) => s + gained);
      setCombo((c) => c + 1);
      setMood("celebrate");
      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.6 },
        colors: ["#34d399", "#38bdf8", "#a7f3d0"],
      });
    } else {
      sfx.wrong();
      setCombo(0);
      setLives((l) => l - 1);
      setMood("sad");
    }

    setTimeout(() => {
      const nextIndex = qIndex + 1;
      if (nextIndex >= totalQuestions || (!correct && lives - 1 <= 0)) {
        finish(correct && lives > 0);
        return;
      }
      setQIndex(nextIndex);
      setQuestion(generateQuestion(effectiveMode, profile.level));
      setChosen(null);
      setTime(TIME_PER_Q);
      setMood("thinking");
    }, 1100);
  }

  function finish(isVictory: boolean) {
    const p = loadProfile();
    const newXp = p.xp + score;
    const leveledUp = newXp >= xpForLevel(p.level);
    const updated = {
      ...p,
      xp: newXp,
      level: leveledUp ? p.level + 1 : p.level,
      bestScore: Math.max(p.bestScore, score),
      lastPlayed: new Date().toISOString(),
      medals: combo >= 5 && !p.medals.includes("combo5") ? [...p.medals, "combo5"] : p.medals,
    };
    saveProfile(updated);

    if (isStoryMode && isVictory) {
      // Trigger rich stage transition modal with storytelling
      setShowTransitionModal(true);
    } else {
      setPhase("end");
      sfx.levelUp();
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 110,
          origin: { y: 0.5 },
          colors: ["#34d399", "#3b82f6", "#fbbf24", "#a7f3d0"],
        });
      }, 250);
    }
  }

  const progress = ((qIndex + (chosen !== null ? 1 : 0)) / totalQuestions) * 100;

  // Actions for StageTransitionModal
  const handleNextChapter = () => {
    navigate({
      to: "/game",
      search: { mode: "story", chapter: currentChapter.id + 1 },
    });
    // Reset state for new chapter
    setQIndex(0);
    setScore(0);
    setCombo(0);
    setLives(3);
    setTime(TIME_PER_Q);
    setChosen(null);
    setShowTransitionModal(false);
    setShowIntroCutscene(true);
    const nextChapter = STORY_CHAPTERS.find((c) => c.id === currentChapter.id + 1) ?? currentChapter;
    setQuestion(generateQuestion(nextChapter.mode, profile.level));
  };

  const handleReplayChapter = () => {
    navigate({
      to: "/game",
      search: { mode: "story", chapter: currentChapter.id },
    });
    setQIndex(0);
    setScore(0);
    setCombo(0);
    setLives(3);
    setTime(TIME_PER_Q);
    setChosen(null);
    setShowTransitionModal(false);
    setShowIntroCutscene(false);
    setQuestion(generateQuestion(currentChapter.mode, profile.level));
  };

  const handleGoHome = () => {
    navigate({ to: "/" });
  };

  if (phase === "end") {
    return (
      <EndScreen
        score={score}
        combo={combo}
        navigate={navigate}
        mode={mode}
        isStoryMode={isStoryMode}
        currentChapter={currentChapter}
      />
    );
  }

  return (
    <div className="relative min-h-screen px-4 py-6 sm:px-6 max-w-3xl mx-auto flex flex-col">
      <ParticleBg />

      {/* Stage Transition Story Modal when chapter is cleared */}
      <AnimatePresence>
        {showTransitionModal && (
          <StageTransitionModal
            chapter={currentChapter}
            score={score}
            combo={combo}
            onNextChapter={handleNextChapter}
            onReplayChapter={handleReplayChapter}
            onGoHome={handleGoHome}
          />
        )}
      </AnimatePresence>

      {/* Top bar */}
      <header className="flex items-center justify-between gap-3 mb-4">
        <Link to="/play" onClick={sfx.click} className="glass rounded-full p-2.5 hover:bg-white/10 transition-colors">
          <X className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground font-semibold mb-1 px-1">
            <span>
              {isStoryMode ? `${currentChapter.realmName}` : "Progresso"}
            </span>
            <span>
              Questão {Math.min(qIndex + 1, totalQuestions)} / {totalQuestions}
            </span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
              className="h-full gradient-primary"
            />
          </div>
        </div>
        <div className="flex items-center gap-1 glass rounded-full px-3 py-1.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart
              key={i}
              className={`h-4 w-4 transition-colors ${
                i < lives ? "text-rose-400 fill-rose-400" : "text-muted-foreground/25"
              }`}
            />
          ))}
        </div>
      </header>

      {/* Story Chapter Header Pill */}
      {isStoryMode && (
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="inline-flex items-center gap-2 glass px-3 py-1 rounded-full text-xs font-bold text-cyan-300 border border-cyan-400/30">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>{currentChapter.title}</span>
          </div>
          <div className="text-xs text-muted-foreground italic hidden sm:block">
            {currentChapter.subtitle}
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="flex items-center justify-between mb-6 text-sm">
        <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5">
          <Timer className="h-4 w-4 text-cyan-400" />
          <span className={`font-bold tabular-nums ${time <= 5 ? "text-rose-400 animate-pulse" : ""}`}>
            {time}s
          </span>
        </div>
        <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5">
          <Trophy className="h-4 w-4 text-amber-300" />
          <span className="font-bold tabular-nums text-amber-300">{score}</span>
        </div>
        <AnimatePresence>
          {combo > 1 && (
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 font-bold text-sm shadow-md"
            >
              <Flame className="h-4 w-4" /> {combo}× combo
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* INTRO STORY DIALOGUE (Story Mode) */}
      <AnimatePresence>
        {isStoryMode && showIntroCutscene && (
          <StoryCutscene
            dialogs={currentChapter.introDialog}
            onComplete={() => {
              setShowIntroCutscene(false);
              setTime(TIME_PER_Q);
            }}
            title="Missão da História"
          />
        )}
      </AnimatePresence>

      {/* MAIN GAMEPLAY CONTENT (Hidden or backgrounded during intro cutscene) */}
      {(!isStoryMode || !showIntroCutscene) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col flex-1"
        >
          {/* Joy Mascot */}
          <div className="flex flex-col items-center mb-6">
            <Mascot mood={mood} size={105} />
          </div>

          {/* Question Card */}
          <motion.div
            key={qIndex}
            initial={{ opacity: 0, y: 25, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="glass-strong rounded-3xl p-6 sm:p-8 mb-6 text-center border border-cyan-400/30 shadow-xl"
          >
            <div className="text-xs uppercase tracking-widest text-cyan-400/90 font-bold mb-3 flex items-center justify-center gap-2">
              <Sparkles className="h-3 w-3" /> Desafio {qIndex + 1} de {totalQuestions}
            </div>
            <div className="text-2xl sm:text-4xl font-black text-balance whitespace-pre-line leading-relaxed">
              {question?.prompt ?? "…"}
            </div>
          </motion.div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(question?.options ?? []).map((opt) => {
              const isChosen = chosen === opt;
              const isCorrect = opt === question?.answer;
              const reveal = chosen !== null;
              return (
                <motion.button
                  key={opt}
                  whileHover={{ scale: chosen === null ? 1.03 : 1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAnswer(opt)}
                  disabled={chosen !== null}
                  className={`relative rounded-2xl p-5 text-2xl font-bold transition-all glass-strong border ${
                    reveal && isCorrect
                      ? "ring-2 ring-emerald-400 border-emerald-400 glow-green bg-emerald-950/40 text-emerald-300"
                      : ""
                  } ${
                    reveal && isChosen && !isCorrect
                      ? "ring-2 ring-rose-500 border-rose-500 opacity-60 bg-rose-950/40 text-rose-300"
                      : "border-white/10 hover:border-cyan-400/50"
                  }`}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function EndScreen({
  score,
  combo,
  navigate,
  mode,
  isStoryMode,
  currentChapter,
}: {
  score: number;
  combo: number;
  navigate: ReturnType<typeof useNavigate>;
  mode: string;
  isStoryMode: boolean;
  currentChapter: Chapter;
}) {
  const p = loadProfile();
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-8">
      <ParticleBg />
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 16 }}
        className="glass-strong rounded-3xl p-6 sm:p-8 max-w-md w-full text-center relative overflow-hidden border border-cyan-400/30 shadow-2xl"
      >
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

        <div className="relative">
          <Mascot mood={score > 0 ? "celebrate" : "thinking"} size={110} />
          <h2 className="text-3xl font-black mt-4 gradient-text">
            {score > 0 ? "Missão Cumprida!" : "Quase lá, Piloto!"}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {isStoryMode
              ? `Expedição no ${currentChapter.realmName}`
              : "Você ganhou XP e evoluiu suas habilidades! 🎉"}
          </p>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="glass rounded-2xl p-3">
              <div className="text-xs text-muted-foreground">Pontos</div>
              <div className="text-2xl font-black gradient-text">{score}</div>
            </div>
            <div className="glass rounded-2xl p-3">
              <div className="text-xs text-muted-foreground">Combo</div>
              <div className="text-2xl font-black text-amber-300">{combo}×</div>
            </div>
            <div className="glass rounded-2xl p-3">
              <div className="text-xs text-muted-foreground">Nível</div>
              <div className="text-2xl font-black text-cyan-300">{p.level}</div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                sfx.click();
                navigate({
                  to: "/game",
                  search: { mode: mode as Mode, chapter: currentChapter.id },
                });
              }}
              className="flex-1 gradient-primary rounded-2xl py-3.5 font-bold flex items-center justify-center gap-2 text-slate-950 glow-blue"
            >
              <RotateCcw className="h-4 w-4" /> Jogar de novo
            </motion.button>
            <Link to="/play" onClick={sfx.click} className="flex-1">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="glass rounded-2xl py-3.5 font-bold flex items-center justify-center gap-2 hover:bg-white/10"
              >
                <BookOpen className="h-4 w-4" /> Fases
              </motion.div>
            </Link>
          </div>

          <button
            onClick={() => {
              navigator.share?.({
                title: "MathJoy",
                text: `Conquistei ${score} pontos na jornada do MathJoy com Joy! Vem me desafiar 🎯`,
                url: window.location.origin,
              }).catch(() => {
                navigator.clipboard.writeText(`${window.location.origin} — fiz ${score} pontos no MathJoy!`);
              });
            }}
            className="mt-4 text-xs text-cyan-400 hover:underline inline-block"
          >
            🔗 Convidar amigos para o desafio
          </button>
        </div>
      </motion.div>
    </div>
  );
}
