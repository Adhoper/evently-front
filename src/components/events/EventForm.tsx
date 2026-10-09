import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  DragEvent,
  ElementType,
  ReactNode,
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
  ImagePlus,
  LoaderCircle,
  MapPin,
  RefreshCw,
  Sparkles,
  Tag,
  Text,
  Trash2,
  UploadCloud,
  Users,
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

import {
  resolveImageUrl,
} from "../../utils/image";

import Select from "../ui/Select";

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export interface EventImageChange {
  file: File | null;
  removeExisting: boolean;
}

interface EventFormProps {
  initialValues?: Partial<EventFormData>;
  initialImageUrl?: string | null;

  onSubmit: (
    data: EventFormData,
    imageChange: EventImageChange
  ) => Promise<void>;

  submitLabel?: string;
}

function EventForm({
  initialValues,
  initialImageUrl,
  onSubmit,
  submitLabel = "Guardar evento",
}: EventFormProps) {
  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  const [localPreviewUrl, setLocalPreviewUrl] =
    useState<string | null>(null);

  const [removeExistingImage, setRemoveExistingImage] =
    useState(false);

  const [imageError, setImageError] =
    useState<string | null>(null);

  const [draggingImage, setDraggingImage] =
    useState(false);

  const imageInputRef =
    useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      eventCategoryId: 0,
      date: "",
      startTime: "",
      location: "",
      capacity: 100,
      ...initialValues,
    },
  });

  useEffect(() => {
    let cancelled = false;

    getCategories()
      .then((data) => {
        if (cancelled) {
          return;
        }

        setCategories(
          data.filter(
            (category) =>
              category.isActive
          )
        );
      })
      .catch((error) => {
        console.error(
          "Error cargando categorías.",
          error
        );
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingCategories(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (
        localPreviewUrl?.startsWith(
          "blob:"
        )
      ) {
        URL.revokeObjectURL(
          localPreviewUrl
        );
      }
    };
  }, [localPreviewUrl]);

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

  const categoryId =
    useWatch({
      control,
      name: "eventCategoryId",
    }) ?? 0;

  const selectedCategory =
    categories.find(
      (category) =>
        category.id === categoryId
    );

  const resolvedInitialImage =
    resolveImageUrl(
      initialImageUrl
    );

  const previewImageUrl =
    localPreviewUrl ??
    (!removeExistingImage
      ? resolvedInitialImage
      : null);

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const selectImage = (
    file: File
  ) => {
    setImageError(null);

    if (
      !ALLOWED_IMAGE_TYPES.includes(
        file.type
      )
    ) {
      setImageError(
        "Solo se permiten imágenes JPG, JPEG, PNG o WebP."
      );
      return;
    }

    if (
      file.size >
      MAX_IMAGE_SIZE
    ) {
      setImageError(
        "La imagen no puede superar los 5 MB."
      );
      return;
    }

    setSelectedImage(file);
    setRemoveExistingImage(false);
    setLocalPreviewUrl(
      URL.createObjectURL(file)
    );
  };

  const handleImageInput = (
    files: FileList | null
  ) => {
    const file = files?.[0];

    if (!file) {
      return;
    }

    selectImage(file);
  };

  const handleDrop = (
    event: DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    setDraggingImage(false);

    const file =
      event.dataTransfer.files?.[0];

    if (file) {
      selectImage(file);
    }
  };

  const removeImage = () => {
    setImageError(null);
    setSelectedImage(null);
    setLocalPreviewUrl(null);

    setRemoveExistingImage(
      Boolean(initialImageUrl)
    );

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const openImagePicker = () => {
    imageInputRef.current?.click();
  };

  const submitForm =
    handleSubmit(
      async (data) => {
        await onSubmit(
          data,
          {
            file: selectedImage,
            removeExisting:
              removeExistingImage,
          }
        );
      }
    );

  return (
    <form
      onSubmit={submitForm}
      className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_360px]"
    >
      

      <div className="space-y-6">
        

        <motion.section
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
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
                {...register("title")}
                placeholder="Ej. Tech Summit RD 2026"
                className={inputClasses(
                  !!errors.title
                )}
              />

              <FieldError
                message={
                  errors.title?.message
                }
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <FormLabel>
                  Descripción
                </FormLabel>

                <span className="text-xs text-slate-400">
                  {description.length}
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
                  errors.description
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
                  className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                />

                <Select
                  wrapperClassName="mt-2"
                  {...register(
                    "eventCategoryId",
                    { valueAsNumber: true }
                  )}
                  disabled={loadingCategories}
                  className={`pl-11 ${
                    errors.eventCategoryId
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/10 dark:border-red-800"
                      : ""
                  }`}
                >
                  <option value={0}>
                    {loadingCategories
                      ? "Cargando categorías..."
                      : "Selecciona una categoría"}
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </div>

              <FieldError
                message={
                  errors.eventCategoryId
                    ?.message
                }
              />
            </div>
          </div>
        </motion.section>

        

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
          className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
        >
          <SectionHeader
            icon={CalendarDays}
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
                  {...register("date")}
                  className={`${inputClasses(
                    !!errors.date
                  )} pl-11`}
                />
              </div>

              <FieldError
                message={
                  errors.date?.message
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
                  errors.startTime
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
                errors.location?.message
              }
            />
          </div>
        </motion.section>

        

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
          className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
        >
          <SectionHeader
            icon={ImagePlus}
            title="Capacidad e imagen"
            description="Define el cupo y la imagen principal del evento."
          />

          <div className="mt-7 space-y-7">
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
                      valueAsNumber: true,
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
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <FormLabel>
                    Imagen del evento
                  </FormLabel>

                  <p className="mt-1 text-xs text-slate-400">
                    Opcional · JPG, PNG o WebP · Máximo 5 MB
                  </p>
                </div>

                {selectedImage && (
                  <span className="max-w-full truncate rounded-full bg-brand-50 px-3 py-1 text-[10px] font-black text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                    {selectedImage.name}
                  </span>
                )}
              </div>

              <input
                ref={imageInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(event) =>
                  handleImageInput(
                    event.target.files
                  )
                }
              />

              {previewImageUrl ? (
                <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 dark:border-slate-700">
                  <div className="relative aspect-16/8 overflow-hidden">
                    <img
                      src={previewImageUrl}
                      alt="Vista previa del evento"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={
                          openImagePicker
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 text-xs font-black text-slate-950 shadow-lg transition hover:bg-slate-100"
                      >
                        <RefreshCw
                          size={14}
                        />

                        Cambiar imagen
                      </button>

                      <button
                        type="button"
                        onClick={removeImage}
                        className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-black text-white shadow-lg transition hover:bg-red-700"
                      >
                        <Trash2
                          size={14}
                        />

                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={
                    openImagePicker
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" ||
                      event.key === " "
                    ) {
                      event.preventDefault();
                      openImagePicker();
                    }
                  }}
                  onDragEnter={(event) => {
                    event.preventDefault();
                    setDraggingImage(true);
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDraggingImage(true);
                  }}
                  onDragLeave={(event) => {
                    event.preventDefault();
                    setDraggingImage(false);
                  }}
                  onDrop={handleDrop}
                  className={`mt-3 flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition ${
                    draggingImage
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-950/30"
                      : "border-slate-300 bg-slate-50 hover:border-brand-400 hover:bg-brand-50/60 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-brand-700 dark:hover:bg-brand-950/20"
                  }`}
                >
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
                    <UploadCloud
                      size={25}
                    />
                  </div>

                  <p className="mt-4 font-black text-slate-900 dark:text-white">
                    Arrastra una imagen aquí
                  </p>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    o haz clic para seleccionar un archivo
                  </p>

                  {removeExistingImage && (
                    <span className="mt-4 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
                      La imagen actual se eliminará al guardar.
                    </span>
                  )}
                </div>
              )}

              {imageError && (
                <motion.p
                  initial={{
                    opacity: 0,
                    y: -4,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="mt-3 text-sm font-semibold text-red-600 dark:text-red-400"
                >
                  {imageError}
                </motion.p>
              )}
            </div>
          </div>
        </motion.section>
      </div>

      

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
          className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="aspect-video overflow-hidden bg-linear-to-br from-brand-600 via-brand-700 to-slate-950">
            {previewImageUrl ? (
              <img
                src={previewImageUrl}
                alt=""
                className="h-full w-full object-cover"
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
            <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
              {selectedCategory?.name ??
                "Categoría"}
            </p>

            <h3 className="mt-2 text-xl font-black leading-tight text-slate-950 dark:text-slate-50">
              {title.trim() ||
                "Tu evento aparecerá aquí"}
            </h3>

            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {description.trim() ||
                "Agrega una descripción para obtener una vista previa del evento."}
            </p>

            <div className="mt-5 inline-flex rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
              Borrador
            </div>
          </div>
        </motion.div>

        <div className="rounded-3xl border border-brand-100 bg-brand-50 p-5 dark:border-brand-800/50 dark:bg-brand-900/25">
          <p className="text-sm font-black text-brand-900 dark:text-brand-200">
            ¿Qué ocurre al guardar?
          </p>

          <p className="mt-2 text-sm leading-6 text-brand-700/80 dark:text-brand-300/80">
            Los datos se guardan primero y la imagen se envía al backend de forma separada. Podrás cambiarla o eliminarla más adelante.
          </p>
        </div>

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
          disabled={isSubmitting}
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

interface SectionHeaderProps {
  icon: ElementType;
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
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/25 dark:text-brand-400">
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
  children: ReactNode;
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
    bg-slate-100
    px-4
    py-3.5
    text-sm
    text-slate-950
    outline-none
    transition-all
    duration-200
    placeholder:text-slate-400
    hover:border-slate-300
    focus:bg-slate-50
    focus:ring-4
    dark:bg-slate-800/70
    dark:text-slate-50
    dark:hover:border-slate-700
    dark:focus:bg-slate-900
    ${
      hasError
        ? "border-red-300 focus:border-red-500 focus:ring-red-500/10 dark:border-red-800"
        : "border-slate-200 focus:border-brand-500 focus:ring-brand-500/10 dark:border-slate-800"
    }
  `;
}

export default EventForm;
