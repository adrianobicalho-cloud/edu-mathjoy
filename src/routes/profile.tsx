import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ParticleBg } from "@/components/ParticleBg";
import { Mascot } from "@/components/Mascot";
import { loadProfile, saveProfile, type Profile, sfx, xpForLevel } from "@/lib/game";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Perfil — MathJoy" }] }),
  component: ProfilePage,
});

const AVATARS = ["🦊", "🐯", "🦁", "🐼", "🐸", "🦄", "🐙", "🐵", "🦉", "🐺"];

function ProfilePage() {
  const [p, setP] = useState<Profile | null>(null);
  useEffect(() => setP(loadProfile()), []);
  if (!p) return null;

  const update = (patch: Partial<Profile>) => {
    const next = { ...p, ...patch };
    setP(next);
    saveProfile(next);
  };
  const needed = xpForLevel(p.level);
  const progress = Math.min(100, (p.xp % needed) / needed * 100);

  return (
    <div className="relative min-h-screen px-4 py-6 sm:px-6 max-w-3xl mx-auto">
      <ParticleBg />
      <Link to="/" onClick={sfx.click}>
        <motion.div whileHover={{ x: -4 }} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </motion.div>
      </Link>

      <div className="glass-strong rounded-3xl p-8 text-center mb-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative">
          <Mascot mood="happy" size={120} />
          <input
            value={p.name}
            onChange={(e) => update({ name: e.target.value })}
            className="mt-4 bg-transparent text-center text-2xl font-black focus:outline-none w-full"
          />
          <div className="text-sm text-secondary font-semibold">Nível {p.level} · {p.xp} XP</div>

          <div className="mt-4 h-3 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full gradient-primary"
            />
          </div>
        </div>
      </div>

      <h3 className="font-bold mb-3">Escolha seu avatar</h3>
      <div className="grid grid-cols-5 gap-3">
        {AVATARS.map((a) => (
          <motion.button
            key={a}
            whileHover={{ scale: 1.15, rotate: 8 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => { sfx.click(); update({ avatar: a }); }}
            className={`aspect-square rounded-2xl text-3xl glass flex items-center justify-center ${
              p.avatar === a ? "ring-2 ring-secondary glow-green" : ""
            }`}
          >
            {a}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
