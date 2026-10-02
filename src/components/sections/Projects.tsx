import Image from "next/image";
import { ArrowUpRight } from "@/components/icons";
import OpenProjectButton from "@/components/project/OpenProjectButton";
import SectionHead from "@/components/ui/SectionHead";
import { featuredProjects, projects } from "@/content/projects";
import type { Project } from "@/content/types";
import { splitTags } from "@/lib/tags";
import ProjectIndex from "./ProjectIndex";

function FeaturedProject({ project: p }: { project: Project }) {
  const { shown, hidden } = splitTags(p.stack, 4, 1);
  return (
    <article className="feature reveal">
      <OpenProjectButton projectId={p.id} className="feature-media" ariaLabel={`View ${p.title} details`}>
        {p.image ? (
          <Image
            src={p.image.src}
            alt={p.image.alt}
            fill
            sizes="(max-width: 860px) 100vw, 50vw"
            style={p.image.position ? { objectPosition: p.image.position } : undefined}
          />
        ) : null}
      </OpenProjectButton>

      <div className="feature-body">
        <p className="feature-meta"><span>{p.year}</span><span>{p.category}</span></p>
        <h3 className="feature-title">{p.title}</h3>
        <p className="feature-desc">{p.summary}</p>
        <dl className="facts">
          <div><dt className="kicker">Platforms</dt><dd>{p.platforms}</dd></div>
          {p.users ? <div><dt className="kicker">Users</dt><dd>{p.users}</dd></div> : null}
        </dl>
        <ul className="tags">
          {shown.map((t) => <li key={t}>{t}</li>)}
          {hidden.length ? (
            <li className="tag-more">
              <OpenProjectButton projectId={p.id} ariaLabel={`See all ${p.stack.length} technologies`}>+{hidden.length} more</OpenProjectButton>
            </li>
          ) : null}
        </ul>
        <div className="feature-actions">
          <OpenProjectButton projectId={p.id} className="text-link view-project">View project <ArrowUpRight /></OpenProjectButton>
          {p.live ? (
            <a className="text-link" href={p.live} target="_blank" rel="noopener noreferrer">Live site <ArrowUpRight /></a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <section className="sec" id="projects">
      <div className="wrap">
        <SectionHead id="projects" title="Selected work" lede="Recent projects across web, mobile, AI, and hardware. A few highlights first, then everything else." />
        <div className="features">
          {featuredProjects.map((p) => <FeaturedProject key={p.id} project={p} />)}
        </div>
        <ProjectIndex projects={projects} />
      </div>
    </section>
  );
}
