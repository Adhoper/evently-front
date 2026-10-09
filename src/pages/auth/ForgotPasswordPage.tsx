import {
  useState,
} from "react";

import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  Send,
  ShieldCheck,
} from "lucide-react";

import {
  motion,
} from "motion/react";

import {
  Link,
} from "react-router-dom";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import axios from "axios";

import {
  forgotPasswordSchema,
} from "../../schemas/authSchemas";

import type {
  ForgotPasswordFormData,
} from "../../schemas/authSchemas";

import {
  forgotPassword,
} from "../../services/authService";

function ForgotPasswordPage() {
  const [
    sent,
    setSent,
  ] =
    useState(false);

  const [
    submittedEmail,
    setSubmittedEmail,
  ] =
    useState("");

  const [
    serverError,
    setServerError,
  ] =
    useState<string | null>(
      null
    );

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } =
    useForm<ForgotPasswordFormData>({
      resolver:
        zodResolver(
          forgotPasswordSchema
        ),
    });

  const onSubmit =
    async (
      data:
        ForgotPasswordFormData
    ) => {
      try {
        setServerError(
          null
        );

        await forgotPassword({
          email:
            data.email,
        });

        setSubmittedEmail(
          data.email
        );

        setSent(true);

        reset();
      } catch (error) {
        console.error(
          error
        );

        if (
          axios.isAxiosError(
            error
          )
        ) {
          setServerError(
            error.response
              ?.data
              ?.message ??
              "No fue posible procesar la solicitud."
          );

          return;
        }

        setServerError(
          "Ocurrió un error inesperado."
        );
      }
    };

  if (sent) {
    return (
      <main className="relative flex min-h-[calc(100dvh-72px)] items-center overflow-hidden bg-slate-100 px-4 py-10 dark:bg-slate-950 sm:px-6">
        <BackgroundDecoration />

        <motion.section
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="relative mx-auto w-full max-w-lg rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center shadow-[0_24px_70px_rgba(15,23,42,.12)] dark:border-slate-800 dark:bg-slate-900 sm:p-9"
        >
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
            <CheckCircle2
              size={30}
            />
          </div>

          <span className="mt-6 block text-xs font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
            Solicitud enviada
          </span>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            Revisa tu correo
          </h1>

          <p className="mt-4 leading-7 text-slate-500 dark:text-slate-400">
            Si existe una cuenta
            asociada a{" "}
            <strong className="text-slate-700 dark:text-slate-200">
              {
                submittedEmail
              }
            </strong>
            , recibirás un enlace para
            restablecer tu contraseña.
          </p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-100 p-4 text-left dark:border-slate-700 dark:bg-slate-950">
            <div className="flex gap-3">
              <ShieldCheck
                size={19}
                className="mt-0.5 shrink-0 text-brand-600 dark:text-brand-400"
              />

              <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                El enlace es válido
                durante 30 minutos y
                solo puede utilizarse
                una vez.
              </p>
            </div>
          </div>

          <Link
            to="/login"
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
          >
            <ArrowLeft
              size={17}
            />

            Volver al login
          </Link>

          <button
            type="button"
            onClick={() =>
              setSent(false)
            }
            className="mt-3 text-sm font-black text-brand-600 transition hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
          >
            Usar otro correo
          </button>
        </motion.section>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-[calc(100dvh-72px)] items-center overflow-hidden bg-slate-100 px-4 py-10 dark:bg-slate-950 sm:px-6">
      <BackgroundDecoration />

      <motion.section
        initial={{
          opacity: 0,
          y: 18,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="relative mx-auto w-full max-w-lg rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-[0_24px_70px_rgba(15,23,42,.12)] dark:border-slate-800 dark:bg-slate-900 sm:p-9"
      >
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
        >
          <ArrowLeft
            size={16}
          />

          Volver al login
        </Link>

        <div className="mt-7 grid h-13 w-13 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
          <Mail
            size={23}
          />
        </div>

        <span className="mt-7 block text-xs font-black uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
          Recuperar acceso
        </span>

        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
          ¿Olvidaste tu contraseña?
        </h1>

        <p className="mt-3 leading-7 text-slate-500 dark:text-slate-400">
          Introduce el correo de tu
          cuenta y te enviaremos un
          enlace para crear una nueva
          contraseña.
        </p>

        <form
          onSubmit={
            handleSubmit(
              onSubmit
            )
          }
          className="mt-8"
        >
          <label
            htmlFor="email"
            className="text-sm font-black text-slate-700 dark:text-slate-300"
          >
            Correo electrónico
          </label>

          <div className="relative mt-2">
            <Mail
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register(
                "email"
              )}
              placeholder="correo@ejemplo.com"
              className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:ring-4 focus:ring-brand-500/10 dark:bg-slate-950 dark:text-white ${
                errors.email
                  ? "border-red-300 focus:border-red-500 dark:border-red-800"
                  : "border-slate-300 focus:border-brand-500 dark:border-slate-700"
              }`}
            />
          </div>

          {errors.email && (
            <p className="mt-2 text-sm font-semibold text-red-600 dark:text-red-400">
              {
                errors.email
                  .message
              }
            </p>
          )}

          {serverError && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={
              isSubmitting
            }
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send
              size={17}
            />

            {isSubmitting
              ? "Enviando..."
              : "Enviar enlace"}
          </button>
        </form>

        <p className="mt-7 text-center text-xs leading-5 text-slate-400">
          Por seguridad, no indicaremos
          si el correo está registrado
          en Evently.
        </p>
      </motion.section>
    </main>
  );
}

function BackgroundDecoration() {
  return (
    <>
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-200/30 blur-3xl dark:bg-brand-900/15" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-accent-300/15 blur-3xl dark:bg-accent-400/5" />
    </>
  );
}

export default ForgotPasswordPage;