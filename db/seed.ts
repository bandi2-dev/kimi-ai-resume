import { getDb } from "../api/queries/connection";
import { templates } from "./schema";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  // Seed default resume templates
  await db.insert(templates).values([
    {
      name: "Modern",
      slug: "modern",
      description: "Clean, contemporary design with a professional sidebar layout. Perfect for tech and creative roles.",
      cssStyles: `
        .resume-modern { font-family: 'Inter', sans-serif; max-width: 210mm; margin: 0 auto; padding: 40px; background: white; color: #1a1a2e; }
        .resume-modern .header { display: flex; gap: 30px; margin-bottom: 30px; }
        .resume-modern .sidebar { width: 200px; background: #f8f9fa; padding: 20px; border-radius: 8px; }
        .resume-modern .main { flex: 1; }
        .resume-modern h1 { font-size: 28px; font-weight: 700; color: #1a1a2e; margin-bottom: 4px; }
        .resume-modern h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #2dd4bf; margin: 20px 0 10px; border-bottom: 2px solid #2dd4bf; padding-bottom: 4px; }
        .resume-modern h3 { font-size: 16px; font-weight: 600; margin-bottom: 2px; }
        .resume-modern .contact { font-size: 12px; color: #64748b; margin-bottom: 20px; }
        .resume-modern .summary { font-size: 13px; line-height: 1.6; margin-bottom: 20px; color: #334155; }
        .resume-modern .experience-item, .resume-modern .education-item { margin-bottom: 16px; }
        .resume-modern .meta { font-size: 12px; color: #64748b; margin-bottom: 6px; }
        .resume-modern ul { margin: 6px 0; padding-left: 18px; }
        .resume-modern li { font-size: 13px; line-height: 1.5; margin-bottom: 3px; color: #334155; }
        .resume-modern .skills-grid { display: flex; flex-wrap: wrap; gap: 6px; }
        .resume-modern .skill-tag { background: #e0f2fe; color: #0369a1; padding: 3px 10px; border-radius: 12px; font-size: 11px; }
      `,
      isActive: true,
    },
    {
      name: "Classic",
      slug: "classic",
      description: "Traditional, elegant format favored by finance, legal, and executive positions.",
      cssStyles: `
        .resume-classic { font-family: 'Georgia', serif; max-width: 210mm; margin: 0 auto; padding: 50px; background: white; color: #222; }
        .resume-classic h1 { font-size: 26px; font-weight: 400; text-align: center; letter-spacing: 2px; margin-bottom: 8px; color: #1a1a1a; }
        .resume-classic .contact { text-align: center; font-size: 12px; color: #555; margin-bottom: 30px; border-bottom: 1px solid #ccc; padding-bottom: 15px; }
        .resume-classic h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; margin: 25px 0 12px; color: #333; border-bottom: 1px solid #999; padding-bottom: 3px; }
        .resume-classic h3 { font-size: 15px; font-weight: 600; font-style: italic; margin-bottom: 2px; }
        .resume-classic .meta { font-size: 12px; color: #666; margin-bottom: 6px; }
        .resume-classic .summary { font-size: 13px; line-height: 1.6; margin-bottom: 20px; text-align: justify; }
        .resume-classic ul { margin: 6px 0; padding-left: 20px; }
        .resume-classic li { font-size: 13px; line-height: 1.5; margin-bottom: 4px; }
        .resume-classic .skills { font-size: 13px; }
        .resume-classic .experience-item, .resume-classic .education-item { margin-bottom: 18px; }
      `,
      isActive: true,
    },
    {
      name: "Technical",
      slug: "technical",
      description: "Developer-focused layout with prominent skills section and project highlights.",
      cssStyles: `
        .resume-technical { font-family: 'JetBrains Mono', 'Consolas', monospace; max-width: 210mm; margin: 0 auto; padding: 40px; background: white; color: #1e1e2e; }
        .resume-technical h1 { font-size: 24px; font-weight: 700; color: #d4af37; margin-bottom: 4px; }
        .resume-technical .contact { font-size: 12px; color: #6b7280; margin-bottom: 25px; }
        .resume-technical h2 { font-size: 14px; font-weight: 700; color: #2dd4bf; margin: 22px 0 10px; text-transform: uppercase; letter-spacing: 1px; }
        .resume-technical h2::before { content: "# "; color: #2dd4bf; }
        .resume-technical h3 { font-size: 15px; font-weight: 600; margin-bottom: 2px; }
        .resume-technical .meta { font-size: 11px; color: #6b7280; margin-bottom: 6px; }
        .resume-technical .summary { font-size: 12px; line-height: 1.6; margin-bottom: 20px; }
        .resume-technical ul { margin: 6px 0; padding-left: 16px; }
        .resume-technical li { font-size: 12px; line-height: 1.5; margin-bottom: 3px; }
        .resume-technical .skills-grid { display: flex; flex-wrap: wrap; gap: 5px; }
        .resume-technical .skill-tag { background: #1e1e2e; color: #2dd4bf; padding: 3px 8px; border-radius: 4px; font-size: 11px; }
        .resume-technical .experience-item, .resume-technical .education-item { margin-bottom: 16px; }
      `,
      isActive: true,
    },
    {
      name: "Creative",
      slug: "creative",
      description: "Bold, eye-catching design for designers, marketers, and creative professionals.",
      cssStyles: `
        .resume-creative { font-family: 'Space Grotesk', sans-serif; max-width: 210mm; margin: 0 auto; padding: 40px; background: white; color: #2d3436; }
        .resume-creative .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 40px; margin: -40px -40px 30px; border-radius: 0 0 20px 20px; }
        .resume-creative h1 { font-size: 32px; font-weight: 700; margin-bottom: 4px; }
        .resume-creative .contact { font-size: 13px; opacity: 0.9; }
        .resume-creative h2 { font-size: 16px; font-weight: 700; color: #667eea; margin: 25px 0 12px; display: inline-block; border-bottom: 3px solid #764ba2; padding-bottom: 2px; }
        .resume-creative h3 { font-size: 16px; font-weight: 600; margin-bottom: 2px; }
        .resume-creative .meta { font-size: 12px; color: #636e72; margin-bottom: 6px; }
        .resume-creative .summary { font-size: 13px; line-height: 1.7; margin-bottom: 20px; }
        .resume-creative ul { margin: 6px 0; padding-left: 18px; }
        .resume-creative li { font-size: 13px; line-height: 1.5; margin-bottom: 4px; }
        .resume-creative .skills-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .resume-creative .skill-tag { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 5px 14px; border-radius: 20px; font-size: 11px; font-weight: 500; }
        .resume-creative .experience-item, .resume-creative .education-item { margin-bottom: 18px; }
      `,
      isActive: true,
    },
  ]);

  console.log("Done. Seeded 4 default templates.");
  process.exit(0);
}

seed();
