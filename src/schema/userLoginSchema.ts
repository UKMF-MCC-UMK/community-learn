import z from "zod";

export const loginSchema = z.object({
  username: z
    .string("Username is required")
    .min(5, "Username must be at least 5 characters long"),
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>
