import {
  AnimatePresence,
  motion,
} from "motion/react";

import {
  Moon,
  Sun,
} from "lucide-react";

import {
  useTheme,
} from "../../hooks/useTheme";

function ThemeToggle() {
  const {
    theme,
    toggleTheme,
  } = useTheme();

  const isDark =
    theme === "dark";

  return (
    <motion.button
      type="button"
      onClick={
        toggleTheme
      }
      whileTap={{
        scale: 0.9,
      }}
      aria-label={
        isDark
          ? "Activar modo claro"
          : "Activar modo oscuro"
      }
      title={
        isDark
          ? "Modo claro"
          : "Modo oscuro"
      }
      className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-brand-700 dark:hover:bg-slate-800 dark:hover:text-brand-400"
    >
      <AnimatePresence
        mode="wait"
        initial={false}
      >
        {isDark ? (
          <motion.div
            key="sun"
            initial={{
              opacity: 0,
              rotate: -90,
              scale: 0.6,
            }}
            animate={{
              opacity: 1,
              rotate: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              rotate: 90,
              scale: 0.6,
            }}
            transition={{
              duration: 0.2,
            }}
          >
            <Sun
              size={18}
            />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{
              opacity: 0,
              rotate: 90,
              scale: 0.6,
            }}
            animate={{
              opacity: 1,
              rotate: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              rotate: -90,
              scale: 0.6,
            }}
            transition={{
              duration: 0.2,
            }}
          >
            <Moon
              size={18}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default ThemeToggle;