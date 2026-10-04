import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";
import { projectPages, projectPath } from "@/content/projects";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <Nav home="/" />
      <main className="not-found" id="home">
        <div className="wrap">
          <p className="label"><b>#</b>404</p>
          <h1 className="sec-title">Page not found<em>.</em></h1>
          <p className="sec-lede nf-lede">
            This page doesn&apos;t exist or has moved. The rest of the site is right where you left it.
          </p>

          <div className="btn-group nf-actions">
            <Link className="btn btn-primary" href="/">Back to home <ArrowRight /></Link>
            <Link className="btn btn-ghost" href="/#projects">See my work</Link>
          </div>

          <nav className="pp-more nf-projects" aria-label="Projects">
            <h2 className="kicker">Or jump to a project</h2>
            <ul>
              {projectPages.map((p) => (
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
