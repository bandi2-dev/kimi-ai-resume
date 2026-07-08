import { z } from "zod";
import { createRouter, publicQuery, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { analyses, optimizedResumes, jobMatches } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import { analyzeResume, optimizeResume, matchJob } from "../lib/gemini";
import { TRPCError } from "@trpc/server";

export const resumeRouter = createRouter({
  analyze: publicQuery
    .input(
      z.object({
        resumeText: z.string().min(50, "Resume must be at least 50 characters").max(10000, "Resume must be less than 10,000 characters"),
        fileName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await analyzeResume(input.resumeText);

        // Save to database
        const db = getDb();
        await db.insert(analyses).values({
          resumeText: input.resumeText,
          fileName: input.fileName,
          overallScore: result.overallScore,
          atsScore: result.atsScore,
          keywordScore: result.keywordScore,
          impactScore: result.impactScore,
          readabilityScore: result.readabilityScore,
          formatScore: result.formatScore,
          strengths: result.strengths,
          weaknesses: result.weaknesses,
          suggestions: result.suggestions,
          missingSkills: result.missingSkills,
          detectedSkills: result.detectedSkills,
          estimatedRole: result.estimatedRole,
        } as never);

        return result;
      } catch (error) {
        console.error("Analysis error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to analyze resume. Please try again.",
        });
      }
    }),

  optimize: publicQuery
    .input(
      z.object({
        resumeText: z.string().min(50).max(10000),
        template: z.string().default("modern"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await optimizeResume(input.resumeText, input.template);

        // Save to database
        const db = getDb();
        await db.insert(optimizedResumes).values({
          optimizedContent: result.optimizedResume,
          changesMade: result.changesMade,
          templateUsed: input.template,
          improvements: result.improvements,
        } as never);

        return result;
      } catch (error) {
        console.error("Optimization error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to optimize resume. Please try again.",
        });
      }
    }),

  jobMatch: publicQuery
    .input(
      z.object({
        resumeText: z.string().min(50).max(10000),
        jobDescription: z.string().min(50).max(5000),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await matchJob(input.resumeText, input.jobDescription);

        // Save to database
        const db = getDb();
        await db.insert(jobMatches).values({
          resumeText: input.resumeText,
          jobDescription: input.jobDescription,
          matchScore: result.matchScore,
          matchedKeywords: result.matchedKeywords,
          missingKeywords: result.missingKeywords,
          recommendations: result.recommendations,
          tailoredResume: result.tailoredResume,
        } as never);

        return result;
      } catch (error) {
        console.error("Job match error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to match job. Please try again.",
        });
      }
    }),

  getAnalysis: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = getDb();
      const [analysis] = await db
        .select()
        .from(analyses)
        .where(eq(analyses.id, input.id))
        .limit(1);

      if (!analysis) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Analysis not found" });
      }

      // Check ownership if user is logged in
      if (ctx.user && analysis.userId && analysis.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }

      return analysis;
    }),

  getOptimizedResume: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = getDb();
      const [resume] = await db
        .select()
        .from(optimizedResumes)
        .where(eq(optimizedResumes.id, input.id))
        .limit(1);

      if (!resume) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Optimized resume not found" });
      }

      if (ctx.user && resume.userId && resume.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }

      return resume;
    }),

  getJobMatch: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = getDb();
      const [match] = await db
        .select()
        .from(jobMatches)
        .where(eq(jobMatches.id, input.id))
        .limit(1);

      if (!match) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Job match not found" });
      }

      if (ctx.user && match.userId && match.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }

      return match;
    }),

  listAnalyses: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db
      .select()
      .from(analyses)
      .where(eq(analyses.userId, ctx.user.id))
      .orderBy(desc(analyses.createdAt));
  }),
});
