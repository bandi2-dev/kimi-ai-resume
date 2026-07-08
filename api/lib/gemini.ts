import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const MODEL_NAME = "gemini-2.5-pro-latest";

// Zod schemas for validation
const analysisSchema = z.object({
  overallScore: z.number().min(0).max(100),
  atsScore: z.number().min(0).max(100),
  keywordScore: z.number().min(0).max(100),
  impactScore: z.number().min(0).max(100),
  readabilityScore: z.number().min(0).max(100),
  formatScore: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  suggestions: z.array(
    z.object({
      id: z.string(),
      category: z.enum(["ATS", "Content", "Grammar", "Structure"]),
      severity: z.enum(["Critical", "Warning", "Info"]),
      title: z.string(),
      description: z.string(),
      originalText: z.string().nullable(),
      suggestedText: z.string().nullable(),
    })
  ),
  missingSkills: z.array(z.string()),
  detectedSkills: z.array(z.string()),
  estimatedRole: z.string(),
});

const optimizationSchema = z.object({
  optimizedResume: z.string(),
  changesMade: z.array(z.string()),
  improvements: z.object({
    impactStatements: z.number(),
    quantifiedMetrics: z.number(),
    keywordOptimization: z.number(),
    readability: z.number(),
  }),
});

const jobMatchSchema = z.object({
  matchScore: z.number().min(0).max(100),
  matchedKeywords: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  recommendations: z.array(z.string()),
  tailoredResume: z.string(),
});

const ANALYZER_PROMPT = `You are an elite technical recruiter and resume optimization expert with 20 years of experience. Analyze the following resume and provide a detailed breakdown.

Focus on:
1. ATS compatibility (formatting, keyword density, section headers)
2. Keyword density (relevant industry terms, skills mentioned)
3. Impact-oriented language (quantified achievements, action verbs)
4. Readability (clarity, conciseness, formatting)
5. Professional formatting (consistent style, appropriate length)

Return ONLY valid JSON matching the specified schema. Do not include markdown code blocks or any text outside the JSON.

Required JSON structure:
{
  "overallScore": 0-100,
  "atsScore": 0-100,
  "keywordScore": 0-100,
  "impactScore": 0-100,
  "readabilityScore": 0-100,
  "formatScore": 0-100,
  "strengths": ["string"],
  "weaknesses": ["string"],
  "suggestions": [
    {
      "id": "unique-string",
      "category": "ATS|Content|Grammar|Structure",
      "severity": "Critical|Warning|Info",
      "title": "Short title",
      "description": "Detailed explanation",
      "originalText": "original or null",
      "suggestedText": "suggestion or null"
    }
  ],
  "missingSkills": ["skill1", "skill2"],
  "detectedSkills": ["skill3", "skill4"],
  "estimatedRole": "Most likely job title"
}`;

const OPTIMIZER_PROMPT = `You are a senior career strategist and executive resume writer. Rewrite the following resume to maximize its impact and ATS compatibility.

Guidelines:
- Use strong action verbs at the start of every bullet point
- Quantify achievements with specific numbers, percentages, and dollar amounts
- Optimize for ATS keywords relevant to the target role
- Ensure professional formatting in Markdown
- Maintain the same general structure but improve every section
- Add missing sections if needed (Summary, Skills, etc.)

Return ONLY valid JSON with this exact structure:
{
  "optimizedResume": "Full markdown resume text here",
  "changesMade": ["List of specific changes made"],
  "improvements": {
    "impactStatements": number,
    "quantifiedMetrics": number,
    "keywordOptimization": number,
    "readability": number
  }
}`;

const MATCHER_PROMPT = `You are a job matching specialist. Compare the resume against the job description and calculate a match score.

Analyze:
1. Keyword overlap (skills, technologies, qualifications)
2. Experience alignment (years, seniority level)
3. Domain expertise match
4. Missing qualifications or skills

Provide a tailored version of the resume optimized for this specific job.

Return ONLY valid JSON with this exact structure:
{
  "matchScore": 0-100,
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["missing1", "missing2"],
  "recommendations": ["Actionable recommendation 1"],
  "tailoredResume": "Full tailored markdown resume"
}`;

function zodTypeToGeminiSchema(zodType: z.core.$ZodType): object {
  if (zodType instanceof z.ZodString) {
    return { type: Type.STRING };
  }
  if (zodType instanceof z.ZodNumber) {
    return { type: Type.NUMBER };
  }
  if (zodType instanceof z.ZodBoolean) {
    return { type: Type.BOOLEAN };
  }
  if (zodType instanceof z.ZodArray) {
    const arr = zodType as z.ZodArray<z.core.$ZodType>;
    const itemSchema = zodTypeToGeminiSchema(arr.element);
    return { type: Type.ARRAY, items: itemSchema };
  }
  if (zodType instanceof z.ZodNullable || zodType instanceof z.ZodOptional) {
    return zodTypeToGeminiSchema(zodType.unwrap());
  }
  if (zodType instanceof z.ZodObject) {
    const obj = zodType as z.ZodObject<Record<string, z.core.$ZodType>>;
    const shape = obj.shape;
    const properties: Record<string, object> = {};
    const required: string[] = [];
    for (const [key, value] of Object.entries(shape)) {
      const schema = zodTypeToGeminiSchema(value);
      properties[key] = schema;
      required.push(key);
    }
    return { type: Type.OBJECT, properties, required };
  }
  if (zodType instanceof z.ZodEnum) {
    return { type: Type.STRING, enum: zodType.options as string[] };
  }
  return { type: Type.STRING };
}

function buildGeminiSchema(zodSchema: z.ZodObject<Record<string, z.ZodTypeAny>>): object {
  return zodTypeToGeminiSchema(zodSchema);
}

async function callGemini(systemPrompt: string, userContent: string, schema: z.ZodObject<Record<string, z.ZodTypeAny>>) {
  const responseSchema = buildGeminiSchema(schema);

  const result = await genAI.models.generateContent({
    model: MODEL_NAME,
    contents: [{ role: "user", parts: [{ text: systemPrompt + "\n\n" + userContent }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema as never,
    },
  });

  const text = result.text;
  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  const parsed = JSON.parse(text);
  return schema.parse(parsed);
}

export async function analyzeResume(resumeText: string) {
  return callGemini(ANALYZER_PROMPT, "RESUME:\n" + resumeText, analysisSchema);
}

export async function optimizeResume(resumeText: string, template?: string) {
  const prompt = OPTIMIZER_PROMPT + (template ? `\n\nPreferred template style: ${template}` : "");
  return callGemini(prompt, "RESUME:\n" + resumeText, optimizationSchema);
}

export async function matchJob(resumeText: string, jobDescription: string) {
  return callGemini(
    MATCHER_PROMPT,
    "RESUME:\n" + resumeText + "\n\nJOB DESCRIPTION:\n" + jobDescription,
    jobMatchSchema
  );
}
