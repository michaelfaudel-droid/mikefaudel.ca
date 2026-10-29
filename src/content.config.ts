import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const work = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/work" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      cardTitle: z.string(),
      summary: z.string(),
      company: z.string(),
      role: z.string(),
      duration: z.string(),
      cover: image(),
      coverAlt: z.string(),
      stats: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
      tint: z.enum(["blue", "purple", "green", "brown", "red"]).default("blue"),
      order: z.number(),
      featured: z.boolean().default(true),
    }),
});

export const collections = { work };
