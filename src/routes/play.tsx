import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ParticleBg } from "@/components/ParticleBg";
import { Mascot } from "@/components/Mascot";
import { GalaxyMap } from "@/components/GalaxyMap";
import { ArrowLeft, Brain, Calculator, BookOpen, Sparkles, Rocket, Play as PlayIcon } from "lucide-react";
import { sfx, type Mode } from "@/lib/game";
import { loadStoryProgress, STORY_CHAPTERS, type StoryProgress } from "@/lib/story";

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      { title: "Modos de jogo — MathJoy" },
      { name: "description", content: "Jogue o Modo Aventura de Joy ou pratique nas 4 operações, lógica e interpretação." },
    ],
  }),
  component: Play,
});

const modes: {
  id: Mode;
  title: string;
  desc: string;
  icon: any;
  color: string;
  emoji: string;
}[] = [
  {
    id: "logic",
    title: "Desafios de Lógica",
    desc: "Sequências, padrões e quebra-cabeças matemáticos.",
    icon: Brain,
    color: "from-primary to-primary-glow",
    emoji: "🧩",
  },
  {
    id: "operations",
    title: "4 Operações",
    desc: "Soma, subtração, multiplicação e divisão.",
    icon: Calculator,
    color: "from-secondary to-secondary-glow",
    emoji: "➗",
  },
  {
    id: "context",
    title: "Interpretação",
    desc: "Problemas do cotidiano para você resolver.",
    icon: BookOpen,
    color: "from-amber-400 to-orange-500",
    emoji: "📖",
  },
];

function Play() {
  const navigate = useNavigate();
  const [storyProgress, setStoryProgress] = useState<StoryProgress>(() => loadStoryProgress());

  useEffect(() => {
    setStoryProgress(loadStoryProgress());
  }, []);

  const activeChapterId = Math.min(storyProgress.unlockedChapter, STORY_CHAPTERS.length);
  const currentChapter = STORY_CHAPTERS.find((c) => c.id === activeChapterId) ?? STORY_CHAPTERS[0];

  const handleStartStory = (chapterId?: number) => {
    sfx.warpJump();
    navigate({
      to: "/game",
      search: { mode: "story", chapter: chapterId ?? activeChapterId },
    });
  };

  return (
    <div className="relative min-h-screen px-4 py-6 sm:px-6 lg:px-10 max-w-5xl mx-auto pb-16">
      <ParticleBg />

      <Link to="/" onClick={sfx.click}>
        <motion.div
          whileHover={{ x: -4 }}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </motion.div>
      </Link>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-5xl font-black mb-2 text-balance"
      >
        Escolha sua <span className="gradient-text">Missão</span>
      </motion.h1>
      <p className="text-muted-foreground mb-6">
        Siga a história de Joy para salvar o CosmoJoy ou pratique nos modos de treino livre.
      </p>

      {/* STORY MODE HERO CARD */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-3xl p-6 sm:p-8 mb-10 border border-cyan-400/40 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <Mascot mood="determined" size={80} />
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black uppercase tracking-wider mb-2 border border-cyan-400/30">
                <Sparkles className="h-3.5 w-3.5" /> Modo Aventura Principal
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                A Jornada Cósmica de Joy
              </h2>
              <p className="text-sm text-muted-foreground max-w-lg mt-1">
                Destino atual: <strong className="text-foreground">{currentChapter.title}</strong> — {currentChapter.realmName}.
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleStartStory()}
            className="gradient-primary px-7 py-3.5 rounded-2xl font-black text-slate-950 flex items-center gap-2 shadow-xl glow-blue whitespace-nowrap self-stretch md:self-auto justify-center"
          >
            <PlayIcon className="h-4 w-4 fill-current" /> Continuar Expedição
          </motion.button>
        </div>

        {/* Interactive Galaxy Map embedded */}
        <GalaxyMap
          progress={storyProgress}
          activeChapterId={activeChapterId}
          onSelectChapter={(id) => handleStartStory(id)}
        />
      </motion.div>

      {/* FREE PLAY TRAINING MODES */}
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
          <span>🎯</span> Treino Livre
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Pratique habilidades específicas sem limites de fase para subir de nível e ganhar XP extra.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {modes.map((m, i) => (
          <motion.button
            key={m.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              sfx.click();
              navigate({ to: "/game", search: { mode: m.id } });
            }}
            className="relative text-left glass-strong rounded-3xl p-6 overflow-hidden group border border-white/10 hover:border-cyan-400/40"
          >
            <div
              className={`absolute -top-20 -right-16 w-56 h-56 rounded-full bg-gradient-to-br ${m.color} opacity-20 blur-3xl group-hover:opacity-40 transition-opacity`}
            />
            <div className="relative">
              <div className="text-5xl mb-4 animate-float">{m.emoji}</div>
              <h3 className="text-xl font-bold mb-1">{m.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{m.desc}</p>
              <div
                className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${m.color} bg-clip-text text-transparent`}
              >
                <m.icon className="h-4 w-4 text-foreground" /> Iniciar Treino
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
