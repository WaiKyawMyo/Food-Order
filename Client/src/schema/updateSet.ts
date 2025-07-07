import { z } from "zod/v4";


export const UpdateSetSchema = z.object({
 
  name: z.string().min(1, "Name required"),
  price: z.number().positive("Price must be positive"),
  // 👇 image is optional
  image: z
    .custom<FileList | undefined>(
      (files) => files === undefined || files instanceof FileList
    )
    .refine(
      (files) =>
        !files ||
        files.length === 0 || // No file selected is OK
        Array.from(files).every((file) =>
          ["image/png", "image/jpeg", "image/jpg", "image/gif"].includes(file.type)
        ),
      { message: "Only image files are allowed." }
    )
    .optional(),
});