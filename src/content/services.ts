import type { Service } from "./types";

export const services: Service[] = [
  { title: "Custom software development", description: "Software built around how your business actually works, so your team stops fighting spreadsheets and paperwork.", includes: ["Business systems", "Internal tools", "Desktop apps"] },
  { title: "Web development", description: "Fast, reliable web apps and sites, from admin dashboards to full products your customers use.", includes: ["Web apps", "Dashboards", "Business websites"] },
  { title: "Mobile app development", description: "iOS and Android apps from one codebase, built to keep working even when the internet doesn't.", includes: ["iOS", "Android", "Offline-first apps"] },
  { title: "AI integration", description: "AI features built into your product that save your team real hours, on cloud or private local models.", includes: ["Assistants", "Document analysis", "Automated reviews"] },
  { title: "UI/UX and web design", description: "Clear, easy-to-use interfaces, designed and prototyped before any code is written.", includes: ["Web design", "Wireframes", "Clickable prototypes"] },
  { title: "Testing and maintenance", description: "Catch bugs before your users do, then keep your app fast, secure, and up to date after launch.", includes: ["Software testing", "Bug fixes", "Upgrades"] },
];

/** Words for the scrolling band between Toolkit and Testimonials. */
export const SERVICE_BAND = ["Custom software", "Web development", "Mobile apps", "AI integration", "UI/UX design", "Testing & maintenance"];
