import { z } from "zod";

export const loginSchema =
  z.object({
    email: z
      .string()
      .min(
        1,
        "El correo es obligatorio."
      )
      .email(
        "Ingresa un correo válido."
      ),

    password: z
      .string()
      .min(
        1,
        "La contraseña es obligatoria."
      ),
  });

export const registerSchema =
  z.object({
    firstName: z
      .string()
      .min(
        2,
        "El nombre debe tener al menos 2 caracteres."
      ),

    lastName: z
      .string()
      .min(
        2,
        "El apellido debe tener al menos 2 caracteres."
      ),

    email: z
      .string()
      .email(
        "Ingresa un correo válido."
      ),

    password: z
      .string()
      .min(
        8,
        "La contraseña debe tener al menos 8 caracteres."
      ),
  });