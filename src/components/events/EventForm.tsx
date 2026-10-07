import {
  useEffect,
  useState,
} from "react";

import {
  useForm,
  useWatch,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  CalendarDays,
  Clock3,
  Image,
  MapPin,
  Tag,
  Text,
  Users,
  LoaderCircle,
  Sparkles,
} from "lucide-react";

import {
  motion,
} from "motion/react";

import {
  getCategories,
} from "../../services/categoryService";

import {
  eventSchema,
} from "../../schemas/eventSchemas";

import type {
  EventFormData,
} from "../../schemas/eventSchemas";

import type {
  Category,
} from "../../types/category";

interface EventFormProps {
  initialValues?: Partial<EventFormData>;

  onSubmit: (
    data: EventFormData
  ) => Promise<void>;

  submitLabel?: string;
}

function EventForm({
  initialValues,
  onSubmit,
  submitLabel = "Guardar evento",
}: EventFormProps) {
  const [
    categories,
    setCategories,
  ] = useState<Category[]>([]);

  const [
    loadingCategories,
    setLoadingCategories,
  ] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: {
      errors,
      isSubmitting,
    },
  } =
    useForm<EventFormData>({
      resolver:
        zodResolver(eventSchema),

      defaultValues: {
        title: "",
        description: "",
        eventCategoryId: 0,
        date: "",
        startTime: "",
        location: "",
        capacity: 100,
        imageUrl: "",
        ...initialValues,
      },
    });

  useEffect(() => {
    const loadCategories =
      async () => {
        try {
          const data =
            await getCategories();

          setCategories(
            data.filter(
              (category) =>
                category.isActive
            )
          );
        } catch (error) {
          console.error(
            "Error cargando categorías.",
            error
          );
        } finally {
          setLoadingCategories(
            false
          );
        }
      };

    loadCategories();
  }, []);

  const title =
    useWatch({
      control,
      name: "title",
    }) ?? "";

  const description =
    useWatch({
      control,
      name: "description",
    }) ?? "";

  const imageUrl =
    useWatch({
      control,
      name: "imageUrl",
    }) ?? "";

  const categoryId =
    useWatch({
      control,
      name: "eventCategoryId",
    }) ?? 0;

  const selectedCategory =
    categories.find(
      (category) =>
        category.id ===
        categoryId
    );

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  return (
    <form
      onSubmit={
        handleSubmit(onSubmit)
      }
      className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_360px]"
    >
      {/* FORMULARIO */}

      <div className="space-y-6">
        {/* INFORMACIÓN GENERAL */}

        <motion.section
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-8"
        >
          <SectionHeader
            icon={Text}
            title="Información general"
            description="Cuéntanos lo esencial sobre el evento."
          />

          <div className="mt-7 space-y-6">
            <div>
              <FormLabel>
                Título del evento
              </FormLabel>

              <input
                {...register(
                  "title"
                )}
                placeholder="Ej. Tech Summit RD 2026"
                className={inputClasses(
                  !!errors.title
                )}
              />

              <FieldError
                message={
                  errors.title
                    ?.message
                }
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <FormLabel>
                  Descripción
                </FormLabel>

                <span className="text-xs text-slate-400">
                  {
                    description
                      ?.length ??
                    0
                  }
                  /2000
                </span>
              </div>

              <textarea
                {...register(
                  "description"
                )}
                rows={6}
                placeholder="Describe qué podrán encontrar los asistentes..."
                className={`${inputClasses(
                  !!errors.description
                )} resize-none`}
              />

              <FieldError
                message={
                  errors
                    .description
                    ?.message
                }
              />
            </div>

            <div>
              <FormLabel>
                Categoría
              </FormLabel>

              <div className="relative">
                <Tag
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  {...register(
                    "eventCategoryId",
                    {
                      valueAsNumber:
                        true,
                    }
                  )}
                  disabled={
                    loadingCategories
                  }
                  className={`${inputClasses(
                    !!errors.eventCategoryId
                  )} appearance-none pl-11`}
                >
                  <option
                    value={0}
                  >
                    {loadingCategories
                      ? "Cargando categorías..."
                      : "Selecciona una categoría"}
                  </option>

                  {categories.map(
                    (
                      category
                    ) => (
                      <option
                        key={
                          category.id
                        }
                        value={
                          category.id
                        }
                      >
                        {
                          category.name
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              <FieldError
                message={
                  errors
                    .eventCategoryId
                    ?.message
                }
              />
            </div>
          </div>
        </motion.section>

        {/* FECHA Y UBICACIÓN */}

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
            delay: 0.06,
          }}
          className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-8"
        >
          <SectionHeader
            icon={
              CalendarDays
            }
            title="Fecha y ubicación"
            description="Define cuándo y dónde ocurrirá."
          />

          <div className="mt-7 grid gap-6 sm:grid-cols-2">
            <div>
              <FormLabel>
                Fecha
              </FormLabel>

              <div className="relative">
                <CalendarDays
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-500"
                />

                <input
                  type="date"
                  min={today}
                  {...register(
                    "date"
                  )}
                  className={`${inputClasses(
                    !!errors.date
                  )} pl-11`}
                />
              </div>

              <FieldError
                message={
                  errors.date
                    ?.message
                }
              />
            </div>

            <div>
              <FormLabel>
                Hora de inicio
              </FormLabel>

              <div className="relative">
                <Clock3
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-500"
                />

                <input
                  type="time"
                  {...register(
                    "startTime"
                  )}
                  className={`${inputClasses(
                    !!errors.startTime
                  )} pl-11`}
                />
              </div>

              <FieldError
                message={
                  errors
                    .startTime
                    ?.message
                }
              />
            </div>
          </div>

          <div className="mt-6">
            <FormLabel>
              Lugar
            </FormLabel>

            <div className="relative">
              <MapPin
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-500"
              />

              <input
                {...register(
                  "location"
                )}
                placeholder="Ej. Santo Domingo"
                className={`${inputClasses(
                  !!errors.location
                )} pl-11`}
              />
            </div>

            <FieldError
              message={
                errors.location
                  ?.message
              }
            />
          </div>
        </motion.section>

        {/* CAPACIDAD E IMAGEN */}

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
            delay: 0.12,
          }}
          className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-8"
        >
          <SectionHeader
            icon={Users}
            title="Detalles adicionales"
            description="Completa la capacidad y apariencia del evento."
          />

          <div className="mt-7 space-y-6">
            <div>
              <FormLabel>
                Capacidad
              </FormLabel>

              <div className="relative">
                <Users
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-500"
                />

                <input
                  type="number"
                  min={1}
                  {...register(
                    "capacity",
                    {
                      valueAsNumber:
                        true,
                    }
                  )}
                  className={`${inputClasses(
                    !!errors.capacity
                  )} pl-11`}
                />
              </div>

              <FieldError
                message={
                  errors.capacity
                    ?.message
                }
              />
            </div>

            <div>
              <FormLabel>
                URL de imagen
                <span className="ml-2 font-normal text-slate-400">
                  Opcional
                </span>
              </FormLabel>

              <div className="relative">
                <Image
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-500"
                />

                <input
                  {...register(
                    "imageUrl"
                  )}
                  placeholder="https://..."
                  className={`${inputClasses(
                    !!errors.imageUrl
                  )} pl-11`}
                />
              </div>

              <FieldError
                message={
                  errors.imageUrl
                    ?.message
                }
              />

              <p className="mt-2 text-xs leading-5 text-slate-400">
                Por ahora usamos
                una URL. Más
                adelante podemos
                agregar carga real
                de archivos.
              </p>
            </div>
          </div>
        </motion.section>
      </div>

      {/* PREVIEW / ACTIONS */}

      <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
        <motion.div
          initial={{
            opacity: 0,
            x: 15,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
        >
          <div className="aspect-video overflow-hidden bg-linear-to-br from-brand-600 via-brand-700 to-slate-950">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt=""
                className="h-full w-full object-cover"
                onError={(
                  event
                ) => {
                  event.currentTarget.style.display =
                    "none";
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Sparkles
                  size={35}
                  className="text-white/80"
                />
              </div>
            )}
          </div>

          <div className="p-6">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-600">
              {selectedCategory
                ?.name ??
                "Categoría"}
            </p>

            <h3 className="mt-2 text-xl font-black leading-tight text-slate-950 dark:text-slate-50">
              {title?.trim() ||
                "Tu evento aparecerá aquí"}
            </h3>

            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {description?.trim() ||
                "Agrega una descripción para obtener una vista previa del evento."}
            </p>

            <div className="mt-5 inline-flex rounded-full bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-300">
              Borrador
            </div>
          </div>
        </motion.div>

        <div className="rounded-3xl border border-brand-100 dark:border-brand-800/50 bg-brand-50 dark:bg-brand-900/25 p-5">
          <p className="text-sm font-black text-brand-900">
            ¿Qué ocurre al
            guardar?
          </p>

          <p className="mt-2 text-sm leading-6 text-brand-700/80">
            El evento se
            guardará como
            borrador. Podrás
            revisarlo y
            publicarlo después
            desde Mis eventos.
          </p>
        </div>

        <motion.button
          whileHover={{
            y: -2,
          }}
          whileTap={{
            scale: 0.98,
          }}
          disabled={
            isSubmitting
          }
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle
                size={18}
                className="animate-spin"
              />

              Guardando...
            </>
          ) : (
            <>
              <Sparkles
                size={18}
              />

              {submitLabel}
            </>
          )}
        </motion.button>
      </aside>
    </form>
  );
}

/* ============================================================
   SMALL REUSABLE UI
   ============================================================ */

interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 dark:bg-brand-900/25 text-brand-600">
        <Icon size={20} />
      </div>

      <div>
        <h2 className="font-black text-slate-950 dark:text-slate-50">
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

function FormLabel({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
      {children}
    </label>
  );
}

function FieldError({
  message,
}: {
  message?: string;
}) {
  if (!message) {
    return null;
  }

  return (
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
      {message}
    </motion.p>
  );
}

function inputClasses(
  hasError: boolean
) {
  return `
    mt-2
    w-full
    rounded-xl
    border
    bg-slate-50/70 dark:bg-slate-800/70
    px-4
    py-3.5
    text-sm
    text-slate-950 dark:text-slate-50
    outline-none
    transition-all
    duration-200
    placeholder:text-slate-400
    hover:border-slate-300
    focus:bg-white dark:focus:bg-slate-900
    focus:ring-4
    ${
      hasError
        ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
        : "border-slate-200 dark:border-slate-800 focus:border-brand-500 focus:ring-brand-500/10"
    }
  `;
}

export default EventForm;