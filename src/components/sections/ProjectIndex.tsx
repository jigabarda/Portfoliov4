import Image from "next/image";
import { ArrowUpRight } from "@/components/icons";
import { site } from "@/content/site";
import type { Project } from "@/content/types";

export default function ProjectIndex({ projects }: { projects: Project[] }) {
  return (
    <div className="index-block">
      <div className="index-top">
        <h3>Projects at a glance</h3>
      </div>

      {/* Rows stay plain links: role="listitem" would hide them from screen readers' links list. */}
      <div className="index">
        <div className="index-head" aria-hidden="true">
          <span />
          <span className="kicker">Year</span>
          <span className="kicker">Project</span>
          <span className="kicker ix-type">Type</span>
          <span className="kicker ix-stack">Stack</span>
          <span className="kicker">Link</span>
        </div>

        {projects.map((p) => {
          const href = p.live ?? p.repo;
          return (
            <a key={p.id} className="index-row reveal" href={href} target="_blank" rel="noopener noreferrer">
              {p.image ? (
                <span className="ix-thumb"><Image src={p.image.src} alt="" width={176} height={110} /></span>
              ) : (
                <span className="ix-thumb ix-thumb-empty" aria-hidden="true">{p.thumbInitials}</span>
              )}
              <span className="ix-year">{p.year}</span>
              <span className="ix-name">{p.title}</span>
              <span className="ix-type">{p.type}</span>
              <span className="ix-stack">{(p.indexStack ?? p.stack.slice(0, 3)).join(", ")}</span>
              <span className="ix-go">{p.live ? "Live" : "Code"} <ArrowUpRight size={12} /></span>
            </a>
          );
        })}
      </div>

      <div className="index-foot">
        <a className="text-link index-more" href={site.githubUrl} target="_blank" rel="noopener noreferrer">More on GitHub <ArrowUpRight size={12} /></a>
      </div>
    </div>
  );
}
