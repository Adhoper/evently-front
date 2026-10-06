import {
  useState,
} from "react";

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
      } catch (error) {
        console.error(error);
      } finally {
        setConverting(false);
      }
    };

  return (
    <main className="min-h-[calc(100vh-72px)] py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black">
          Mi cuenta
        </h1>

        <div className="mt-8 rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
          <p className="text-sm text-zinc-400">
            Nombre
          </p>

          <p className="mt-1 text-lg font-bold">
            {user.firstName}{" "}
            {user.lastName}
          </p>

          <p className="mt-6 text-sm text-zinc-400">
            Correo
          </p>

          <p className="mt-1 font-semibold">
            {user.email}
          </p>

          <p className="mt-6 text-sm text-zinc-400">
            Tipo de cuenta
          </p>

          <span className="mt-2 inline-flex rounded-full bg-zinc-100 px-3 py-1 text-sm font-bold">
            {user.role}
          </span>
        </div>

        {user.role === "User" && (
          <div className="mt-6 rounded-3xl bg-zinc-950 p-7 text-white">
            <h2 className="text-2xl font-black">
              ¿Quieres publicar tus
              propios eventos?
            </h2>

            <p className="mt-3 max-w-xl text-zinc-400">
              Convierte tu cuenta en
              organizador y obtén acceso
              a las herramientas de
              administración de eventos.
            </p>

            <button
              onClick={
                handleBecomeOrganizer
              }
              disabled={
                converting
              }
              className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-bold text-zinc-950 transition hover:bg-zinc-100 disabled:opacity-60"
            >
              {converting
                ? "Actualizando..."
                : "Convertirme en organizador"}
            </button>
          </div>
        )}

        {user.role ===
          "Organizer" && (
          <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="font-bold">
              Cuenta de organizador
            </h2>

            <p className="mt-2 text-zinc-500">
              Ya puedes crear y
              administrar eventos.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default AccountPage;