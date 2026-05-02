import { defineCollection, z } from 'astro:content';

const postSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  pubDate: z.string(),
  updatedDate: z.string().optional(),
  category: z.string(),
  tags: z.array(z.string()).optional(),
  image: z.string().optional(),
  draft: z.boolean().optional().default(false),
  // Jugadores
  nationality: z.string().optional(),
  birthDate: z.string().optional(),
  worldRanking: z.number().optional(),
  // Gomas / Maderas / Palas
  brand: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
});

export const collections = {
  gomas: defineCollection({ type: 'content', schema: postSchema }),
  maderas: defineCollection({ type: 'content', schema: postSchema }),
  palas: defineCollection({ type: 'content', schema: postSchema }),
  tecnica: defineCollection({ type: 'content', schema: postSchema }),
  guias: defineCollection({ type: 'content', schema: postSchema }),
  jugadores: defineCollection({ type: 'content', schema: postSchema }),
  materiales: defineCollection({ type: 'content', schema: postSchema }),
  recursos: defineCollection({ type: 'content', schema: postSchema }),
};
