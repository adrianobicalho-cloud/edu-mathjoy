import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { z } from "zod";
import { Mascot } from "@/components/Mascot";
import { ParticleBg } from "@/components/ParticleBg";
import {
  generateQuestion,
  loadProfile,
  saveProfile,
  sfx,
  xpForLevel,
  type Mode,
  type Question,
} from "@/lib/game";
import { Heart, Timer, Flame, X, Home, RotateCcw, Trophy } from "lucide-react";

const search = z.object({
  mode: z.enum(["operations", "logic", "context"]).default("operations"),
});

export const Route = createFileRoute("/game")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "Partida — MathJoy" }] }),
  component: Game,
});

const TOTAL_QUESTIONS = 10;
const TIME_PER_Q = 15;

function Game() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const [profile] = useState(() => loadProfile());
  const [qIndex, setQIndex] = useState(0);
  const [question, setQuestion] = useState<Question>(() => generateQuestion(mode as Mode, profile.level));
  const [chosen, setChosen] = useState<number | null>(null);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [time, setTime] = useState(TIME_PER_Q);
  const [phase, setPhase] = useState<"play" | "end">("play");
  const [mood, setMood] = useState<"happy" | "thinking" | "celebrate" | "sad">("thinking");

  // timer
  useEffect(() => {
    if (phase !== "play" || chosen !== null) return;
    if (time <= 0) {
      handleAnswer(-1);
      return;
    }
    const id = setTimeout(() => setTime((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [time, phase, chosen]);

  function handleAnswer(opt: number) {
    if (chosen !== null) return;
    setChosen(opt);
    const correct = opt === question.answer;
    if (correct) {
      sfx.correct();
      const bonus = Math.max(0, time) * 2;
      const multiplier = 1 + Math.floor(combo / 3) * 0.5;
      const gained = Math.round((10 + bonus) * multiplier);
      setScore((s) => s + gained);
      setCombo((c) => c + 1);
      setMood("celebrate");
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#34d399", "#3b82f6", "#a7f3d0"],
      });
    } else {
      sfx.wrong();
      setCombo(0);
      setLives((l) => l - 1);
      setMood("sad");
    }

    setTimeout(() => {
      const nextIndex = qIndex + 1;
      if (nextIndex >= TOTAL_QUESTIONS || (!correct && lives - 1 <= 0)) {
        finish(correct);
        return;
      }
      setQIndex(nextIndex);
      setQuestion(generateQuestion(mode as Mode, profile.level));
      setChosen(null);
      setTime(TIME_PER_Q);
      setMood("thinking");
    }, 1100);
  }

  function finish(_lastCorrect: boolean) {
    setPhase("end");
    sfx.levelUp();
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
    setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.5 },
        colors: ["#34d399", "#3b82f6", "#fbbf24", "#a7f3d0"],
      });
    }, 250);
  }

  const progress = ((qIndex + (chosen !== null ? 1 : 0)) / TOTAL_QUESTIONS) * 100;

  if (phase === "end") return <EndScreen score={score} combo={combo} navigate={navigate} mode={mode} />;

  return (
    <div className="relative min-h-screen px-4 py-6 sm:px-6 max-w-3xl mx-auto flex flex-col">
      <ParticleBg />

      {/* Top bar */}
      <header className="flex items-center justify-between gap-3 mb-6">
        <Link to="/play" onClick={sfx.click} className="glass rounded-full p-2.5">
          <X className="h-5 w-5" />
        </Link>
        <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
            className="h-full gradient-primary"
          />
        </div>
        <div className="flex items-center gap-1 glass rounded-full px-3 py-1.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart
              key={i}
              className={`h-4 w-4 ${i < lives ? "text-rose-400 fill-rose-400" : "text-muted-foreground/30"}`}
            />
          ))}
        </div>
      </header>

      {/* Stats row */}
      <div className="flex items-center justify-between mb-6 text-sm">
        <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5">
          <Timer className="h-4 w-4 text-primary-glow" />
          <span className={`font-bold tabular-nums ${time <= 5 ? "text-destructive" : ""}`}>{time}s</span>
        </div>
        <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5">
          <Trophy className="h-4 w-4 text-secondary" />
          <span className="font-bold tabular-nums">{score}</span>
        </div>
        <AnimatePresence>
          {combo > 1 && (
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 font-bold text-sm"
            >
              <Flame className="h-4 w-4" /> {combo}× combo
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mascot + Question */}
      <div className="flex flex-col items-center mb-8">
        <Mascot mood={mood} size={100} />
      </div>

      <motion.div
        key={qIndex}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="glass-strong rounded-3xl p-8 mb-6 text-center"
      >
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Questão {qIndex + 1} de {TOTAL_QUESTIONS}
        </div>
        <div className="text-3xl sm:text-5xl font-black text-balance">{question.prompt}</div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {question.options.map((opt) => {
          const isChosen = chosen === opt;
          const isCorrect = opt === question.answer;
          const reveal = chosen !== null;
          return (
            <motion.button
              key={opt}
              whileHover={{ scale: chosen === null ? 1.03 : 1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleAnswer(opt)}
              disabled={chosen !== null}
              className={`relative rounded-2xl p-5 text-2xl font-bold transition-all glass-strong ${
                reveal && isCorrect ? "ring-2 ring-secondary glow-green" : ""
              } ${reveal && isChosen && !isCorrect ? "ring-2 ring-destructive opacity-60" : ""}`}
            >
              {opt}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function EndScreen({ score, combo, navigate, mode }: { score: number; combo: number; navigate: ReturnType<typeof useNavigate>; mode: string }) {
  const p = loadProfile();
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <ParticleBg />
      <motion.div
        initial={{ scale: 0.6, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 16 }}
        className="glass-strong rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-secondary/40 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-primary/40 blur-3xl" />

        <div className="relative">
          <Mascot mood="celebrate" size={120} />
          <h2 className="text-3xl font-black mt-4 gradient-text">Mandou bem!</h2>
          <p className="text-muted-foreground text-sm mt-1">Você ganhou XP e subiu no ranking 🎉</p>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="glass rounded-2xl p-3">
              <div className="text-xs text-muted-foreground">Pontos</div>
              <div className="text-2xl font-black gradient-text">{score}</div>
            </div>
            <div className="glass rounded-2xl p-3">
              <div className="text-xs text-muted-foreground">Combo</div>
              <div className="text-2xl font-black">{combo}×</div>
            </div>
            <div className="glass rounded-2xl p-3">
              <div className="text-xs text-muted-foreground">Nível</div>
              <div className="text-2xl font-black">{p.level}</div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { sfx.click(); navigate({ to: "/game", search: { mode: mode as Mode } }); }}
              className="flex-1 gradient-primary rounded-2xl py-3 font-bold flex items-center justify-center gap-2 text-primary-foreground glow-blue"
            >
              <RotateCcw className="h-4 w-4" /> Jogar de novo
            </motion.button>
            <Link to="/" onClick={sfx.click} className="flex-1">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="glass rounded-2xl py-3 font-bold flex items-center justify-center gap-2"
              >
                <Home className="h-4 w-4" /> Início
              </motion.div>
            </Link>
          </div>

          <button
            onClick={() => {
              navigator.share?.({
                title: "MathJoy",
                text: `Acabei de marcar ${score} pontos no MathJoy! Vem me desafiar 🎯`,
                url: window.location.origin,
              }).catch(() => {
                navigator.clipboard.writeText(`${window.location.origin} — fiz ${score} pontos!`);
              });
            }}
            className="mt-3 text-xs text-secondary hover:underline"
          >
            🔗 Convidar amigos para o desafio
          </button>
        </div>
      </motion.div>
    </div>
  );
}
