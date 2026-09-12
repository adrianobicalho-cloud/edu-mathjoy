import { type Mode } from "./game";

export interface DialogLine {
  speaker: "Joy" | "Sigma-7" | "Voz Cósmica";
  mood: "happy" | "thinking" | "celebrate" | "sad" | "determined" | "surprised";
  text: string;
}

export interface Relic {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  power: string;
  unlockedAtChapter: number;
}

export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  realmName: string;
  realmTheme: string;
  mode: Mode;
  targetQuestions: number;
  relic: Relic;
  introDialog: DialogLine[];
  victoryDialog: DialogLine[];
  codexLore: string;
  color: string;
  bgGradient: string;
}

export const RELICS: Record<string, Relic> = {
  compass: {
    id: "compass",
    name: "Bússola do Infinito",
    emoji: "🧭",
    desc: "Um astrolábio quântico que aponta para as verdades matemáticas essenciais.",
    power: "+15% de XP em todas as missões de cálculo.",
    unlockedAtChapter: 1,
  },
  prism: {
    id: "prism",
    name: "Prisma da Razão Áurea",
    emoji: "💎",
    desc: "Fraciona feixes de dados caóticos em sequências harmoniosas.",
    power: "Revela pistas em quebra-cabeças lógicos.",
    unlockedAtChapter: 2,
  },
  chronometer: {
    id: "chronometer",
    name: "Cronomotor de Arquimedes",
    emoji: "⚙️",
    desc: "Engrenagens forjadas em bronze estelar que equilibram múltiplos e divisões.",
    power: "Tempo bônus de 5 segundos em desafios de velocidade.",
    unlockedAtChapter: 3,
  },
  scroll: {
    id: "scroll",
    name: "Tomo dos Horizontes Vivos",
    emoji: "📜",
    desc: "Registros históricos de como a humanidade transformou problemas em soluções.",
    power: "Multiplicador de combo ampliado.",
    unlockedAtChapter: 4,
  },
  singularityOrb: {
    id: "singularityOrb",
    name: "Orbe da Grande Equação",
    emoji: "🌌",
    desc: "O núcleo supremo restaurado, unificando geometria, álgebra e harmonia.",
    power: "Aura lendária de Guardião Cósmico da Matemática.",
    unlockedAtChapter: 5,
  },
};

