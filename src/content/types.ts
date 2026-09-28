export type SiteLink = { label: string; href: string; external?: boolean };

export type ProjectImage = { src: string; alt: string; width: number; height: number; position?: string };

export type Project = {
  id: string;
  title: string;
  year: string;
  /** Index "Type" column, e.g. "Web + Mobile". */
  type: string;
  /** Ordered most important first. Cards show the first 4; the index shows the first 3. */
  stack: string[];
  featured: boolean;
  live?: string;
  repo?: string;
  image?: ProjectImage;
  /** Shown in the index thumbnail when there is no image. */
  thumbInitials?: string;
  /** Featured-only fields (the content test enforces them). */
  category?: string;
  summary?: string;
  platforms?: string;
  users?: string;
  detail?: { overview: string[]; features: string[] };
};

export type Role = {
  id: string;
  mark: string;
  org: string;
  role: string;
  /** YYYY-MM */
  start: string;
  /** YYYY-MM; omitted for current roles. */
  end?: string;
  summary: string;
  more: string;
  tags: string[];
};

export type Service = { title: string; description: string; includes: string[] };

export type ProcessStep = { num: string; title: string; body: string; time: string };

export type StackGroup = { label: string; items: string[] };

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  project: string;
  /** Only approved quotes render. Never approve a quote the client has not confirmed. */
  approved: boolean;
};
