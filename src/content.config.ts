import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const work = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/work" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    company: z.string(),
    role: z.string(),
    year: z.string(),
    tags: z.array(z.string()).default([]),
    tint: z.enum(["blue", "purple", "green", "brown", "red"]).default("blue"),
    order: z.number(),
    featured: z.boolean().default(true),
  }),
});

export const collections = { work };