export const STORY_CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: "Capítulo 1: O Despertar Estelar",
    subtitle: "Restauração das Linhas de Luz",
    realmName: "Vale dos Algarismos Luminosos",
    realmTheme: "Nebulosa Primordial",
    mode: "operations",
    targetQuestions: 5,
    relic: RELICS.compass,
    color: "from-blue-500 to-cyan-400",
    bgGradient: "radial-gradient(ellipse at top, #1e3a8a 0%, #030712 70%)",
    introDialog: [
      {
        speaker: "Sigma-7",
        mood: "surprised",
        text: "Alerta nos sistemas da nave Axioma! A Névoa da Entropia apagou os feixes de soma e subtração no Vale dos Algarismos!",
      },
      {
        speaker: "Joy",
        mood: "determined",
        text: "Fique tranquilo, Sigma! Nenhuma névoa resiste à clareza do pensamento lógico. Vou recalibrar os cristais de energia um por um!",
      },
      {
        speaker: "Joy",
        mood: "happy",
        text: "Vamos somar coragem e subtrair as dúvidas. Piloto, assuma os comandos matemáticos comigo!",
      },
    ],
    victoryDialog: [
      {
        speaker: "Sigma-7",
        mood: "celebrate",
        text: "Incrível! Os canais de luz do Vale voltaram a pulsar em perfeita harmonia! A energia da nave subiu para 100%!",
      },
      {
        speaker: "Joy",
        mood: "celebrate",
        text: "Veja aquilo brilhando no altar de cristal... É a lendária Bússola do Infinito! O primeiro pilar do CosmoJoy foi reconquistado!",
      },
      {
        speaker: "Joy",
        mood: "thinking",
        text: "Mas os sensores mostram que o Labirinto dos Padrões além do cinturão de asteroides ainda está nas sombras. Nossa jornada apenas começou...",
      },
    ],
    codexLore:
      "O Vale dos Algarismos Luminosos é o berço do CosmoJoy. Aqui, cada estrela nasce da união harmoniosa de dois números. Quando a Entropia atacou, as equações se romperam e o céu escureceu. A coragem de Joy reacendeu a primeira constelação.",
  },
  {
    id: 2,
    title: "Capítulo 2: O Labirinto dos Padrões",
    subtitle: "Os Enigmas dos Antigos Astrônomos",
    realmName: "Dunas de Areia Quântica",
    realmTheme: "Geometria Sagrada",
    mode: "logic",
    targetQuestions: 5,
    relic: RELICS.prism,
    color: "from-emerald-500 to-teal-300",
    bgGradient: "radial-gradient(ellipse at top, #064e3b 0%, #030712 70%)",
    introDialog: [
      {
        speaker: "Sigma-7",
        mood: "thinking",
        text: "Aproximando-se das Dunas Quânticas. Os sensores estão confusos... o relevo muda a cada segundo em sequências numéricas!",
      },
      {
        speaker: "Joy",
        mood: "thinking",
        text: "Isto não é aleatório, Sigma. É uma linguagem antiga! Toda sequência possui um segredo oculto esperando para ser desvendado.",
      },
      {
        speaker: "Joy",
        mood: "determined",
        text: "Observe os passos da sequência, encontre o padrão que governa a transformação e a passagem se abrirá!",
      },
    ],
    victoryDialog: [
      {
        speaker: "Joy",
        mood: "celebrate",
        text: "Fantástico! O labirinto se organizou em uma pirâmide perfeita de cristal esmeralda!",
      },
      {
        speaker: "Sigma-7",
        mood: "celebrate",
        text: "Detectando emissão de fótons puros! O Prisma da Razão Áurea emergiu do coração das dunas!",
      },
      {
        speaker: "Joy",
        mood: "happy",
        text: "Com este prisma, conseguimos enxergar as proporções ocultas do universo. Agora rumo à Metrópole dos Mecanismos!",
      },
    ],
    codexLore:
      "As Dunas Quânticas guardam os templos dos primeiros sábios que mapearam as órbitas dos planetas. Seus quebra-cabeças não foram feitos para deter viajantes, mas para ensinar que na natureza tudo segue um ritmo e uma harmonia lógica.",
  },
  {
    id: 3,
    title: "Capítulo 3: A Metrópole das Mil Engrenagens",
    subtitle: "A Sincronia dos Múltiplos e Divisores",
    realmName: "Cidade dos Autômatos Horológicos",
    realmTheme: "Engenharia de Fótons",
    mode: "operations",
    targetQuestions: 6,
    relic: RELICS.chronometer,
    color: "from-amber-500 to-yellow-300",
    bgGradient: "radial-gradient(ellipse at top, #78350f 0%, #030712 70%)",
    introDialog: [
      {
        speaker: "Sigma-7",
        mood: "surprised",
        text: "Joy! As engrenagens gigantes da Metrópole estão parando! Sem multiplicação para acelerar e divisão para distribuir força, a cidade vai congelar no tempo!",
      },
      {
        speaker: "Joy",
        mood: "determined",
        text: "Multiplicar é multiplicar nosso potencial, e dividir é compartilhar o que temos! Vamos sincronizar cada rotor com precisão cirúrgica!",
      },
      {
        speaker: "Joy",
        mood: "happy",
        text: "Tabuadas prontas, mente rápida! Que as rotações comecem!",
      },
    ],
    victoryDialog: [
      {
        speaker: "Sigma-7",
        mood: "celebrate",
        text: "Rotores a 10.000 RPM! As luzes de neon douradas estão voltando a acender por toda a metrópole!",
      },
      {
        speaker: "Joy",
        mood: "celebrate",
        text: "Os autômatos estão aplaudindo das sacadas! E olha o que eles nos entregaram em gratidão: o lendário Cronomotor de Arquimedes!",
      },
      {
        speaker: "Joy",
        mood: "thinking",
        text: "O tempo agora corre a nosso favor. Próxima parada: as ilhas flutuantes onde os viajantes precisam de nós!",
      },
    ],
    codexLore:
      "Construída sobre gigantescos giroscópios magnéticos, a Metrópole é a prova viva de que a matemática move o mundo material. Suas pontes levadiças operam com frações e seus relógios medem não apenas minutos, mas o ritmo do pensamento humano.",
  },
  {
    id: 4,
    title: "Capítulo 4: O Arquipélago das Histórias Vivas",
    subtitle: "A Sabedoria dos Problemas Reais",
    realmName: "Ilhas Nebulosas de Caelum",
    realmTheme: "Comunidade e Estratégia",
    mode: "context",
    targetQuestions: 6,
    relic: RELICS.scroll,
    color: "from-violet-500 to-fuchsia-400",
    bgGradient: "radial-gradient(ellipse at top, #4c1d95 0%, #030712 70%)",
    introDialog: [
      {
        speaker: "Sigma-7",
        mood: "thinking",
        text: "Chegamos ao Arquipélago. Aqui não temos números soltos, Joy: os habitantes enfrentam dilemas do cotidiano!",
      },
      {
        speaker: "Joy",
        mood: "happy",
        text: "Essa é a melhor parte da matemática, Sigma! É a ferramenta que usamos para construir casas justas, planejar viagens e dividir recursos com quem precisa.",
      },
      {
        speaker: "Joy",
        mood: "determined",
        text: "Vamos ler cada enunciado com atenção, interpretar os dados e encontrar a melhor solução para cada situação!",
      },
    ],
    victoryDialog: [
      {
        speaker: "Sigma-7",
        mood: "celebrate",
        text: "As rotas comerciais do Arquipélago foram reestabelecidas e todos os vilarejos comemoram com um festival de fogos estelares!",
      },
      {
        speaker: "Joy",
        mood: "celebrate",
        text: "Ganhamos o Tomo dos Horizontes Vivos! Ele contém histórias de superação de gerações que usaram a sabedoria para vencer a ignorância.",
      },
      {
        speaker: "Joy",
        mood: "thinking",
        text: "Agora só resta um portal à nossa frente... O Horizonte de Eventos, onde a Entropia se esconde. Vamos restaurar o equilíbrio definitivo!",
      },
    ],
    codexLore:
      "No Arquipélago de Caelum, aprender matemática é aprender a conviver. Cada problema resolvido representa uma ponte construída entre ilhas, um mercado abastecido e uma família amparada. A interpretação de texto e contexto transforma meros números em sabedoria de vida.",
  },
  {
    id: 5,
    title: "Capítulo 5: O Horizonte da Grande Equação",
    subtitle: "O Confronto Final pela Harmonia Cósmica",
    realmName: "Núcleo da Singularidade Matemática",
    realmTheme: "Triunfo do Pensamento Crítico",
    mode: "logic",
    targetQuestions: 7,
    relic: RELICS.singularityOrb,
    color: "from-rose-500 to-amber-400",
    bgGradient: "radial-gradient(ellipse at top, #881337 0%, #030712 70%)",
    introDialog: [
      {
        speaker: "Voz Cósmica",
        mood: "thinking",
        text: "Bem-vindo ao Núcleo Primordial, Guardião Joy. Diante de ti está o Véu da Incerteza. Apenas mentes afiadas podem recompor o equilíbrio.",
      },
      {
        speaker: "Joy",
        mood: "determined",
        text: "Percorremos um longo caminho! Aprendemos a somar forças, decifrar enigmas, calcular com precisão e compreender as histórias ao nosso redor.",
      },
      {
        speaker: "Joy",
        mood: "celebrate",
        text: "Piloto, este é o momento supremo! Vamos acender a Grande Equação e libertar o CosmoJoy para sempre!",
      },
    ],
    victoryDialog: [
      {
        speaker: "Voz Cósmica",
        mood: "celebrate",
        text: "A harmonia foi restaurada! Os 5 Reinos resplandecem em luz dourada e azul! O CosmoJoy celebra seus novos Guardiões!",
      },
      {
        speaker: "Joy",
        mood: "celebrate",
        text: "CONSEGUIMOS! Veja o Orbe da Grande Equação girando no peito da nave! A matemática não é apenas contas... é a própria canção do universo!",
      },
      {
        speaker: "Sigma-7",
        mood: "happy",
        text: "Relatório final: Você atingiu a maestria suprema. Joy e toda a tripulação têm orgulho de voar ao seu lado!",
      },
    ],
    codexLore:
      "O Horizonte da Grande Equação é onde todo o conhecimento matemático converge. Não se trata de memorização mecânica, mas da celebração do raciocínio crítico, da persistência diante do erro e da alegria indescritível de encontrar uma solução elegante.",
  },
];

