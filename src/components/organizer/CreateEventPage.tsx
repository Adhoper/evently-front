import {
  ArrowLeft,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  toast,
} from "sonner";

import axios from "axios";

import EventForm from "../../components/events/EventForm";

import {
  createEvent,
} from "../../services/eventService";

import type {
  EventFormData,
} from "../../schemas/eventSchemas";

function CreateEventPage() {
  const navigate =
    useNavigate();

  const handleSubmit =
    async (
      data: EventFormData
    ) => {
      try {
        const startTime =
          data.startTime.length ===
          5
            ? `${data.startTime}:00`
            : data.startTime;

        await createEvent({
          title:
            data.title.trim(),

          description:
            data.description.trim(),

          date:
            data.date,

          startTime,

          location:
            data.location.trim(),

          capacity:
            data.capacity,

          imageUrl:
            data.imageUrl?.trim()
              ? data.imageUrl.trim()
              : null,

          eventCategoryId:
            data.eventCategoryId,
        });

        toast.success(
          "Evento creado correctamente.",
          {
            description:
              "Se guardó como borrador.",
          }
        );

        navigate(
          "/organizer/events"
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
          toast.error(
            "No fue posible crear el evento.",
            {
              description:
                error.response
                  ?.data
                  ?.message,
            }
          );

          return;
        }

        toast.error(
          "Ocurrió un error inesperado."
        );
      }
    };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/organizer/events"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-brand-600"
        >
          <ArrowLeft
            size={17}
          />

          Mis eventos
        </Link>

        <div className="mb-9 mt-6">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-600">
            Organización
          </span>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Crear evento
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500">
            Completa la
            información y guarda
            tu evento como
            borrador antes de
            publicarlo.
          </p>
        </div>

        <EventForm
          onSubmit={
            handleSubmit
          }
          submitLabel="Guardar borrador"
        />
      </div>
    </div>
  );
}

export default CreateEventPage;