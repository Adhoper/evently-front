import { z } from "zod";

export const eventSchema =
  z.object({
    title: z
      .string()
      .trim()
      .min(
        3,
        "El título debe tener al menos 3 caracteres."
      )
      .max(
        150,
        "El título no puede superar los 150 caracteres."
      ),

    description: z
      .string()
      .trim()
      .min(
        20,
        "Describe un poco mejor el evento."
      )
      .max(
        2000,
        "La descripción no puede superar los 2000 caracteres."
      ),

    eventCategoryId: z
      .number()
      .min(
        1,
        "Selecciona una categoría."
      ),

    date: z
      .string()
      .min(
        1,
        "Selecciona una fecha."
      ),

    startTime: z
      .string()
      .min(
        1,
        "Selecciona una hora."
      ),

    location: z
      .string()
      .trim()
      .min(
        3,
        "Ingresa una ubicación válida."
      )
      .max(
        200,
        "La ubicación es demasiado larga."
      ),

    capacity: z
      .number()
      .int(
        "La capacidad debe ser un número entero."
      )
      .min(
        1,
        "La capacidad mínima es 1."
      )
      .max(
        100000,
        "La capacidad máxima es 100,000."
      ),

    imageUrl: z
      .union([
        z
          .string()
          .url(
            "Ingresa una URL válida."
          ),
        z.literal(""),
      ])
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.date) {
        return true;
      }

      const selected =
        new Date(
          `${data.date}T23:59:59`
        );

      return (
        selected >= new Date()
      );
    },
    {
      message:
        "La fecha del evento no puede estar en el pasado.",
      path: ["date"],
    }
  );

export type EventFormData =
  z.infer<typeof eventSchema>;