import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ParticleBg } from "@/components/ParticleBg";
import { Mascot, type MascotMood } from "@/components/Mascot";
import {
  loadProfile,
  saveProfile,
  type Profile,
  sfx,
  xpForLevel,
  DEFAULT_PROFILE,
} from "@/lib/game";
import {
  loadStoryProgress,
  RELICS,
  STORY_CHAPTERS,
  type StoryProgress,
} from "@/lib/story";
import { ArrowLeft, Sparkles, BookOpen, Check } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Perfil e Personagens — MathJoy" }] }),
  component: ProfilePage,
});

interface CharacterChoice {
  id: string;
  name: string;
  role: string;
  type: "mascot" | "emoji";
  mood?: MascotMood;
  emoji?: string;
  color: string;
}

const CHARACTERS: CharacterChoice[] = [
  {
    id: "joy-happy",
    name: "Joy Guardião",
    role: "Líder da Expedição",
    type: "mascot",
    mood: "happy",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "joy-determined",
    name: "Joy Explorador",
    role: "Navegador de Fótons",
    type: "mascot",
    mood: "determined",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "joy-celebrate",
    name: "Joy Campeão",
    role: "Mestre dos Números",
    type: "mascot",
    mood: "celebrate",
    color: "from-amber-400 to-orange-500",
  },
  {
    id: "joy-thinking",
    name: "Joy Cientista",
    role: "Estrategista Lógico",
    type: "mascot",
    mood: "thinking",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "🦊",
    name: "Raposa Cósmica",
    role: "Agilidade Mental",
    type: "emoji",
    emoji: "🦊",
    color: "from-orange-500 to-amber-600",
  },
  {
    id: "🐯",
    name: "Tigre Solar",
    role: "Força no Cálculo",
    type: "emoji",
    emoji: "🐯",
    color: "from-amber-500 to-yellow-600",
  },
  {
    id: "🦁",
    name: "Leão Astral",
    role: "Comandante de Frota",
    type: "emoji",
    emoji: "🦁",
    color: "from-yellow-500 to-amber-600",
  },
  {
    id: "🐼",
    name: "Panda Quântico",
    role: "Harmonia dos Dados",
    type: "emoji",
    emoji: "🐼",
    color: "from-slate-400 to-slate-600",
  },
  {
    id: "🦉",
    name: "Coruja Sábia",
    role: "Teoremas Ancestrais",
    type: "emoji",
    emoji: "🦉",
    color: "from-indigo-500 to-purple-600",
  },
  {
    id: "🐺",
    name: "Lobo Estelar",
    role: "Foco em Desafios",
    type: "emoji",
    emoji: "🐺",
    color: "from-cyan-600 to-blue-700",
  },
  {
    id: "🦄",
    name: "Unicórnio Mágico",
    role: "Criatividade Pura",
    type: "emoji",
    emoji: "🦄",
    color: "from-fuchsia-500 to-pink-600",
  },
  {
    id: "🐲",
    name: "Dragão Matemático",
    role: "Guardião da Singularidade",
    type: "emoji",
    emoji: "🐲",
    color: "from-emerald-500 to-cyan-600",
  },
];

