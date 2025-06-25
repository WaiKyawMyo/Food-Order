import { z } from "zod";


export const tableSchema= z.object({
  table_No: z.number(),
  capacity: z.number(),
})