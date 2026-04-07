import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  basePrice: z.coerce.number().min(0, "Base price must be a positive number"),
  sellPrice: z.coerce.number().min(0, "Sell price must be a positive number"),
  imageUrl: z.string().url("Please enter a valid image URL").or(z.literal("")),
  categoryId: z.string().min(1, "Category is required"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
