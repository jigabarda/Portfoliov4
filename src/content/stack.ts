import type { StackGroup } from "./types";

export const stackGroups: StackGroup[] = [
  { label: "Languages", items: ["TypeScript", "JavaScript", "Python", "C#", "Java", "PHP", "Ruby", "Dart", "Go", "HTML", "CSS"] },
  { label: "Frameworks", items: ["React", "Next.js", "React Native", "Flutter", ".NET", "Laravel", "Ruby on Rails", "Tailwind CSS", "Vite", "Riverpod", "GoRouter"] },
  { label: "Backend", items: ["Node.js", "REST APIs", "Prisma ORM", "JWT", "GitHub OAuth", "Supabase Auth", "Clerk"] },
  { label: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB", "SQLite", "Firebase", "Supabase"] },
  { label: "Cloud and DevOps", items: ["AWS", "Docker", "CI/CD"] },
  { label: "AI and LLMs", items: ["OpenAI", "Claude", "Groq", "Ollama"] },
  { label: "Integrations", items: ["WhatsApp Business API", "Twilio", "Firebase Cloud Messaging", "Third-party APIs"] },
  { label: "Tools", items: ["Figma", "Webflow", "Git", "GitHub", "Bitbucket"] },
];
