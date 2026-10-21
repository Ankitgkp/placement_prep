import z from 'zod';

export const SignupSchema = z.object({
    firstName: z.string(),
    middleName: z.string(),
    lastName: z.string(),
    email: z.email(),
    password: z.string().min(8),
    phone: z.string()
})

export type userSignupSchema = z.infer<typeof SignupSchema>;