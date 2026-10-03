import { site } from "@/content/site";

type JsonLdNode = Record<string, unknown> & { "@type": string };

/** Public profile pages only: messaging links (WhatsApp, Viber) would expose the phone number. */
const profileLinks = site.socials
  .map((s) => s.href)
  .filter((href) => href.startsWith("https://") && !href.includes("wa.me"));

/** schema.org data that tells search engines who the site belongs to. */
export function siteJsonLd(): { "@context": string; "@graph": JsonLdNode[] } {
  const personId = `${site.url}/#person`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: site.name,
        alternateName: "James Gabarda",
        url: site.url,
        email: `mailto:${site.email}`,
        image: `${site.url}/images/profile2.jpg`,
        jobTitle: "Software Engineer",
        description:
          "AI and software engineer building custom web and mobile apps, business platforms, and AI features.",
        address: { "@type": "PostalAddress", addressRegion: "Bicol", addressCountry: "PH" },
        alumniOf: { "@type": "CollegeOrUniversity", name: site.education.school },
        knowsAbout: ["Software engineering", "Web development", "Mobile app development", "Artificial intelligence", "Next.js", "React", "Flutter", "Ruby on Rails"],
        sameAs: profileLinks,
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        inLanguage: "en",
        publisher: { "@id": personId },
      },
    ],
  };
}

/** Serialises JSON-LD for an inline script, escaping "<" so it can never end the tag early. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
