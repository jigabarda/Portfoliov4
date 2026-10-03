import type { SiteLink } from "./types";

const PHONE = "639566297372";

export const site = {
  name: "James Ivan Gabarda",
  brand: "JIGSTACK",
  /** Canonical origin. The apex domain and the vercel.app URL both redirect or duplicate this. */
  url: "https://www.jamesgabarda.com",
  email: "hello@jamesgabarda.com",
  githubUrl: "https://github.com/jigabarda",
  status: "Available for new projects",
  heroLede: "I design and build fast, reliable web and mobile products, from the first sketch to launch day.",
  location: "Bicol, PH",
  timeZone: "Asia/Manila",
  timeZoneLabel: "GMT+8",
  now: "Software Engineer, LEAD Management Pte Ltd",
  focus: "Web, mobile & AI products",
  navCta: "Hire me",
  education: { degree: "BS Information Technology", school: "Camarines Sur Polytechnic Colleges", year: "2025" },
  employers: ["LEAD Management Pte Ltd", "Appnado IT Solutions", "Pru Life UK", "Independent clients"],
  bio: [
    "I'm a software engineer based in Bicol, Philippines. I build web, mobile, and AI products end to end, from the database schema to the last pixel of the interface.",
    "I build AI-powered applications, sales and business platforms, and management systems: software that automates the busywork, keeps records in one place, and helps teams make better decisions. I care about clean architecture, fast interfaces, and code the next developer can read.",
    "Right now I'm a Software Engineer at LEAD Management Pte Ltd and a Full Stack Developer at Appnado IT Solutions, and I take on freelance projects on the side.",
  ],
  stats: [
    { label: "Years of experience", value: "3+" },
    { label: "Projects completed", value: "10+" },
    { label: "Platforms: web, mobile, desktop, IoT", value: "4" },
  ],
  experienceLede: "3+ years shipping software professionally, and writing code since 2019.",
  certificates: [
    { label: "MERN Stack Bootcamp, Udemy", href: "https://udemy-certificate.s3.amazonaws.com/image/UC-f008d853-c296-4f81-9358-4c9f51df5a01.jpg?v=1755337118000", external: true },
    { label: "Foundations of Web Development, Udemy", href: "https://udemy-certificate.s3.amazonaws.com/image/UC-e38cebd7-e5c9-4c4d-bc92-5e01f8fbdfdf.jpg?v=1733299197000", external: true },
    { label: "More on LinkedIn", href: "https://www.linkedin.com/in/james-ivan-gabarda/", external: true },
  ] satisfies SiteLink[],
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/james-ivan-gabarda/", external: true },
    { label: "GitHub", href: "https://github.com/jigabarda", external: true },
    { label: "Facebook", href: "https://www.facebook.com/Jeyms.Aybannnnnn", external: true },
    { label: "WhatsApp", href: `https://wa.me/${PHONE}?text=${encodeURIComponent("Hi James, I'd like to talk about a project.")}`, external: true },
    // Opens the Viber app directly; does nothing where Viber is not installed.
    { label: "Viber", href: `viber://chat?number=%2B${PHONE}` },
  ] satisfies SiteLink[],
};

/** Nav order matches the page order. */
export const NAV_LINKS = [
  { id: "projects", label: "Projects" },
  { id: "services", label: "Services" },
  { id: "process", label: "Process" },
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
] as const;
