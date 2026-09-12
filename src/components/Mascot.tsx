import { motion } from "framer-motion";

export type MascotMood = "happy" | "thinking" | "celebrate" | "sad" | "determined" | "surprised";

interface MascotProps {
  mood?: MascotMood;
  size?: number;
  showAntenna?: boolean;
  isSpeaking?: boolean;
}

export function Mascot({
  mood = "happy",
  size = 96,
  showAntenna = true,
  isSpeaking = false,
}: MascotProps) {
  // Visor eye shapes based on mood
  const renderEyes = () => {
    switch (mood) {
      case "celebrate":
        return (
          <div className="flex items-center justify-center gap-2">
            <motion.span
              animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-amber-300 font-black"
            >
              ★
            </motion.span>
            <motion.span
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-amber-300 font-black"
            >
              ★
            </motion.span>
          </div>
        );
      case "surprised":
        return (
          <div className="flex items-center justify-center gap-3">
            <span className="h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_8px_#67e8f9]" />
            <span className="h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_8px_#67e8f9]" />
          </div>
        );
      case "determined":
        return (
          <div className="flex items-center justify-center gap-3">
            <span className="h-1.5 w-3.5 bg-emerald-400 rounded-full rotate-12 shadow-[0_0_8px_#34d399]" />
            <span className="h-1.5 w-3.5 bg-emerald-400 rounded-full -rotate-12 shadow-[0_0_8px_#34d399]" />
          </div>
        );
      case "thinking":
        return (
          <div className="flex items-center justify-center gap-3">
            <motion.span
              animate={{ y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="h-2 w-2.5 bg-cyan-300 rounded-full shadow-[0_0_8px_#67e8f9]"
            />
            <motion.span
              animate={{ scaleY: [1, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
              className="h-2 w-2.5 bg-cyan-300 rounded-full shadow-[0_0_8px_#67e8f9]"
            />
          </div>
        );
      case "sad":
        return (
          <div className="flex items-center justify-center gap-3">
            <span className="h-2 w-2.5 bg-rose-400 rounded-t-full shadow-[0_0_8px_#f43f5e]" />
            <span className="h-2 w-2.5 bg-rose-400 rounded-t-full shadow-[0_0_8px_#f43f5e]" />
          </div>
        );
      case "happy":
      default:
        return (
          <div className="flex items-center justify-center gap-3">
            <motion.div
              animate={{ scaleY: [1, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 3.5, repeatDelay: 1 }}
              className="h-2.5 w-3 rounded-full bg-emerald-300 shadow-[0_0_10px_#6ee7b7]"
            />
            <motion.div
              animate={{ scaleY: [1, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 3.5, repeatDelay: 1 }}
              className="h-2.5 w-3 rounded-full bg-emerald-300 shadow-[0_0_10px_#6ee7b7]"
            />
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{
        scale: 1,
        rotate: mood === "celebrate" ? [0, -6, 6, -3, 3, 0] : 0,
      }}
      transition={{
        scale: { type: "spring", stiffness: 220, damping: 14 },
        rotate: { duration: 0.8, ease: "easeInOut" },
      }}
      className="relative flex flex-col items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      {/* Dynamic glow behind Joy */}
      <div
        className={`absolute inset-0 rounded-full blur-2xl opacity-60 transition-colors duration-500 ${
          mood === "celebrate"
            ? "bg-amber-400/50"
            : mood === "determined"
            ? "bg-emerald-400/50"
            : mood === "sad"
            ? "bg-rose-500/30"
            : "gradient-primary"
        }`}
      />

      {/* Floating animation wrapper */}
      <motion.div
        animate={{
          y: [0, -6, 0],
          rotate: mood === "thinking" ? [-1, 2, -1] : 0,
        }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex flex-col items-center justify-center w-full h-full"
      >
        {/* Antenna with mathematical crystal */}
        {showAntenna && (
          <div className="relative flex flex-col items-center -mb-1 z-10">
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                boxShadow: [
                  "0 0 8px #34d399",
                  "0 0 16px #67e8f9",
                  "0 0 8px #34d399",
                ],
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="h-3.5 w-3.5 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-300 flex items-center justify-center shadow-lg"
            >
              <span className="text-[8px] font-black text-slate-900 leading-none">
                {mood === "celebrate" ? "★" : "∞"}
              </span>
            </motion.div>
            <div className="w-1 h-3 bg-slate-600 rounded-full" />
          </div>
        )}

        {/* Head chassis */}
        <div
          className="relative rounded-3xl bg-gradient-to-b from-slate-800/90 via-slate-900/90 to-blue-950/90 p-1.5 border border-cyan-400/30 shadow-2xl flex items-center justify-center backdrop-blur-md"
          style={{
            width: size * 0.78,
            height: size * 0.68,
          }}
        >
          {/* Ear audio sensors */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-5 rounded-l-md bg-gradient-to-b from-cyan-500 to-blue-600 shadow-[0_0_8px_#38bdf8]" />
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-5 rounded-r-md bg-gradient-to-b from-cyan-500 to-blue-600 shadow-[0_0_8px_#38bdf8]" />

          {/* Dark Glass Visor */}
          <div className="w-full h-full rounded-2xl bg-black/80 border border-cyan-500/20 flex flex-col items-center justify-center relative overflow-hidden px-2">
            {/* Scanline reflection */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none" />

            {/* Visor Eyes */}
            <div className="z-10">{renderEyes()}</div>

            {/* Mouth / Audio waveform */}
            <div className="mt-1.5 flex items-center justify-center gap-0.5 h-2">
              {isSpeaking ? (
                <div className="flex items-center gap-0.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ["2px", "8px", "3px"] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.35,
                        delay: i * 0.08,
                      }}
                      className="w-1 bg-emerald-400 rounded-full"
                    />
                  ))}
                </div>
              ) : mood === "happy" || mood === "celebrate" ? (
                <motion.div
                  animate={mood === "celebrate" ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-3.5 h-1.5 border-b-2 border-emerald-400 rounded-b-full shadow-[0_0_6px_#34d399]"
                />
              ) : mood === "sad" ? (
                <div className="w-3.5 h-1.5 border-t-2 border-rose-400 rounded-t-full shadow-[0_0_6px_#f43f5e]" />
              ) : mood === "thinking" ? (
                <div className="w-2 h-0.5 bg-cyan-300 rounded-full" />
              ) : (
                <div className="w-2.5 h-0.5 bg-emerald-300 rounded-full" />
              )}
            </div>
          </div>
        </div>

        {/* Small collar chassis with MathJoy badge */}
        <div
          className="flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 -mt-1 px-2.5 py-0.5 shadow-md z-10"
          style={{ fontSize: Math.max(9, size * 0.1) }}
        >
          <span className="font-black tracking-widest text-slate-950">JOY</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
