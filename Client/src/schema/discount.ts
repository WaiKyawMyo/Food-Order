import { z } from "zod";


export const discountSchema= z.object({
  name: z.string(),
  persent: z.number(),
})