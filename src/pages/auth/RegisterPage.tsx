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
  registerSchema,
} from "../../schemas/authSchemas";

import {
  useAuth,
} from "../../hooks/useAuth";

import type {
  RegisterRequest,
} from "../../types/auth";

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

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } =
    useForm<RegisterRequest>({
      resolver:
        zodResolver(
          registerSchema
        ),
    });

  const onSubmit = async (
    data: RegisterRequest
  ) => {
    try {
      setServerError(null);

      await registerUser(data);

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
    <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-zinc-50 px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm sm:p-9">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
          Únete
        </span>

        <h1 className="mt-2 text-3xl font-black tracking-tight">
          Crear cuenta
        </h1>

        <p className="mt-3 text-sm text-zinc-500">
          Crea tu cuenta para obtener
          entradas y descubrir eventos.
        </p>

        <form
          onSubmit={
            handleSubmit(onSubmit)
          }
          className="mt-8 space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-zinc-700">
                Nombre
              </label>

              <input
                {...register(
                  "firstName"
                )}
                className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
              />

              {errors.firstName && (
                <p className="mt-2 text-sm text-red-600">
                  {
                    errors.firstName
                      .message
                  }
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-zinc-700">
                Apellido
              </label>

              <input
                {...register(
                  "lastName"
                )}
                className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
              />

              {errors.lastName && (
                <p className="mt-2 text-sm text-red-600">
                  {
                    errors.lastName
                      .message
                  }
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-zinc-700">
              Correo electrónico
            </label>

            <input
              type="email"
              {...register("email")}
              className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
            />

            {errors.email && (
              <p className="mt-2 text-sm text-red-600">
                {
                  errors.email.message
                }
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-zinc-700">
              Contraseña
            </label>

            <input
              type="password"
              {...register(
                "password"
              )}
              className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
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
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={
              isSubmitting
            }
            className="w-full rounded-xl bg-zinc-950 px-5 py-3 font-bold text-white transition hover:bg-zinc-800 disabled:opacity-60"
          >
            {isSubmitting
              ? "Creando cuenta..."
              : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-zinc-500">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="font-bold text-zinc-950"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </main>
  );
}

export default RegisterPage;