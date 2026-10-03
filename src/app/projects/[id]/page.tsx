import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@/components/icons";
import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";
import { projectPages, projectPath } from "@/content/projects";

type Props = { params: Promise<{ id: string }> };

// Only the projects listed in projectPages exist; any other id is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return projectPages.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = projectPages.find((p) => p.id === id);
  if (!project) return {};
  const path = projectPath(project.id);
  const images = project.image
    ? [{ url: project.image.src, width: project.image.width, height: project.image.height, alt: project.image.alt }]
    : undefined;
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: path },
    openGraph: { type: "article", url: path, title: project.title, description: project.summary, images },
    twitter: { card: "summary_large_image", title: project.title, description: project.summary, images },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = projectPages.find((p) => p.id === id);
  if (!project?.detail) notFound();
  const others = projectPages.filter((p) => p.id !== project.id);

  return (
    <>
      <Nav home="/" />
      <main className="project-page" id="home">
        <div className="wrap">
          <Link className="text-link pp-back" href="/#projects"><ArrowLeft size={14} /> All projects</Link>

          <header className="pp-head">
            <p className="label"><b>#</b>projects · {project.category}</p>
            <h1 className="sec-title">{project.title}<em>.</em></h1>
            <p className="sec-lede pp-lede">{project.summary}</p>
          </header>

          <dl className="facts pp-facts">
            <div><dt className="kicker">Year</dt><dd>{project.year}</dd></div>
            <div><dt className="kicker">Platforms</dt><dd>{project.platforms}</dd></div>
            {project.users ? <div><dt className="kicker">Users</dt><dd>{project.users}</dd></div> : null}
            <div><dt className="kicker">Type</dt><dd>{project.type}</dd></div>
          </dl>

          {project.live || (project.repo && !project.private) ? (
            <div className="pp-links">
              {project.live ? (
                <a className="btn btn-ghost btn-sm" href={project.live} target="_blank" rel="noopener noreferrer">Visit live site <ArrowUpRight /></a>
              ) : null}
              {project.repo && !project.private ? (
                <a className="text-link" href={project.repo} target="_blank" rel="noopener noreferrer">Source code <ArrowUpRight /></a>
              ) : null}
            </div>
          ) : null}

          {project.image ? (
            <div className="drawer-shot pp-shot">
              <Image
                src={project.image.src}
                alt={project.image.alt}
                fill
                priority
                sizes="(max-width: 1240px) 100vw, 1160px"
                style={project.image.position ? { objectPosition: project.image.position } : undefined}
              />
            </div>
          ) : null}

          <div className="pp-grid">
            <section>
              <h2 className="kicker">Overview</h2>
              <div className="drawer-overview pp-overview">
                {project.detail.overview.map((para) => <p key={para}>{para}</p>)}
              </div>
            </section>
            <section>
              <h2 className="kicker">Key features</h2>
              <ul className="drawer-features">
                {project.detail.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
            </section>
            <section>
              <h2 className="kicker">Built with</h2>
              <ul className="tags">{project.stack.map((t) => <li key={t}>{t}</li>)}</ul>
            </section>
          </div>

          <aside className="pp-cta">
            <p className="pp-cta-text">Want something like {project.title}?</p>
            <Link className="btn btn-primary" href="/#contact">Start a project <ArrowRight /></Link>
          </aside>

          <nav className="pp-more" aria-label="More projects">
            <h2 className="kicker">More projects</h2>
            <ul>
              {others.map((p) => (
                <li key={p.id}>
                  <Link href={projectPath(p.id)}>
                    <span className="pp-more-title">{p.title}</span>
                    <span className="pp-more-meta">{p.category}</span>
                    <ArrowRight size={14} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>
      <Footer home="/" />
    </>
  );
}
