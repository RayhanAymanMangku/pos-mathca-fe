import * as z from 'zod'


const formLoginSchema = z.object({
    email: z
        .string()
        .email("Email format is not valid.")
        .min(5, "Email must be at least 5 characters."),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters.")
        .max(20, "Password must be at most 20 characters. ")
});


export {
    formLoginSchema
}