import type { SiteLink } from "./types";

const PHONE = "639566297372";

export const site = {
  name: "James Ivan Gabarda",
  brand: "JIGSTACK",
  email: "jamesivangabarda8@gmail.com",
  cvUrl: "https://drive.google.com/file/d/1v-GBqVPGlbKYV-sEwNu10gzNxMgTdDFS/view",
  githubUrl: "https://github.com/jigabarda",
  status: "Available for new projects",
  heroLede: "I design and build fast, reliable web and mobile products, from the first sketch to launch day.",
  location: "Bicol, PH",
  timeZone: "Asia/Manila",
  timeZoneLabel: "GMT+8",
  now: "Software Engineer, LEAD Management Pte Ltd",
  focus: "Web, mobile & AI products",
  navCta: "Hire me",
  employers: ["LEAD Management Pte Ltd", "Appnado IT Solutions", "Pru Life UK", "Independent clients"],
  bio: [
    "I'm a full-stack developer based in Bicol, Philippines. I build web and mobile products end to end, from the database schema to the last pixel of the interface.",
    "I've shipped sales platforms, real-time broadcast systems, an AI career coach, and a fingerprint door lock running on a Raspberry Pi. I care about clean architecture, fast interfaces, and code the next developer can read.",
    "Right now I'm a Software Engineer at LEAD Management Pte Ltd and a Full Stack Developer at Appnado IT Solutions, and I take on freelance projects on the side.",
  ],
  stats: [
    { label: "Projects completed", value: "10+" },
    { label: "Writing code since", value: "2019" },
    { label: "Platforms: web, mobile, desktop, IoT", value: "4" },
  ],
  experienceLede: "Writing code since 2019, shipping it professionally since 2023.",
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
