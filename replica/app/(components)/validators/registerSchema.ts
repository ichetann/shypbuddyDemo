import { z } from "zod";

export const registerSchema = z.object({
  fname: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50),

  lname: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50),

  email: z
    .string()
    .email("Invalid email address"),

  mobileNo: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),

});

export type RegisterInput = z.infer<typeof registerSchema>;
