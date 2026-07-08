import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { templates } from "@db/schema";
import { eq, and } from "drizzle-orm";

export const templateRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select({
        id: templates.id,
        name: templates.name,
        slug: templates.slug,
        description: templates.description,
        isActive: templates.isActive,
        createdAt: templates.createdAt,
      })
      .from(templates)
      .where(eq(templates.isActive, true));
  }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [template] = await db
        .select()
        .from(templates)
        .where(and(eq(templates.slug, input.slug), eq(templates.isActive, true)))
        .limit(1);

      return template ?? null;
    }),
});
