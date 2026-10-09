import {
  useState,
} from "react";

import {
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  X,
} from "lucide-react";

import {
  motion,
} from "motion/react";

import {
  Link,
  useSearchParams,
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
  resetPasswordSchema,
} from "../../schemas/authSchemas";

import type {
  ResetPasswordFormData,
} from "../../schemas/authSchemas";

import {
  resetPassword,
} from "../../services/authService";

function ResetPasswordPage() {
  const [
    searchParams,
  ] = useSearchParams();

  const token =
    searchParams.get(
      "token"
    )?.trim() ?? "";

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    success,
    setSuccess,
  ] = useState(false);

  const [
    serverError,
    setServerError,
  ] =
    useState<string | null>(
      null
    );

  const {
    control,
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } =
    useForm<ResetPasswordFormData>({
      resolver:
        zodResolver(
          resetPasswordSchema
        ),

      defaultValues: {
        password: "",
        confirmPassword: "",
      },
    });

  const password =
    useWatch({
      control,
      name: "password",
    }) ?? "";

  const rules = {
    length:
      password.length >= 8,

    uppercase:
      /[A-Z]/.test(
        password
      ),

    lowercase:
      /[a-z]/.test(
        password
      ),

    number:
      /[0-9]/.test(
        password
      ),
  };

  const onSubmit =
    async (
      data:
        ResetPasswordFormData
    ) => {
      if (!token) {
        setServerError(
          "El enlace de recuperación no contiene un token válido."
        );

        return;
      }

      try {
        setServerError(
          null
        );

        await resetPassword({
          token,
          password:
            data.password,
          confirmPassword:
            data.confirmPassword,
        });

        setSuccess(true);
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
              "No fue posible restablecer tu contraseña."
          );

          return;
        }

        setServerError(
          "Ocurrió un error inesperado."
        );
      }
    };

  if (!token) {
    return (
      <main className="flex min-h-[calc(100dvh-72px)] items-center justify-center bg-slate-100 px-4 py-10 dark:bg-slate-950">
        <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-slate-50 p-7 text-center shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-9">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
            <X
              size={29}
            />
          </div>

          <h1 className="mt-6 text-3xl font-black text-slate-950 dark:text-white">
            Enlace no válido
          </h1>

          <p className="mt-3 leading-7 text-slate-500 dark:text-slate-400">
            Este enlace de recuperación
            no contiene la información
            necesaria para cambiar tu
            contraseña.
          </p>

          <Link
            to="/forgot-password"
            className="mt-7 inline-flex rounded-xl bg-brand-600 px-5 py-3.5 text-sm font-black text-white"
          >
            Solicitar otro enlace
          </Link>
        </section>
      </main>
    );
  }

  if (success) {
    return (
      <main className="flex min-h-[calc(100dvh-72px)] items-center justify-center bg-slate-100 px-4 py-10 dark:bg-slate-950">
        <motion.section
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="w-full max-w-lg rounded-3xl border border-slate-200 bg-slate-50 p-7 text-center shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-9"
        >
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
            <CheckCircle2
              size={30}
            />
          </div>

          <span className="mt-6 block text-xs font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
            Contraseña actualizada
          </span>

          <h1 className="mt-3 text-3xl font-black text-slate-950 dark:text-white">
            Todo listo
          </h1>

          <p className="mt-4 leading-7 text-slate-500 dark:text-slate-400">
            Tu contraseña fue
            restablecida correctamente.
            Ya puedes iniciar sesión con
            tu nueva contraseña.
          </p>

          <Link
            to="/login"
            className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-brand-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
          >
            Iniciar sesión
          </Link>
        </motion.section>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-[calc(100dvh-72px)] items-center overflow-hidden bg-slate-100 px-4 py-10 dark:bg-slate-950 sm:px-6">
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-200/30 blur-3xl dark:bg-brand-900/15" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-accent-300/15 blur-3xl dark:bg-accent-400/5" />

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
        <div className="grid h-13 w-13 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
          <KeyRound
            size={23}
          />
        </div>

        <span className="mt-7 block text-xs font-black uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
          Nueva contraseña
        </span>

        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
          Restablecer contraseña
        </h1>

        <p className="mt-3 leading-7 text-slate-500 dark:text-slate-400">
          Crea una contraseña nueva para
          volver a acceder a tu cuenta.
        </p>

        <form
          onSubmit={
            handleSubmit(
              onSubmit
            )
          }
          className="mt-8 space-y-5"
        >
          {/* PASSWORD */}

          <div>
            <label
              htmlFor="password"
              className="text-sm font-black text-slate-700 dark:text-slate-300"
            >
              Nueva contraseña
            </label>

            <div className="relative mt-2">
              <LockKeyhole
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                autoComplete="new-password"
                {...register(
                  "password"
                )}
                placeholder="••••••••"
                className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-12 text-sm text-slate-950 outline-none transition focus:ring-4 focus:ring-brand-500/10 dark:bg-slate-950 dark:text-white ${
                  errors.password
                    ? "border-red-300 focus:border-red-500 dark:border-red-800"
                    : "border-slate-300 focus:border-brand-500 dark:border-slate-700"
                }`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (current) =>
                      !current
                  )
                }
                className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800"
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

          {/* RULES */}

          <div className="grid gap-2 rounded-2xl bg-slate-100 p-4 dark:bg-slate-950 sm:grid-cols-2">
            <PasswordRule
              valid={
                rules.length
              }
              text="8 caracteres"
            />

            <PasswordRule
              valid={
                rules.uppercase
              }
              text="Una mayúscula"
            />

            <PasswordRule
              valid={
                rules.lowercase
              }
              text="Una minúscula"
            />

            <PasswordRule
              valid={
                rules.number
              }
              text="Un número"
            />
          </div>

          {/* CONFIRM PASSWORD */}

          <div>
            <label
              htmlFor="confirmPassword"
              className="text-sm font-black text-slate-700 dark:text-slate-300"
            >
              Confirmar contraseña
            </label>

            <div className="relative mt-2">
              <LockKeyhole
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                autoComplete="new-password"
                {...register(
                  "confirmPassword"
                )}
                placeholder="••••••••"
                className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-12 text-sm text-slate-950 outline-none transition focus:ring-4 focus:ring-brand-500/10 dark:bg-slate-950 dark:text-white ${
                  errors.confirmPassword
                    ? "border-red-300 focus:border-red-500 dark:border-red-800"
                    : "border-slate-300 focus:border-brand-500 dark:border-slate-700"
                }`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (current) =>
                      !current
                  )
                }
                className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {showConfirmPassword ? (
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

            {errors.confirmPassword && (
              <p className="mt-2 text-sm font-semibold text-red-600 dark:text-red-400">
                {
                  errors.confirmPassword
                    .message
                }
              </p>
            )}
          </div>

          {serverError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={
              isSubmitting
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <KeyRound
              size={17}
            />

            {isSubmitting
              ? "Actualizando..."
              : "Cambiar contraseña"}
          </button>
        </form>
      </motion.section>
    </main>
  );
}

function PasswordRule({
  valid,
  text,
}: {
  valid: boolean;
  text: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 text-xs font-bold transition ${
        valid
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-slate-400"
      }`}
    >
      <div
        className={`grid h-5 w-5 place-items-center rounded-full ${
          valid
            ? "bg-emerald-100 dark:bg-emerald-950/50"
            : "bg-slate-200 dark:bg-slate-800"
        }`}
      >
        {valid ? (
          <Check
            size={12}
          />
        ) : (
          <X
            size={11}
          />
        )}
      </div>

      {text}
    </div>
  );
}

export default ResetPasswordPage;