import {
  AnimatePresence,
  motion,
} from "motion/react";

import {
  AlertTriangle,
  CheckCircle2,
  LoaderCircle,
  X,
} from "lucide-react";

interface ConfirmModalProps {
  open: boolean;

  title: string;

  description: string;

  confirmText: string;

  variant?:
    | "primary"
    | "danger";

  loading?: boolean;

  onConfirm: () => void;

  onClose: () => void;
}

function ConfirmModal({
  open,
  title,
  description,
  confirmText,
  variant = "primary",
  loading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  const isDanger =
    variant === "danger";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={
              loading
                ? undefined
                : onClose
            }
            className="fixed inset-0 z-[90] bg-slate-950/50 backdrop-blur-sm"
          />

          <div className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.94,
                y: 15,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.94,
                y: 15,
              }}
              transition={{
                duration: 0.2,
              }}
              className="pointer-events-auto w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
            >
              <div className="p-6 sm:p-7">
                <div className="flex items-start justify-between gap-5">
                  <div
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
                      isDanger
                        ? "bg-red-50 text-red-600"
                        : "bg-brand-50 text-brand-600"
                    }`}
                  >
                    {isDanger ? (
                      <AlertTriangle
                        size={23}
                      />
                    ) : (
                      <CheckCircle2
                        size={23}
                      />
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={
                      loading
                    }
                    onClick={
                      onClose
                    }
                    className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                  >
                    <X size={18} />
                  </button>
                </div>

                <h2 className="mt-6 text-xl font-black text-slate-950">
                  {title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {description}
                </p>

                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    disabled={
                      loading
                    }
                    onClick={
                      onClose
                    }
                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Volver
                  </button>

                  <motion.button
                    whileTap={{
                      scale: 0.98,
                    }}
                    type="button"
                    disabled={
                      loading
                    }
                    onClick={
                      onConfirm
                    }
                    className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      isDanger
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-brand-600 hover:bg-brand-700"
                    }`}
                  >
                    {loading && (
                      <LoaderCircle
                        size={17}
                        className="animate-spin"
                      />
                    )}

                    {loading
                      ? "Procesando..."
                      : confirmText}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ConfirmModal;