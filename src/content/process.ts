import type { ProcessStep } from "./types";

export const processSteps: ProcessStep[] = [
  { num: "01", title: "Discover", body: "We talk through your goals, users, and budget. You get a written scope and a fixed quote.", time: "2–3 days" },
  { num: "02", title: "Design", body: "Wireframes, then polished screens in Figma that you can click through and comment on.", time: "About 1 week" },
  { num: "03", title: "Build", body: "Weekly demos on a live preview link, so you can watch the product take shape.", time: "2–6 weeks" },
  { num: "04", title: "Launch", body: "Deployment, monitoring, and a handover with documentation. I stay available for fixes.", time: "Ongoing" },
];

export const PROCESS_NOTE = "Timelines are typical for a small to mid-sized project.";
