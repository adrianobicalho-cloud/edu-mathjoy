import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Mascot } from "@/components/Mascot";
import { ParticleBg } from "@/components/ParticleBg";
import { loadProfile, type Profile, xpForLevel, sfx } from "@/lib/game";
import { Flame, Trophy, Heart, Zap, Medal, Sparkles, Play } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MathJoy — Matemática vira jogo" },
      { name: "description", content: "Plataforma gamificada de matemática para ensino fundamental e médio. XP, conquistas, ranking e desafios diários." },
      { property: "og:title", content: "MathJoy — Matemática vira jogo" },
      { property: "og:description", content: "Aprenda matemática jogando: lógica, 4 operações e problemas contextualizados." },
    ],
  }),
  component: Dashboard,
});

function Stat({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass rounded-2xl p-4 flex items-center gap-3"
    >
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5 text-primary-foreground" />
      </div>
      <div>
        <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
    </motion.div>
  );
}

function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  useEffect(() => setProfile(loadProfile()), []);
  if (!profile) return null;

  const needed = xpForLevel(profile.level);
  const progress = Math.min(100, (profile.xp % needed) / needed * 100);

  return (
    <div className="relative min-h-screen px-4 py-6 sm:px-6 lg:px-10 max-w-6xl mx-auto">
      <ParticleBg />

      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl gradient-primary blur-lg opacity-70" />
            <div className="relative h-12 w-12 rounded-2xl gradient-primary flex items-center justify-center text-2xl font-black">
              ∑
            </div>
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight gradient-text">MathJoy</div>
            <div className="text-xs text-muted-foreground">Matemática vira jogo</div>
          </div>
        </motion.div>

        <Link to="/profile" onClick={sfx.click}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-strong rounded-full px-4 py-2 flex items-center gap-3"
          >
            <div className="text-2xl">{profile.avatar}</div>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold leading-tight">{profile.name}</div>
              <div className="text-xs text-secondary">Nível {profile.level}</div>
            </div>
          </motion.div>
        </Link>
      </header>

      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-3xl p-6 sm:p-8 mb-6 relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-primary/30 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row items-center gap-6">
          <Mascot mood="happy" size={120} />
          <div className="flex-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-semibold mb-2">
              <Sparkles className="h-3 w-3" /> Desafio do dia disponível
            </div>
            <h1 className="text-3xl sm:text-4xl font-black leading-tight text-balance">
              Pronto para mais um <span className="gradient-text">recorde</span>?
            </h1>
            <p className="text-muted-foreground mt-2">
              Você precisa de <span className="text-secondary font-bold">{needed - (profile.xp % needed)} XP</span> para o próximo nível.
            </p>

            {/* XP bar */}
            <div className="mt-4 h-3 rounded-full bg-muted overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full gradient-primary relative"
              >
                <div className="absolute inset-0 animate-shimmer" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Stat icon={Zap} label="XP total" value={profile.xp} color="bg-primary" />
        <Stat icon={Flame} label="Sequência" value={`${profile.streak} dias`} color="bg-orange-500" />
        <Stat icon={Heart} label="Vidas" value={profile.lives} color="bg-rose-500" />
        <Stat icon={Trophy} label="Recorde" value={profile.bestScore} color="bg-secondary" />
      </div>

      {/* Play CTA */}
      <Link to="/play" onClick={sfx.click}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full gradient-primary rounded-2xl p-5 font-bold text-lg flex items-center justify-center gap-3 glow-blue mb-8 text-primary-foreground"
        >
          <Play className="h-6 w-6 fill-current" /> Jogar agora
        </motion.button>
      </Link>

      {/* Achievements preview */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Medal className="h-5 w-5 text-secondary" /> Conquistas
          </h2>
          <span className="text-xs text-muted-foreground">{profile.medals.length} de 12</span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {["🥇", "🥈", "🥉", "🎯", "⚡", "🧠", "🔥", "💎", "🚀", "👑", "🌟", "🦄"].map((emoji, i) => {
            const unlocked = i < profile.medals.length || i < 2;
            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1, rotate: 8 }}
                className={`aspect-square rounded-2xl flex items-center justify-center text-2xl glass ${
                  unlocked ? "glow-green" : "opacity-30 grayscale"
                }`}
              >
                {emoji}
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
