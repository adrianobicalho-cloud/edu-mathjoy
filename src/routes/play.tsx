import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ParticleBg } from "@/components/ParticleBg";
import { ArrowLeft, Brain, Calculator, BookOpen } from "lucide-react";
import { sfx, type Mode } from "@/lib/game";

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      { title: "Modos de jogo — MathJoy" },
      { name: "description", content: "Escolha entre lógica, 4 operações e interpretação de enunciados." },
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
  return (
    <div className="relative min-h-screen px-4 py-6 sm:px-6 lg:px-10 max-w-5xl mx-auto">
      <ParticleBg />

      <Link to="/" onClick={sfx.click}>
        <motion.div whileHover={{ x: -4 }} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </motion.div>
      </Link>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-5xl font-black mb-2 text-balance"
      >
        Escolha seu <span className="gradient-text">modo</span>
      </motion.h1>
      <p className="text-muted-foreground mb-8">Cada modo entrega XP, medalhas e novos desafios.</p>

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
            className="relative text-left glass-strong rounded-3xl p-6 overflow-hidden group"
          >
            <div className={`absolute -top-20 -right-16 w-56 h-56 rounded-full bg-gradient-to-br ${m.color} opacity-30 blur-3xl group-hover:opacity-60 transition-opacity`} />
            <div className="relative">
              <div className="text-5xl mb-4 animate-float">{m.emoji}</div>
              <h3 className="text-xl font-bold mb-1">{m.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{m.desc}</p>
              <div className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${m.color} bg-clip-text text-transparent`}>
                <m.icon className="h-4 w-4 text-foreground" /> Iniciar
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
