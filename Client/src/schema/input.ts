import { z } from "zod/v4";

export const LoginSchema = z.object({
  email:z.string().email({ message: "Invalid email address." }),
  password: z.string()
});