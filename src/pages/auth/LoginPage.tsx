import {
  useState,
} from "react";

import {
  Eye,
  EyeOff,
  LogIn,
  Sparkles,
} from "lucide-react";

import {
  motion,
} from "motion/react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import axios from "axios";

import {
  loginSchema,
} from "../../schemas/authSchemas";

import {
  useAuth,
} from "../../hooks/useAuth";

import type {
  LoginRequest,
} from "../../types/auth";

function LoginPage() {
  const navigate =
    useNavigate();

  const {
    loginUser,
  } = useAuth();

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

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
    formState: {
      errors,
      isSubmitting,
    },
  } =
    useForm<LoginRequest>({
      resolver:
        zodResolver(
          loginSchema
        ),
    });

  const onSubmit =
    async (
      data: LoginRequest
    ) => {
      try {
        setServerError(null);

        await loginUser(
          data
        );

        navigate("/");
      } catch (error) {
        console.error(error);

        if (
          axios.isAxiosError(
            error
          )
        ) {
          setServerError(
            error.response
              ?.data
              ?.message ??
              "No fue posible iniciar sesión."
          );

          return;
        }

        setServerError(
          "Ocurrió un error inesperado."
        );
      }
    };

  return (
    <main className="relative flex min-h-[calc(100vh-72px)] items-center overflow-hidden bg-slate-50 dark:bg-slate-950 px-4 py-12 sm:py-16">
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-accent-300/15 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-4xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_30px_100px_rgba(15,23,42,.12)] lg:grid-cols-[.9fr_1.1fr]">
        {/* VISUAL */}

        <div className="relative hidden overflow-hidden bg-linear-to-br from-brand-600 via-brand-800 to-slate-950 p-10 text-white lg:flex lg:flex-col">
          <div className="absolute -right-24 -top-24 h-60 w-60 rounded-full bg-accent-400/20 blur-3xl" />

          <div className="relative">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-400 text-slate-950 dark:text-slate-50">
              <Sparkles
                size={21}
              />
            </div>

            <h2 className="mt-8 text-4xl font-black leading-tight">
              Tu próxima experiencia
              continúa aquí.
            </h2>

            <p className="mt-5 max-w-sm leading-7 text-brand-100/80">
              Accede a tus entradas,
              descubre nuevos eventos y
              administra tus
              experiencias.
            </p>
          </div>

          <div className="relative mt-auto rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-200">
              Evently
            </p>

            <p className="mt-3 text-lg font-bold">
              Descubre. Conecta.
              Disfruta.
            </p>
          </div>
        </div>

        {/* FORM */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="p-6 sm:p-10 lg:p-14"
        >
          <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-600">
            Bienvenido de nuevo
          </span>

          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Iniciar sesión
          </h1>

          <p className="mt-3 leading-7 text-slate-500 dark:text-slate-400">
            Ingresa tus datos para
            continuar en Evently.
          </p>

          <form
            onSubmit={
              handleSubmit(
                onSubmit
              )
            }
            className="mt-8 space-y-5"
          >
            <div>
              <label className="text-sm font-black text-slate-700 dark:text-slate-200">
                Correo electrónico
              </label>

              <input
                type="email"
                {...register(
                  "email"
                )}
                placeholder="correo@ejemplo.com"
                className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3.5 text-sm outline-none transition focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-brand-500/10"
              />

              {errors.email && (
                <p className="mt-2 text-sm font-semibold text-red-600 dark:text-red-400">
                  {
                    errors.email
                      .message
                  }
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-black text-slate-700 dark:text-slate-200">
                Contraseña
              </label>

              <div className="relative mt-2">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  {...register(
                    "password"
                  )}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3.5 pr-12 text-sm outline-none transition focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-brand-500/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (value) =>
                        !value
                    )
                  }
                  className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700"
                >
                  {showPassword ? (
                    <EyeOff
                      size={17}
                    />
                  ) : (
                    <Eye
                      size={17}
                    />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="mt-2 text-sm font-semibold text-red-600 dark:text-red-400">
                  {
                    errors.password
                      .message
                  }
                </p>
              )}
            </div>

            {serverError && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 p-4 text-sm font-semibold text-red-700 dark:text-red-300"
              >
                {serverError}
              </motion.div>
            )}

            <motion.button
              whileTap={{
                scale: 0.98,
              }}
              type="submit"
              disabled={
                isSubmitting
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3.5 font-black text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogIn
                size={18}
              />

              {isSubmitting
                ? "Ingresando..."
                : "Iniciar sesión"}
            </motion.button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">
            ¿Aún no tienes una cuenta?{" "}
            <Link
              to="/register"
              className="font-black text-brand-600 hover:text-brand-700"
            >
              Crear cuenta
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}

export default LoginPage;