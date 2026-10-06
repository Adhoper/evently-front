import {
  useState,
} from "react";

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
    serverError,
    setServerError,
  ] = useState<string | null>(
    null
  );

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginRequest>({
    resolver:
      zodResolver(loginSchema),
  });

  const onSubmit = async (
    data: LoginRequest
  ) => {
    try {
      setServerError(null);

      await loginUser(data);

      navigate("/");
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data
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
    <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-zinc-50 px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm sm:p-9">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
            Bienvenido
          </span>

          <h1 className="mt-2 text-3xl font-black tracking-tight">
            Iniciar sesión
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-500">
            Accede a tu cuenta para
            administrar tus entradas y
            eventos.
          </p>
        </div>

        <form
          onSubmit={
            handleSubmit(onSubmit)
          }
          className="mt-8 space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="text-sm font-semibold text-zinc-700"
            >
              Correo electrónico
            </label>

            <input
              id="email"
              type="email"
              {...register("email")}
              className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
              placeholder="correo@ejemplo.com"
            />

            {errors.email && (
              <p className="mt-2 text-sm text-red-600">
                {
                  errors.email
                    .message
                }
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm font-semibold text-zinc-700"
            >
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              {...register(
                "password"
              )}
              className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
              placeholder="••••••••"
            />

            {errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {
                  errors.password
                    .message
                }
              </p>
            )}
          </div>

          {serverError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              {serverError}
            </div>
          )}

          <button
            disabled={
              isSubmitting
            }
            type="submit"
            className="w-full rounded-xl bg-zinc-950 px-5 py-3 font-bold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Ingresando..."
              : "Iniciar sesión"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-zinc-500">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="font-bold text-zinc-950"
          >
            Registrarse
          </Link>
        </p>
      </div>
    </main>
  );
}

export default LoginPage;