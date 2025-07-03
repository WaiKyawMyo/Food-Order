import { z } from "zod/v4";

export const SetSchema = z.object({
   name: z.string().min(1, "Name required"),
  
  price: z.number().positive("Price must be positive"),
    
    image: z.custom<FileList>((files) => files instanceof FileList && files.length > 0, {
    message: "Please select at least one file.",
  })
  .refine(
    (files) =>
      Array.from(files as FileList).every((file) =>
        ["image/png", "image/jpeg", "image/jpg", "image/gif"].includes(file.type)
      ),
    { message: "Only image files are allowed." }
  )
});
