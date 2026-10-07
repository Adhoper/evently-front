import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  LoaderCircle,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import axios from "axios";

import {
  toast,
} from "sonner";

import EventForm from "../../components/events/EventForm";

import {
  getMyEventById,
  updateEvent,
} from "../../services/eventService";

import type {
  EventDetail,
} from "../../types/event";

import type {
  EventFormData,
} from "../../schemas/eventSchemas";

function EditEventPage() {
  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [
    event,
    setEvent,
  ] =
    useState<EventDetail | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    const loadEvent =
      async () => {
        if (!id) {
          setLoading(false);
          return;
        }

        try {
          const data =
            await getMyEventById(
              Number(id)
            );

          setEvent(data);
        } catch (error) {
          console.error(error);

          toast.error(
            "No fue posible cargar el evento."
          );
        } finally {
          setLoading(false);
        }
      };

    loadEvent();
  }, [id]);

  const handleSubmit =
    async (
      data: EventFormData
    ) => {
      if (!event) {
        return;
      }

      try {
        const startTime =
          data.startTime.length ===
          5
            ? `${data.startTime}:00`
            : data.startTime;

        await updateEvent(
          event.id,
          {
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
          }
        );

        toast.success(
          "Evento actualizado correctamente."
        );

        navigate(
          "/organizer/events"
        );
      } catch (error) {
        console.error(error);

        if (
          axios.isAxiosError(
            error
          )
        ) {
          toast.error(
            "No fue posible actualizar el evento.",
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

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <LoaderCircle
            size={30}
            className="animate-spin text-brand-600"
          />

          <p className="text-sm font-semibold">
            Cargando evento...
          </p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="px-4 py-16 text-center">
        <h1 className="text-3xl font-black">
          Evento no encontrado
        </h1>

        <Link
          to="/organizer/events"
          className="mt-6 inline-flex rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white"
        >
          Volver a mis eventos
        </Link>
      </div>
    );
  }

  if (
    event.status ===
      "Cancelled" ||
    event.status ===
      "Finished"
  ) {
    return (
      <div className="px-4 py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
          <h1 className="text-2xl font-black text-slate-950">
            Este evento no puede
            editarse
          </h1>

          <p className="mt-3 text-slate-600">
            Los eventos cancelados
            o finalizados ya no
            admiten modificaciones.
          </p>

          <Link
            to="/organizer/events"
            className="mt-7 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white"
          >
            Volver
          </Link>
        </div>
      </div>
    );
  }

  const initialValues:
    Partial<EventFormData> = {
    title:
      event.title,

    description:
      event.description,

    date:
      event.date.slice(
        0,
        10
      ),

    startTime:
      event.startTime.slice(
        0,
        5
      ),

    location:
      event.location,

    capacity:
      event.capacity,

    imageUrl:
      event.imageUrl ?? "",

    eventCategoryId:
      event.eventCategoryId,
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

          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Editar evento
          </h1>

          <p className="mt-2 text-slate-500">
            Modifica la información
            de{" "}
            <strong className="text-slate-700">
              {event.title}
            </strong>
            .
          </p>
        </div>

        <EventForm
          initialValues={
            initialValues
          }
          onSubmit={
            handleSubmit
          }
          submitLabel="Guardar cambios"
        />
      </div>
    </div>
  );
}

export default EditEventPage;