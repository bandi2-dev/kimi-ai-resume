import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  bigint,
  json,
  boolean,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const analyses = mysqlTable("analyses", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }),
  resumeText: text("resume_text").notNull(),
  fileName: varchar("file_name", { length: 255 }),
  overallScore: int("overall_score"),
  atsScore: int("ats_score"),
  keywordScore: int("keyword_score"),
  impactScore: int("impact_score"),
  readabilityScore: int("readability_score"),
  formatScore: int("format_score"),
  strengths: json("strengths").$type<string[]>(),
  weaknesses: json("weaknesses").$type<string[]>(),
  suggestions: json("suggestions").$type<Suggestion[]>(),
  missingSkills: json("missing_skills").$type<string[]>(),
  detectedSkills: json("detected_skills").$type<string[]>(),
  estimatedRole: varchar("estimated_role", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const optimizedResumes = mysqlTable("optimized_resumes", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }),
  originalAnalysisId: bigint("original_analysis_id", { mode: "number", unsigned: true }),
  optimizedContent: text("optimized_content").notNull(),
  changesMade: json("changes_made").$type<string[]>(),
  templateUsed: varchar("template_used", { length: 50 }),
  improvements: json("improvements").$type<Improvements>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const jobMatches = mysqlTable("job_matches", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }),
  analysisId: bigint("analysis_id", { mode: "number", unsigned: true }),
  resumeText: text("resume_text").notNull(),
  jobDescription: text("job_description").notNull(),
  matchScore: int("match_score"),
  matchedKeywords: json("matched_keywords").$type<string[]>(),
  missingKeywords: json("missing_keywords").$type<string[]>(),
  recommendations: json("recommendations").$type<string[]>(),
  tailoredResume: text("tailored_resume"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const templates = mysqlTable("templates", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  description: text("description"),
  cssStyles: text("css_styles"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export interface Suggestion {
  id: string;
  category: "ATS" | "Content" | "Grammar" | "Structure";
  severity: "Critical" | "Warning" | "Info";
  title: string;
  description: string;
  originalText: string | null;
  suggestedText: string | null;
}

export interface Improvements {
  impactStatements: number;
  quantifiedMetrics: number;
  keywordOptimization: number;
  readability: number;
}

export type Analysis = typeof analyses.$inferSelect;
export type InsertAnalysis = typeof analyses.$inferInsert;
export type OptimizedResume = typeof optimizedResumes.$inferSelect;
export type InsertOptimizedResume = typeof optimizedResumes.$inferInsert;
export type JobMatch = typeof jobMatches.$inferSelect;
export type InsertJobMatch = typeof jobMatches.$inferInsert;
export type Template = typeof templates.$inferSelect;
export type InsertTemplate = typeof templates.$inferInsert;
