import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Camera,
  CheckCircle2,
  Keyboard,
  LoaderCircle,
  Mail,
  ScanLine,
  StopCircle,
  User,
} from "lucide-react";

import {
  motion,
} from "motion/react";

import {
  Html5Qrcode,
} from "html5-qrcode";

import {
  toast,
} from "sonner";

import axios from "axios";

import {
  checkInTicket,
} from "../../services/ticketService";

import type {
  CheckInResult,
} from "../../types/ticket";

function CheckInPage() {
  const [
    code,
    setCode,
  ] = useState("");

  const [
    processing,
    setProcessing,
  ] = useState(false);

  const [
    scannerActive,
    setScannerActive,
  ] = useState(false);

  const [
    result,
    setResult,
  ] =
    useState<CheckInResult | null>(
      null
    );

  const scannerRef =
    useRef<Html5Qrcode | null>(
      null
    );

  const processingScanRef =
    useRef(false);

  // ============================================================
  // CLEAN CAMERA
  // ============================================================

  useEffect(() => {
    return () => {
      const scanner =
        scannerRef.current;

      if (scanner) {
        scanner
          .stop()
          .catch(
            () => undefined
          );
      }
    };
  }, []);

  // ============================================================
  // CHECK-IN
  // ============================================================

  const processCode =
    async (
      rawCode: string
    ) => {
      const normalizedCode =
        rawCode.trim();

      if (!normalizedCode) {
        toast.error(
          "Ingresa un código de entrada."
        );

        return;
      }

      try {
        setProcessing(true);
        setResult(null);

        const response =
          await checkInTicket(
            normalizedCode
          );

        setResult(response);

        setCode("");

        toast.success(
          "Check-in completado.",
          {
            description:
              `${response.attendeeName} puede ingresar al evento.`,
          }
        );
      } catch (error) {
        console.error(error);

        if (
          axios.isAxiosError(
            error
          )
        ) {
          toast.error(
            "Entrada no válida.",
            {
              description:
                error.response
                  ?.data
                  ?.message,
            }
          );

          return;
        }

        toast.error(
          "Ocurrió un error inesperado."
        );
      } finally {
        setProcessing(false);
      }
    };

  // ============================================================
  // CAMERA
  // ============================================================

  const stopScanner =
    async () => {
      const scanner =
        scannerRef.current;

      if (!scanner) {
        setScannerActive(
          false
        );

        return;
      }

      try {
        await scanner.stop();
      } catch {
        // Puede ocurrir si ya estaba detenido.
      }

      scannerRef.current =
        null;

      setScannerActive(
        false
      );
    };

  const startScanner =
    async () => {
      if (scannerActive) {
        return;
      }

      try {
        setResult(null);

        const scanner =
          new Html5Qrcode(
            "evently-qr-reader"
          );

        scannerRef.current =
          scanner;

        await scanner.start(
          {
            facingMode:
              "environment",
          },
          {
            fps: 10,

            qrbox: {
              width: 240,
              height: 240,
            },
          },
          async (
            decodedText
          ) => {
            if (
              processingScanRef.current
            ) {
              return;
            }

            processingScanRef.current =
              true;

            await stopScanner();

            await processCode(
              decodedText
            );

            processingScanRef.current =
              false;
          },
          () => {
            // Los intentos fallidos durante
            // el escaneo se ignoran.
          }
        );

        setScannerActive(true);
      } catch (error) {
        console.error(error);

        scannerRef.current =
          null;

        setScannerActive(
          false
        );

        toast.error(
          "No fue posible acceder a la cámara.",
          {
            description:
              "Verifica los permisos del navegador.",
          }
        );
      }
    };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
            Acceso al evento
          </span>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Check-in
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500 dark:text-slate-400">
            Escanea el código QR de
            una entrada o introduce
            manualmente su código.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* ==================================================
              SCANNER
              ================================================== */}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
                <Camera
                  size={20}
                />
              </div>

              <div>
                <h2 className="font-black text-slate-950 dark:text-white">
                  Escanear QR
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Utiliza la cámara
                  del dispositivo.
                </p>
              </div>
            </div>

            <div className="mt-7 overflow-hidden rounded-2xl bg-slate-950">
              <div
                id="evently-qr-reader"
                className="min-h-72"
              />

              {!scannerActive && (
                <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center text-white">
                  <ScanLine
                    size={42}
                    className="text-brand-400"
                  />

                  <p className="mt-4 text-sm font-bold">
                    Cámara detenida
                  </p>

                  <p className="mt-2 max-w-xs text-xs leading-5 text-slate-400">
                    Presiona iniciar
                    cámara y apunta al
                    QR de la entrada.
                  </p>
                </div>
              )}
            </div>

            {!scannerActive ? (
              <button
                type="button"
                onClick={
                  startScanner
                }
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3.5 text-sm font-black text-white transition hover:bg-brand-700"
              >
                <Camera
                  size={18}
                />

                Iniciar cámara
              </button>
            ) : (
              <button
                type="button"
                onClick={
                  stopScanner
                }
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3.5 text-sm font-black text-red-600 transition hover:bg-red-100 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
              >
                <StopCircle
                  size={18}
                />

                Detener cámara
              </button>
            )}

            <p className="mt-4 text-center text-xs leading-5 text-slate-400">
              La cámara requiere
              localhost o una conexión
              HTTPS.
            </p>
          </section>

          {/* ==================================================
              MANUAL
              ================================================== */}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
                <Keyboard
                  size={20}
                />
              </div>

              <div>
                <h2 className="font-black text-slate-950 dark:text-white">
                  Código manual
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  También puedes
                  introducir el código
                  del ticket.
                </p>
              </div>
            </div>

            <form
              onSubmit={(
                event
              ) => {
                event.preventDefault();

                void processCode(
                  code
                );
              }}
              className="mt-7"
            >
              <label className="text-sm font-black text-slate-700 dark:text-slate-300">
                Código de entrada
              </label>

              <input
                value={code}
                onChange={(
                  event
                ) =>
                  setCode(
                    event.target.value
                  )
                }
                placeholder="Ej. C52AFA82783E..."
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-mono text-sm uppercase text-slate-950 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />

              <button
                type="submit"
                disabled={
                  processing ||
                  !code.trim()
                }
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-600 dark:hover:bg-brand-700"
              >
                {processing ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />

                    Validando...
                  </>
                ) : (
                  <>
                    <CheckCircle2
                      size={18}
                    />

                    Validar entrada
                  </>
                )}
              </button>
            </form>

            {/* RESULT */}

            {result && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/20"
              >
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2
                    size={20}
                  />

                  <span className="font-black">
                    Entrada válida
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-black text-slate-950 dark:text-white">
                  {
                    result.attendeeName
                  }
                </h3>

                <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Mail
                      size={15}
                      className="text-emerald-500"
                    />

                    {
                      result.attendeeEmail
                    }
                  </div>

                  <div className="flex items-center gap-2">
                    <User
                      size={15}
                      className="text-emerald-500"
                    />

                    {
                      result.eventTitle
                    }
                  </div>
                </div>
              </motion.div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default CheckInPage;