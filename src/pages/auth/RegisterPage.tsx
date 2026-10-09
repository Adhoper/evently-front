import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useForm,
  useWatch,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import axios from "axios";

import {
  Check,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

import {
  motion,
} from "motion/react";

import {
  registerSchema,
} from "../../schemas/authSchemas";

import type {
  RegisterFormData,
} from "../../schemas/authSchemas";

import {
  useAuth,
} from "../../hooks/useAuth";

function RegisterPage() {
  const navigate =
    useNavigate();

  const {
    registerUser,
  } = useAuth();

  const [
    serverError,
    setServerError,
  ] = useState<string | null>(
    null
  );

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: {
      errors,
      isSubmitting,
    },
  } =
    useForm<RegisterFormData>({
      resolver:
        zodResolver(
          registerSchema
        ),
    });

  const password =
    useWatch({
      control,
      name: "password",
    }) ?? "";

  const passwordRules = {
    length:
      password.length >= 8,

    uppercase:
      /[A-Z]/.test(password),

    lowercase:
      /[a-z]/.test(password),

    number:
      /[0-9]/.test(password),
  };

  const onSubmit = async (
    data: RegisterFormData
  ) => {
    try {
      setServerError(null);

      const {
        confirmPassword,
        ...registerData
      } = data;

      void confirmPassword;

      await registerUser(
        registerData
      );

      navigate("/");
    } catch (error) {
      console.error(error);

      if (
        axios.isAxiosError(error)
      ) {
        setServerError(
          error.response?.data
            ?.message ??
            "No fue posible crear la cuenta."
        );

        return;
      }

      setServerError(
        "Ocurrió un error inesperado."
      );
    }
  };

  return (
    <main className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden bg-slate-100 dark:bg-[#0b1120] px-4 py-16">
      

      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-brand-300/25 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -20, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-accent-300/20 blur-3xl"
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 24,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
        }}
        className="relative w-full max-w-lg"
      >
        <div className="rounded-[28px] border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/95 dark:bg-slate-900/90 p-7 shadow-[0_20px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 dark:bg-brand-900/25 px-3 py-1.5 text-xs font-bold text-brand-700 dark:text-brand-300">
            <Sparkles size={14} />

            Únete a Evently
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 dark:text-slate-50 sm:text-4xl">
            Crea tu cuenta
          </h1>

          <p className="mt-3 leading-7 text-slate-500 dark:text-slate-400">
            Descubre eventos,
            administra tus entradas y
            conviértete en organizador
            cuando quieras.
          </p>

          <form
            onSubmit={
              handleSubmit(
                onSubmit
              )
            }
            className="mt-8 space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Nombre
                </label>

                <input
                  {...register(
                    "firstName"
                  )}
                  placeholder="Adrian"
                  className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 px-4 py-3.5 text-sm outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:bg-slate-50 dark:focus:bg-slate-900 focus:ring-4 focus:ring-brand-500/10"
                />

                {errors.firstName && (
                  <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">
                    {
                      errors
                        .firstName
                        .message
                    }
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Apellido
                </label>

                <input
                  {...register(
                    "lastName"
                  )}
                  placeholder="Curet"
                  className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 px-4 py-3.5 text-sm outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:bg-slate-50 dark:focus:bg-slate-900 focus:ring-4 focus:ring-brand-500/10"
                />

                {errors.lastName && (
                  <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">
                    {
                      errors
                        .lastName
                        .message
                    }
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                Correo electrónico
              </label>

              <input
                type="email"
                {...register(
                  "email"
                )}
                placeholder="correo@ejemplo.com"
                className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 px-4 py-3.5 text-sm outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:bg-slate-50 dark:focus:bg-slate-900 focus:ring-4 focus:ring-brand-500/10"
              />

              {errors.email && (
                <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">
                  {
                    errors.email
                      .message
                  }
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
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
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 px-4 py-3.5 pr-12 text-sm outline-none transition-all duration-200 hover:border-slate-300 focus:border-brand-500 focus:bg-slate-50 dark:focus:bg-slate-900 focus:ring-4 focus:ring-brand-500/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700"
                  aria-label="Mostrar contraseña"
                >
                  {showPassword ? (
                    <EyeOff
                      size={18}
                    />
                  ) : (
                    <Eye
                      size={18}
                    />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">
                  {
                    errors.password
                      .message
                  }
                </p>
              )}

              <div className="mt-4 grid grid-cols-2 gap-2">
                <PasswordRule
                  valid={
                    passwordRules.length
                  }
                >
                  8 caracteres
                </PasswordRule>

                <PasswordRule
                  valid={
                    passwordRules.uppercase
                  }
                >
                  Una mayúscula
                </PasswordRule>

                <PasswordRule
                  valid={
                    passwordRules.lowercase
                  }
                >
                  Una minúscula
                </PasswordRule>

                <PasswordRule
                  valid={
                    passwordRules.number
                  }
                >
                  Un número
                </PasswordRule>
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                Repetir contraseña
              </label>

              <div className="relative mt-2">
                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  {...register(
                    "confirmPassword"
                  )}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 px-4 py-3.5 pr-12 text-sm outline-none transition-all duration-200 hover:border-slate-300 focus:border-brand-500 focus:bg-slate-50 dark:focus:bg-slate-900 focus:ring-4 focus:ring-brand-500/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (current) =>
                        !current
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff
                      size={18}
                    />
                  ) : (
                    <Eye
                      size={18}
                    />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">
                  {
                    errors
                      .confirmPassword
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
                className="rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 p-4 text-sm font-medium text-red-700 dark:text-red-300"
              >
                {serverError}
              </motion.div>
            )}

            <motion.button
              whileHover={{
                y: -2,
              }}
              whileTap={{
                scale: 0.98,
              }}
              type="submit"
              disabled={
                isSubmitting
              }
              className="group relative w-full overflow-hidden rounded-xl bg-brand-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 disabled:opacity-60"
            >
              <span className="relative z-10">
                {isSubmitting
                  ? "Creando cuenta..."
                  : "Crear cuenta"}
              </span>

              <div className="absolute inset-y-0 -left-32 w-24 rotate-12 bg-white/20 blur-xl transition-all duration-700 group-hover:left-[120%]" />
            </motion.button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="font-bold text-brand-600 transition hover:text-brand-700"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}

interface PasswordRuleProps {
  valid: boolean;
  children: React.ReactNode;
}

function PasswordRule({
  valid,
  children,
}: PasswordRuleProps) {
  return (
    <div
      className={`flex items-center gap-2 text-xs font-semibold transition ${
        valid
          ? "text-emerald-600"
          : "text-slate-400"
      }`}
    >
      <span
        className={`grid h-4 w-4 place-items-center rounded-full transition ${
          valid
            ? "bg-emerald-100"
            : "bg-slate-100 dark:bg-slate-800"
        }`}
      >
        <Check size={10} />
      </span>

      {children}
    </div>
  );
}

export default RegisterPage;