/* Story persistence in localStorage */
const STORY_KEY = "mathjoy_story_progress_v1";

export interface StoryProgress {
  unlockedChapter: number;
  completedChapters: number[];
  unlockedRelics: string[];
  readDialogs: string[];
}

export const DEFAULT_STORY_PROGRESS: StoryProgress = {
  unlockedChapter: 1,
  completedChapters: [],
  unlockedRelics: [],
  readDialogs: [],
};

export function loadStoryProgress(): StoryProgress {
  if (typeof window === "undefined") return DEFAULT_STORY_PROGRESS;
  try {
    const raw = localStorage.getItem(STORY_KEY);
    if (!raw) return DEFAULT_STORY_PROGRESS;
    return { ...DEFAULT_STORY_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STORY_PROGRESS;
  }
}

export function saveStoryProgress(sp: StoryProgress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORY_KEY, JSON.stringify(sp));
}

export function completeStoryChapter(chapterId: number): {
  newChapterUnlocked: boolean;
  newRelic: Relic | null;
} {
  const current = loadStoryProgress();
  const chapter = STORY_CHAPTERS.find((c) => c.id === chapterId);
  const nextChapterId = Math.min(STORY_CHAPTERS.length, chapterId + 1);

  const completed = new Set(current.completedChapters);
  completed.add(chapterId);

  const relics = new Set(current.unlockedRelics);
  let newRelic: Relic | null = null;
  if (chapter && !relics.has(chapter.relic.id)) {
    relics.add(chapter.relic.id);
    newRelic = chapter.relic;
  }

  const updated: StoryProgress = {
    ...current,
    completedChapters: Array.from(completed),
    unlockedChapter: Math.max(current.unlockedChapter, nextChapterId),
    unlockedRelics: Array.from(relics),
  };

  saveStoryProgress(updated);
  return {
    newChapterUnlocked: updated.unlockedChapter > current.unlockedChapter,
    newRelic,
  };
}
