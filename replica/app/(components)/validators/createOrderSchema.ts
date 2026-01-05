import { z } from "zod";


export const buyerSchema = z.object({
  name: z.string().min(2, "Buyer name is required"),
  mobileNo: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid mobile number"),
  alternateNo: z
    .string()
    .regex(/^[6-9]\d{9}$/)
    .optional()
    .or(z.literal("")),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
});


export const buyerAddressSchema = z.object({
  street: z.string().min(5, "Complete address is required"),
  landmark: z.string().optional(),
  pincode: z
    .string()
    .regex(/^\d{6}$/, "Pincode must be 6 digits"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
});


export const productSchema = z.object({
  pname: z.string().min(2, "Product name is required"),
  category: z.string().min(2, "Category is required"),
  sku: z.string().optional(),
  hsn: z.string().optional(),
  quantity: z
    .number()
    .int()
    .positive("Quantity must be greater than 0"),
  unitPrice: z
    .number()
    .positive("Unit price must be greater than 0"),
});


export const packageSchema = z.object({
  physicalWeight: z
    .number()
    .positive("Weight must be greater than 0"),
  length: z.number().positive(),
  breadth: z.number().positive(),
  height: z.number().positive(),
});


export const createOrderSchema = z.object({
  pickupAddressId: z.string().uuid("Invalid pickup address"),
  rtoAddressSameAsPickup: z.boolean(),

  buyer: buyerSchema,
  buyerAddress: buyerAddressSchema,

  products: z
    .array(productSchema)
    .min(1, "At least one product is required"),

  package: packageSchema,

  dangerous: z.boolean(),

  payment: z
  .enum(["PREPAID", "COD"])
  .refine(val => val !== undefined, {
    message: "Payment method is required",
  }),

  totalOrderValue: z
    .number()
    .positive("Total order value must be greater than 0"),
});
