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
  useLocation,
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

interface LoginLocationState {
  from?: string;
}

function LoginPage() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

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

  const locationState =
    location.state as
      | LoginLocationState
      | null;

  const from =
    locationState?.from ??
    "/";

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
        setServerError(
          null
        );

        await loginUser(
          data
        );

        
        navigate(
          from,
          {
            replace: true,
          }
        );
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
    <main className="relative flex min-h-[calc(100vh-72px)] items-center overflow-hidden bg-slate-100 px-4 py-12 dark:bg-[#0b1120] sm:py-16">
      

      <motion.div
        animate={{
          x: [0, 25, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl dark:bg-brand-900/20"
      />

      <motion.div
        animate={{
          x: [0, -20, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-accent-300/15 blur-3xl dark:bg-accent-400/5"
      />

      

      <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-4xl border border-slate-200 bg-slate-50 shadow-[0_30px_100px_rgba(15,23,42,.12)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_30px_100px_rgba(0,0,0,.35)] lg:grid-cols-[.9fr_1.1fr]">
        

        <div className="relative hidden overflow-hidden bg-linear-to-br from-brand-600 via-brand-800 to-slate-950 p-10 text-white lg:flex lg:flex-col">
          <div className="absolute -right-24 -top-24 h-60 w-60 rounded-full bg-accent-400/20 blur-3xl" />

          <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-brand-400/20 blur-3xl" />

          <div className="relative">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-400 text-slate-950 shadow-lg shadow-accent-400/20">
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
              experiencias desde un
              solo lugar.
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

            <div className="mt-5 flex gap-2">
              <div className="h-1.5 w-10 rounded-full bg-accent-400" />

              <div className="h-1.5 w-5 rounded-full bg-white/20" />

              <div className="h-1.5 w-5 rounded-full bg-white/20" />
            </div>
          </div>
        </div>

        

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
          }}
          className="p-6 sm:p-10 lg:p-14"
        >
          

          <Link
            to="/"
            className="mb-9 inline-flex items-center gap-2.5 lg:hidden"
          >
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
              <Sparkles
                size={17}
              />
            </div>

            <span className="font-black text-slate-950 dark:text-white">
              EVENTLY
            </span>
          </Link>

          <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
            Bienvenido de nuevo
          </span>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Iniciar sesión
          </h1>

          <p className="mt-3 leading-7 text-slate-500 dark:text-slate-400">
            Ingresa tus datos para
            continuar en Evently.
          </p>

          

          {from !== "/" && (
            <div className="mt-5 rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-700 dark:border-brand-900 dark:bg-brand-950/30 dark:text-brand-300">
              Inicia sesión y volverás
              automáticamente al lugar
              donde estabas.
            </div>
          )}

          <form
            onSubmit={
              handleSubmit(
                onSubmit
              )
            }
            className="mt-8 space-y-5"
          >
            

            <div>
              <label
                htmlFor="email"
                className="text-sm font-black text-slate-700 dark:text-slate-300"
              >
                Correo electrónico
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register(
                  "email"
                )}
                placeholder="correo@ejemplo.com"
                className={`mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:bg-slate-50 focus:ring-4 focus:ring-brand-500/10 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950 ${
                  errors.email
                    ? "border-red-300 focus:border-red-500 dark:border-red-800"
                    : "border-slate-200 focus:border-brand-500 dark:border-slate-700"
                }`}
              />

              {errors.email && (
                <motion.p
                  initial={{
                    opacity: 0,
                    y: -4,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="mt-2 text-sm font-semibold text-red-600 dark:text-red-400"
                >
                  {
                    errors.email
                      .message
                  }
                </motion.p>
              )}
            </div>

            

            <div>
              <label
                htmlFor="password"
                className="text-sm font-black text-slate-700 dark:text-slate-300"
              >
                Contraseña
              </label>

              <div className="relative mt-2">
                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  {...register(
                    "password"
                  )}
                  placeholder="••••••••"
                  className={`w-full rounded-xl border bg-slate-50 px-4 py-3.5 pr-12 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:bg-slate-50 focus:ring-4 focus:ring-brand-500/10 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950 ${
                    errors.password
                      ? "border-red-300 focus:border-red-500 dark:border-red-800"
                      : "border-slate-200 focus:border-brand-500 dark:border-slate-700"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (value) =>
                        !value
                    )
                  }
                  className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                  aria-label={
                    showPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
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
                <motion.p
                  initial={{
                    opacity: 0,
                    y: -4,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="mt-2 text-sm font-semibold text-red-600 dark:text-red-400"
                >
                  {
                    errors.password
                      .message
                  }
                </motion.p>
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
                className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
              >
                {serverError}
              </motion.div>
            )}

            

            <motion.button
              whileHover={
                isSubmitting
                  ? undefined
                  : {
                      y: -2,
                    }
              }
              whileTap={
                isSubmitting
                  ? undefined
                  : {
                      scale: 0.98,
                    }
              }
              type="submit"
              disabled={
                isSubmitting
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3.5 font-black text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
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
            ¿Aún no tienes una
            cuenta?{" "}

            <Link
              to="/register"
              state={
                from !== "/"
                  ? {
                      from,
                    }
                  : undefined
              }
              className="font-black text-brand-600 transition hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
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