import { useEffect, useRef, useState } from "react";
import { Camera, CheckCircle2, Keyboard, LoaderCircle, Mail, QrCode, ScanLine, ShieldCheck, StopCircle, UserRound, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "sonner";
import axios from "axios";
import { checkInTicket } from "../../services/ticketService";
import type { CheckInResult } from "../../types/ticket";

function CheckInPage() {
  const [code, setCode] = useState("");
  const [processing, setProcessing] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const processingScanRef = useRef(false);

  useEffect(() => {
    return () => {
      scannerRef.current?.stop().catch(() => undefined);
    };
  }, []);

  const processCode = async (rawCode: string) => {
    const normalizedCode = rawCode.trim();
    if (!normalizedCode) {
      toast.error("Ingresa un código de entrada.");
      return;
    }

    try {
      setProcessing(true);
      setResult(null);
      setLastError(null);
      const response = await checkInTicket(normalizedCode);
      setResult(response);
      setCode("");
      toast.success("Check-in completado.", { description: `${response.attendeeName} puede ingresar al evento.` });
    } catch (error) {
      const message = axios.isAxiosError(error) ? error.response?.data?.message ?? "La entrada no pudo validarse." : "Ocurrió un error inesperado.";
      setLastError(message);
      toast.error("Entrada no válida.", { description: message });
    } finally {
      setProcessing(false);
    }
  };

  const stopScanner = async () => {
    const scanner = scannerRef.current;
    if (scanner) {
      try {
        await scanner.stop();
      } catch {
        setScannerActive(false);
      }
    }
    scannerRef.current = null;
    setScannerActive(false);
  };

  const startScanner = async () => {
    if (scannerActive) return;
    try {
      setResult(null);
      setLastError(null);
      const scanner = new Html5Qrcode("evently-qr-reader");
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          if (processingScanRef.current) return;
          processingScanRef.current = true;
          await stopScanner();
          await processCode(decodedText);
          processingScanRef.current = false;
        },
        () => undefined
      );
      setScannerActive(true);
    } catch (error) {
      console.error(error);
      scannerRef.current = null;
      setScannerActive(false);
      toast.error("No fue posible acceder a la cámara.", { description: "Verifica los permisos del navegador y utiliza HTTPS o localhost." });
    }
  };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">Acceso al evento</span>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-slate-50 sm:text-4xl">Check-in</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">Valida entradas mediante cámara o código manual. Evently verifica automáticamente el evento, el estado del ticket y si ya fue utilizado.</p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300"><ShieldCheck size={18} />Validación segura</div>
        </motion.div>

        <div className="mt-9 grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-100 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300"><Camera size={21} /></div>
                <div><h2 className="font-black text-slate-950 dark:text-slate-50">Escáner QR</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Apunta la cámara al código del asistente.</p></div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="relative overflow-hidden rounded-3xl border border-slate-700 bg-[#070b14] shadow-inner">
                <div id="evently-qr-reader" className={`${scannerActive ? "min-h-80" : "hidden"}`} />
                {!scannerActive && (
                  <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
                    <div className="relative grid h-32 w-32 place-items-center">
                      <div className="absolute left-0 top-0 h-9 w-9 border-l-4 border-t-4 border-brand-400" />
                      <div className="absolute right-0 top-0 h-9 w-9 border-r-4 border-t-4 border-brand-400" />
                      <div className="absolute bottom-0 left-0 h-9 w-9 border-b-4 border-l-4 border-brand-400" />
                      <div className="absolute bottom-0 right-0 h-9 w-9 border-b-4 border-r-4 border-brand-400" />
                      <QrCode size={52} className="text-slate-500" />
                    </div>
                    <p className="mt-5 font-black text-slate-100">Escáner listo</p>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">Inicia la cámara cuando tengas el ticket frente al dispositivo.</p>
                  </div>
                )}
                {scannerActive && <div className="pointer-events-none absolute inset-x-10 top-1/2 h-px bg-brand-400 shadow-[0_0_18px_rgba(96,165,250,.9)]" />}
              </div>

              {!scannerActive ? (
                <button type="button" onClick={() => void startScanner()} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"><ScanLine size={18} />Iniciar escáner</button>
              ) : (
                <button type="button" onClick={() => void stopScanner()} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-red-100 px-5 py-3.5 text-sm font-black text-red-700 transition hover:bg-red-200 dark:bg-red-950/40 dark:text-red-300"><StopCircle size={18} />Detener cámara</button>
              )}

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {["Inicia la cámara", "Apunta al QR", "Confirma el acceso"].map((step, index) => <div key={step} className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800"><span className="text-[10px] font-black uppercase tracking-wider text-brand-600 dark:text-brand-400">Paso {index + 1}</span><p className="mt-1 text-xs font-bold text-slate-700 dark:text-slate-300">{step}</p></div>)}
              </div>
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              <div className="flex items-center gap-4"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"><Keyboard size={21} /></div><div><h2 className="font-black text-slate-950 dark:text-slate-50">Código manual</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Útil para pruebas o cuando la cámara no está disponible.</p></div></div>
              <form onSubmit={(event) => { event.preventDefault(); void processCode(code); }} className="mt-6">
                <label className="text-sm font-black text-slate-700 dark:text-slate-300">Código de entrada</label>
                <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Ej. C52AFA82783E..." className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-slate-100 px-4 font-mono text-sm uppercase text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" />
                <button type="submit" disabled={processing || !code.trim()} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-5 py-3.5 text-sm font-black text-white transition hover:bg-slate-900 disabled:opacity-50 dark:bg-brand-600 dark:hover:bg-brand-700">{processing ? <><LoaderCircle size={18} className="animate-spin" />Validando...</> : <><CheckCircle2 size={18} />Validar entrada</>}</button>
              </form>
            </section>

            {result && (
              <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-emerald-200 bg-emerald-100/80 p-6 dark:border-emerald-900/60 dark:bg-emerald-950/25">
                <div className="flex items-center gap-3 text-emerald-800 dark:text-emerald-300"><div className="grid h-11 w-11 place-items-center rounded-full bg-emerald-600 text-white"><CheckCircle2 size={21} /></div><div><p className="text-xs font-black uppercase tracking-[0.16em]">Acceso aprobado</p><p className="mt-1 text-sm font-bold">Entrada validada correctamente</p></div></div>
                <h3 className="mt-5 text-xl font-black text-slate-950 dark:text-slate-50">{result.attendeeName}</h3>
                <div className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300"><div className="flex items-center gap-2"><Mail size={15} className="text-emerald-600" />{result.attendeeEmail}</div><div className="flex items-center gap-2"><UserRound size={15} className="text-emerald-600" />{result.eventTitle}</div></div>
              </motion.section>
            )}

            {lastError && !result && (
              <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-red-200 bg-red-100/80 p-6 dark:border-red-900/60 dark:bg-red-950/25">
                <div className="flex items-start gap-3"><XCircle size={22} className="mt-0.5 shrink-0 text-red-600 dark:text-red-400" /><div><p className="font-black text-red-800 dark:text-red-300">Entrada rechazada</p><p className="mt-2 text-sm leading-6 text-red-700 dark:text-red-300/80">{lastError}</p></div></div>
              </motion.section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckInPage;
