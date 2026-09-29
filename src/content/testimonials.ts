import type { Testimonial } from "./types";

export const testimonials: Testimonial[] = [
  {
    id: "lgu-draft",
    // DRAFT: wording not yet confirmed by the client. Keep approved: false until they sign off.
    quote: "The team took the time to learn how our office actually works, then turned our paper-based certificate requests into a system our staff rely on every day. Transactions are faster, errors are down, and the dashboards finally show us how our barangay is being served.",
    name: "Barangay official",
    role: "Local government unit, Philippines",
    project: "Barangay Management System, built with Appnado IT Solutions",
    approved: false,
  },
];
