import {
  useState,
} from "react";

import {
  CalendarPlus,
  LayoutDashboard,
  Mail,
  Sparkles,
  User,
} from "lucide-react";

import {
  motion,
} from "motion/react";

import {
  Link,
} from "react-router-dom";

import {
  toast,
} from "sonner";

import {
  useAuth,
} from "../../hooks/useAuth";

function AccountPage() {
  const {
    user,
    becomeOrganizerUser,
  } = useAuth();

  const [
    converting,
    setConverting,
  ] = useState(false);

  if (!user) {
    return null;
  }

  const handleBecomeOrganizer =
    async () => {
      try {
        setConverting(true);

        await becomeOrganizerUser();

        toast.success(
          "¡Ya eres organizador!",
          {
            description:
              "Ahora puedes crear y administrar tus propios eventos.",
          }
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "No fue posible actualizar tu cuenta."
        );
      } finally {
        setConverting(false);
      }
    };

  return (
    <main className="min-h-[70vh] bg-slate-50 dark:bg-slate-950 py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
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
          <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-600">
            Perfil
          </span>

          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Mi cuenta
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Consulta la información de
            tu cuenta y administra tu
            perfil de Evently.
          </p>
        </motion.div>

        <div className="mt-9 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* PROFILE */}

          <motion.section
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.05,
            }}
            className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-8"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-linear-to-br from-brand-500 to-brand-700 text-2xl font-black text-white shadow-lg shadow-brand-600/20">
                {user.firstName
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <h2 className="text-2xl font-black">
                  {
                    user.firstName
                  }{" "}
                  {
                    user.lastName
                  }
                </h2>

                <span className="mt-2 inline-flex rounded-full bg-brand-50 dark:bg-brand-900/25 px-3 py-1 text-xs font-black text-brand-700 dark:text-brand-300">
                  {user.role ===
                  "Organizer"
                    ? "Organizador"
                    : user.role ===
                        "Admin"
                      ? "Administrador"
                      : "Usuario"}
                </span>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <AccountInfo
                icon={User}
                label="Nombre completo"
                value={`${user.firstName} ${user.lastName}`}
              />

              <AccountInfo
                icon={Mail}
                label="Correo"
                value={
                  user.email
                }
              />
            </div>
          </motion.section>

          {/* ACTION */}

          {user.role ===
          "User" ? (
            <motion.aside
              initial={{
                opacity: 0,
                x: 15,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              className="relative overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-xl"
            >
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-600/50 blur-3xl" />

              <div className="relative">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-400 text-slate-950 dark:text-slate-50">
                  <CalendarPlus
                    size={21}
                  />
                </div>

                <h2 className="mt-6 text-2xl font-black">
                  Publica tus propios
                  eventos
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Convierte tu cuenta en
                  organizador y accede a
                  todas las herramientas
                  de gestión.
                </p>

                <button
                  type="button"
                  onClick={
                    handleBecomeOrganizer
                  }
                  disabled={
                    converting
                  }
                  className="mt-7 w-full rounded-xl bg-white dark:bg-slate-900 px-5 py-3.5 text-sm font-black text-slate-950 dark:text-slate-50 transition hover:bg-brand-50 dark:hover:bg-brand-900/30 disabled:opacity-60"
                >
                  {converting
                    ? "Actualizando..."
                    : "Convertirme en organizador"}
                </button>
              </div>
            </motion.aside>
          ) : (
            <motion.aside
              initial={{
                opacity: 0,
                x: 15,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              className="rounded-3xl border border-brand-100 dark:border-brand-800/50 bg-brand-50 dark:bg-brand-900/25 p-7"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-600 text-white">
                <Sparkles
                  size={21}
                />
              </div>

              <h2 className="mt-6 text-xl font-black">
                Cuenta de organizador
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Ya puedes publicar y
                administrar tus eventos
                desde tu panel.
              </p>

              <Link
                to="/organizer"
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3.5 text-sm font-black text-white transition hover:bg-brand-700"
              >
                <LayoutDashboard
                  size={17}
                />

                Ir al panel
              </Link>
            </motion.aside>
          )}
        </div>
      </div>
    </main>
  );
}

interface AccountInfoProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function AccountInfo({
  icon: Icon,
  label,
  value,
}: AccountInfoProps) {
  return (
    <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-5">
      <div className="flex items-center gap-2 text-brand-600">
        <Icon size={17} />

        <span className="text-xs font-black uppercase tracking-wide text-slate-400">
          {label}
        </span>
      </div>

      <p className="mt-3 wrap-break-word text-sm font-black text-slate-800 dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}

export default AccountPage;