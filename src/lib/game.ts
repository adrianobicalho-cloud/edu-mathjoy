export type Operation = "+" | "-" | "×" | "÷";
export type Mode = "operations" | "logic" | "context";

export interface Question {
  prompt: string;
  options: number[];
  answer: number;
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildOptions(answer: number): number[] {
  const set = new Set<number>([answer]);
  while (set.size < 4) {
    const delta = rand(-9, 9) || 1;
    const candidate = answer + delta;
    if (candidate >= 0) set.add(candidate);
  }
  return [...set].sort(() => Math.random() - 0.5);
}

export function generateOperationsQuestion(level: number): Question {
  const ops: Operation[] = ["+", "-", "×", "÷"];
  const op = ops[rand(0, Math.min(3, level))];
  let a = rand(2, 10 + level * 4);
  let b = rand(2, 10 + level * 2);
  let answer = 0;
  let prompt = "";
  switch (op) {
    case "+": answer = a + b; prompt = `${a} + ${b}`; break;
    case "-": if (b > a) [a, b] = [b, a]; answer = a - b; prompt = `${a} − ${b}`; break;
    case "×": a = rand(2, 9 + level); b = rand(2, 9); answer = a * b; prompt = `${a} × ${b}`; break;
    case "÷":
      b = rand(2, 9);
      answer = rand(2, 9 + level);
      a = b * answer;
      prompt = `${a} ÷ ${b}`;
      break;
  }
  return { prompt, answer, options: buildOptions(answer) };
}

function sequencePuzzle(level: number): Question {
  const start = rand(1, 10);
  const step = rand(2, 4 + level);
  const seq = [start, start + step, start + step * 2, start + step * 3];
  const answer = start + step * 4;
  return { prompt: `${seq.join(", ")}, ?`, answer, options: buildOptions(answer) };
}

function symbolPuzzle(level: number): Question {
  // 3 unknowns: △ □ ○ — produce three clues then ask for sum of all three
  const tri = rand(2, 6 + level);
  const sq = rand(2, 8 + level);
  const ci = rand(1, 5 + level);
  const clues = [
    `△ + △ + △ = ${tri * 3}`,
    `△ + □ + □ = ${tri + sq * 2}`,
    `□ − ○ = ${sq - ci}`,
  ];
  const answer = tri + sq + ci;
  return {
    prompt: `${clues.join("    ")}\n△ + □ + ○ = ?`,
    answer,
    options: buildOptions(answer),
  };
}

function oddOneOutPuzzle(_level: number): Question {
  // Find the number that doesn't fit a multiplication table
  const base = rand(3, 9);
  const multiples = [base * 2, base * 3, base * 4, base * 5];
  const odd = base * rand(2, 5) + (rand(0, 1) ? 1 : -1);
  const idx = rand(0, 3);
  multiples[idx] = odd;
  return {
    prompt: `Qual número NÃO é múltiplo de ${base}?\n${multiples.join(", ")}`,
    answer: odd,
    options: multiples.slice().sort(() => Math.random() - 0.5),
  };
}

const logicGenerators = [sequencePuzzle, symbolPuzzle, symbolPuzzle, oddOneOutPuzzle];

export function generateLogicQuestion(level: number): Question {
  return logicGenerators[rand(0, logicGenerators.length - 1)](level);
}

const contextTemplates = [
  (l: number) => {
    const apples = rand(3, 8 + l);
    const eaten = rand(1, apples - 1);
    return {
      prompt: `Ana tinha ${apples} maçãs e comeu ${eaten}. Quantas sobraram?`,
      answer: apples - eaten,
    };
  },
  (l: number) => {
    const price = rand(3, 12 + l);
    const qty = rand(2, 6);
    return {
      prompt: `Um livro custa R$ ${price}. Quanto custam ${qty} livros?`,
      answer: price * qty,
    };
  },
  (l: number) => {
    const total = rand(10, 20 + l * 2);
    const groups = rand(2, 5);
    return {
      prompt: `${total * groups} alunos serão divididos em ${groups} times. Quantos por time?`,
      answer: total,
    };
  },
];

export function generateContextQuestion(level: number): Question {
  const t = contextTemplates[rand(0, contextTemplates.length - 1)](level);
  return { prompt: t.prompt, answer: t.answer, options: buildOptions(t.answer) };
}

export function generateQuestion(mode: Mode, level: number): Question {
  if (mode === "logic") return generateLogicQuestion(level);
  if (mode === "context") return generateContextQuestion(level);
  return generateOperationsQuestion(level);
}

/* Sound effects via WebAudio (no asset deps) */
let ctx: AudioContext | null = null;
function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return ctx;
}
export function playTone(freq: number, duration = 0.15, type: OscillatorType = "sine", gain = 0.15) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(g).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}
export const sfx = {
  click: () => playTone(600, 0.05, "triangle", 0.08),
  correct: () => { playTone(660, 0.1, "sine"); setTimeout(() => playTone(880, 0.15, "sine"), 80); },
  wrong: () => playTone(180, 0.25, "sawtooth", 0.12),
  levelUp: () => {
    [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => playTone(f, 0.18, "triangle"), i * 90));
  },
};

/* Local persistence */
const KEY = "mathjoy_profile_v1";
export interface Profile {
  name: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  lives: number;
  bestScore: number;
  medals: string[];
  lastPlayed: string;
}
export const DEFAULT_PROFILE: Profile = {
  name: "Jogador",
  avatar: "🦊",
  xp: 0,
  level: 1,
  streak: 1,
  lives: 5,
  bestScore: 0,
  medals: [],
  lastPlayed: new Date().toISOString(),
};
export function loadProfile(): Profile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}
export function saveProfile(p: Profile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
}
export function xpForLevel(level: number) {
  return level * 100;
}