function ProfilePage() {
  const [p, setP] = useState<Profile>(DEFAULT_PROFILE);
  const [story, setStory] = useState<StoryProgress>(() => loadStoryProgress());

  useEffect(() => {
    setP(loadProfile());
    setStory(loadStoryProgress());
  }, []);

  const update = (patch: Partial<Profile>) => {
    const next = { ...p, ...patch };
    setP(next);
    saveProfile(next);
  };

  const needed = xpForLevel(p.level);
  const progress = Math.min(100, ((p.xp % needed) / needed) * 100);

  // Check current selected character details
  const selectedChar = CHARACTERS.find((c) => c.id === p.avatar) || CHARACTERS[0];
  const mascotMood: MascotMood = selectedChar.mood || "happy";

  return (
    <div className="relative min-h-screen px-4 py-6 sm:px-6 max-w-5xl mx-auto pb-20">
      <ParticleBg />

      <Link to="/" onClick={sfx.click}>
        <motion.div
          whileHover={{ x: -4 }}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </motion.div>
      </Link>

      {/* Main Profile Showcase Card */}
      <div className="glass-strong rounded-3xl p-6 sm:p-10 text-center mb-10 relative overflow-hidden border border-cyan-400/30 shadow-2xl">
        <div className="absolute -top-32 -right-24 w-80 h-80 rounded-full bg-primary/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-24 w-80 h-80 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col items-center">
          {/* Main Large Character Preview */}
          <div className="relative my-2">
            {selectedChar.type === "mascot" ? (
              <Mascot mood={mascotMood} size={150} />
            ) : (
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full gradient-primary blur-2xl opacity-60 animate-pulse-glow" />
                <div className="relative h-36 w-36 rounded-3xl glass-strong border-2 border-cyan-400/50 flex items-center justify-center text-7xl shadow-[0_0_35px_rgba(56,189,248,0.4)] animate-float">
                  {selectedChar.emoji}
                </div>
              </div>
            )}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900/90 text-cyan-300 border border-cyan-400/40 text-[11px] font-black px-3 py-0.5 rounded-full whitespace-nowrap shadow-md">
              {selectedChar.name}
            </div>
          </div>

          <input
            value={p.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="Nome do Piloto"
            className="mt-4 bg-transparent text-center text-2xl sm:text-3xl font-black focus:outline-none w-full max-w-sm border-b border-transparent focus:border-cyan-400/50 transition-colors"
          />
          <div className="text-sm text-cyan-300 font-semibold mt-1">
            Nível {p.level} · {p.xp} XP Acumulados
          </div>

          <div className="mt-4 w-full max-w-md h-3 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
              className="h-full gradient-primary"
            />
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Faltam {needed - (p.xp % needed)} XP para o próximo nível de Guardião
          </div>
        </div>
      </div>

      {/* CHARACTER SELECTION WITH PROMINENT LARGE IMAGES */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-black text-xl sm:text-2xl tracking-tight flex items-center gap-2">
              <span>🎭</span> Escolha seu Personagem e Copiloto
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Toque no personagem desejado para personalizar sua aparência na aventura.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 glass px-3 py-1 rounded-full text-xs font-bold text-cyan-300 border border-cyan-400/30">
            <Sparkles className="h-3.5 w-3.5" /> {CHARACTERS.length} opções
          </div>
        </div>

        {/* Large visual cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
          {CHARACTERS.map((c) => {
            const isSelected = p.avatar === c.id;

            return (
              <motion.button
                key={c.id}
                whileHover={{ y: -6, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  sfx.click();
                  update({ avatar: c.id });
                }}
                className={`relative flex flex-col items-center justify-between p-5 rounded-3xl glass-strong border transition-all text-center overflow-hidden group ${
                  isSelected
                    ? "ring-4 ring-cyan-400 border-cyan-300 bg-cyan-950/40 shadow-[0_0_30px_rgba(56,189,248,0.5)] glow-blue"
                    : "border-white/10 hover:border-cyan-400/40 hover:bg-white/5"
                }`}
              >
                {/* Dynamic background aura */}
                <div
                  className={`absolute -top-12 -right-12 w-28 h-28 rounded-full bg-gradient-to-br ${c.color} opacity-15 blur-2xl group-hover:opacity-40 transition-opacity`}
                />

                {/* Selected Checkmark Badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-md">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                )}

                {/* Big Character Visual (Mascot or Large Emoji) */}
                <div className="h-28 w-28 flex items-center justify-center my-1 select-none">
                  {c.type === "mascot" ? (
                    <Mascot mood={c.mood} size={90} />
                  ) : (
                    <motion.span
                      whileHover={{ scale: 1.15, rotate: 8 }}
                      className="text-6xl sm:text-7xl filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] transition-transform inline-block"
                    >
                      {c.emoji}
                    </motion.span>
                  )}
                </div>

                {/* Information text */}
                <div className="w-full mt-2 pt-2 border-t border-white/5">
                  <div className="font-black text-sm sm:text-base text-foreground leading-snug">
                    {c.name}
                  </div>
                  <div className="text-[11px] text-cyan-300/80 font-medium line-clamp-1">
                    {c.role}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Relics Arsenal */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" /> Relíquias Cósmicas
            </h3>
            <p className="text-xs text-muted-foreground">
              Itens lendários recuperados durante os capítulos da história.
            </p>
          </div>
          <span className="text-xs text-muted-foreground font-semibold">
            {story.unlockedRelics.length} de {Object.keys(RELICS).length} descobertas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.values(RELICS).map((r) => {
            const isUnlocked = story.unlockedRelics.includes(r.id);
            return (
              <div
                key={r.id}
                className={`glass rounded-2xl p-4 border transition-all ${
                  isUnlocked
                    ? "border-amber-400/40 bg-amber-950/15 shadow-lg shadow-amber-500/10"
                    : "border-white/5 opacity-40 grayscale"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-3xl p-2 rounded-xl bg-slate-900 border border-amber-400/30">
                    {r.emoji}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-foreground">
                      {r.name}
                    </div>
                    <div className="text-[10px] text-amber-300 font-semibold">
                      {isUnlocked ? "⚡ Desbloqueado" : `Capítulo ${r.unlockedAtChapter}`}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {r.desc}
                </p>
                {isUnlocked && (
                  <div className="mt-2 text-[11px] text-emerald-300 font-medium">
                    {r.power}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Joy's Captain Logbook */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-cyan-400" /> Diário de Bordo da Axioma
            </h3>
            <p className="text-xs text-muted-foreground">
              Memórias dos mundos matemáticos libertados da Entropia.
            </p>
          </div>
          <span className="text-xs text-muted-foreground font-semibold">
            {story.completedChapters.length} de {STORY_CHAPTERS.length} capítulos
          </span>
        </div>

        <div className="space-y-4">
          {STORY_CHAPTERS.map((ch) => {
            const isCompleted = story.completedChapters.includes(ch.id);
            const isUnlocked = ch.id <= story.unlockedChapter;

            return (
              <div
                key={ch.id}
                className={`glass rounded-2xl p-5 border transition-all ${
                  isCompleted
                    ? "border-cyan-400/30 bg-cyan-950/10"
                    : isUnlocked
                    ? "border-white/10"
                    : "border-white/5 opacity-40"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                      Capítulo {ch.id}
                    </span>
                    <h4 className="font-bold text-sm sm:text-base">
                      {ch.realmName}
                    </h4>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {isCompleted ? "✅ Concluído" : isUnlocked ? "⏳ Em andamento" : "🔒 Bloqueado"}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {isUnlocked
                    ? ch.codexLore
                    : "Conclua os capítulos anteriores para descriptografar os dados deste setor cósmico."}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
