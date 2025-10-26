import z from 'zod'

export const SignupSchema = z.object({
  name: z.string().min(3, "Name must be more than 3 characters"),
  email: z.string().email(),
  password: z.string().min(5, 'Password must be more than 5 characters'),
  age: z.number(),
  gender: z.enum(["male", "female"]),
  genderPreference: z.enum(["male", "female"]),
});

export const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5, "Password must be more than 5 characters"),
});