import { z } from "zod";

export const addressSchema = z.object({
  tag: z
    .string()
    .min(1, "Tag is required"),

  isDefault: z.boolean(),

  mobileNo: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid mobile number"),

  street: z
    .string()
    .min(5, "Address must be at least 5 characters"),

  landmark: z
    .string()
    .optional(),

  pincode: z
    .number()
    .int()
    .min(100000, "Invalid pincode")
    .max(999999, "Invalid pincode"),

  city: z
    .string()
    .min(2, "City is required"),

  state: z
    .string()
    .min(2, "State is required"),

  country: z
    .string()
    .min(2, "Country is required"),

  // selledId:z.
  // string()
});

export type AddressInput = z.infer<typeof addressSchema>;
