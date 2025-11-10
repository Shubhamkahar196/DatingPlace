import z from 'zod'

export const SignupSchema = z.object({
  name: z.string().min(3, "Name must be more than 3 characters"),
  email: z.string().email(),
  password: z.string().min(5, 'Password must be more than 5 characters'),
  age: z.coerce.number(),
  gender: z.enum(["male", "female"]),
  genderPreference: z.enum(["male", "female", "both"]),
  bio: z.string().optional(),
  image: z.string().optional(),
  likes: z.array(z.string()).optional(),
  dislikes: z.array(z.string()).optional(),
});

export const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5, "Password must be more than 5 characters"),
});