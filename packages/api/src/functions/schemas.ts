import { z } from 'zod';

export const createGenerationSchema = z.object({
  image: z.string(),
  imageType: z.string(),
});

export type CreateGenerationSchema = z.infer<typeof createGenerationSchema>;
