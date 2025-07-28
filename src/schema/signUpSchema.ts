import z from "zod";

export const signupSchema = z.object({
  name: z.string("Name is required").min(1, "Name cannot be empty"),
  username: z
    .string("Username is required")
    .min(5, "Username must be at least 5 characters long"),
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

export type SignupSchema = z.infer<typeof signupSchema>;
