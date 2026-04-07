import { z } from "zod";

export const userSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
    currentPassword: z.string().optional().or(z.literal("")),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    role: z.enum(["ADMIN", "DRIVER"]),
    outletId: z.string().optional().or(z.literal("")),
});

export type UserFormValues = z.infer<typeof userSchema>;
