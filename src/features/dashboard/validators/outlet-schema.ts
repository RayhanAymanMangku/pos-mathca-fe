import * as z from "zod";

export const outletSchema = z.object({
    name: z.string().min(1, "Name is required"),
    address: z.string().min(1, "Address is required"),
    status: z.boolean(),
});

export type OutletFormValues = z.infer<typeof outletSchema>;
