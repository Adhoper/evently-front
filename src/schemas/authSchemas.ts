import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Debe tener al menos 8 caracteres.")
  .max(100, "La contraseña es demasiado larga.")
  .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula.")
  .regex(/[a-z]/, "Debe contener al menos una letra minúscula.")
  .regex(/[0-9]/, "Debe contener al menos un número.");

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "El correo es obligatorio.")
    .email("Ingresa un correo electrónico válido."),

  password: z.string().min(1, "La contraseña es obligatoria."),
});

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "El nombre debe tener al menos 2 caracteres.")
      .max(100, "El nombre es demasiado largo."),

    lastName: z
      .string()
      .trim()
      .min(2, "El apellido debe tener al menos 2 caracteres.")
      .max(100, "El apellido es demasiado largo."),

    email: z
      .string()
      .trim()
      .min(1, "El correo es obligatorio.")
      .email("Ingresa un correo electrónico válido."),

    password: passwordSchema,

    confirmPassword: z.string().min(1, "Confirma tu contraseña."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "El correo es obligatorio.")
    .email("Ingresa un correo electrónico válido."),
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,

    confirmPassword: z.string().min(1, "Confirma tu contraseña."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
