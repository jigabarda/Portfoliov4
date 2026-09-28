type IconProps = { size?: number };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const ArrowRight = ({ size = 16 }: IconProps) => (
  <svg {...base} width={size} height={size} strokeWidth={2}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

export const ArrowUpRight = ({ size = 13 }: IconProps) => (
  <svg {...base} width={size} height={size} strokeWidth={2}><path d="M7 17 17 7M8 7h9v9" /></svg>
);

export const ChevronDown = ({ size = 12 }: IconProps) => (
  <svg {...base} width={size} height={size} strokeWidth={2}><path d="m6 9 6 6 6-6" /></svg>
);

export const Close = ({ size = 16 }: IconProps) => (
  <svg {...base} width={size} height={size} strokeWidth={2}><path d="M6 6l12 12M18 6 6 18" /></svg>
);

export const Menu = ({ size = 18 }: IconProps) => (
  <svg {...base} width={size} height={size} strokeWidth={1.8}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);

/** Moon and Sun carry the mockup's classes; CSS tokens decide which one shows. */
export const Moon = ({ size = 18 }: IconProps) => (
  <svg {...base} className="i-moon" width={size} height={size} strokeWidth={1.8}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
);

export const Sun = ({ size = 18 }: IconProps) => (
  <svg {...base} className="i-sun" width={size} height={size} strokeWidth={1.8}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);
