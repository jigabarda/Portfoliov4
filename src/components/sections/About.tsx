import Image from "next/image";
import { ArrowUpRight } from "@/components/icons";
import SectionHead from "@/components/ui/SectionHead";
import { experience } from "@/content/experience";
import { site } from "@/content/site";
import { roleDuration } from "@/lib/duration";
import RoleBlock from "./RoleBlock";

export default function About() {
  return (
    <section className="sec" id="about">
      <div className="wrap">
        <SectionHead id="about" title="About me" />
        <div className="about">
          <figure className="about-photo">
            <div className="frame">
              <Image src="/images/profile2.jpg" alt={`Portrait of ${site.name}`} width={1462} height={1425} sizes="(max-width: 860px) 22rem, 33vw" />
            </div>
            <figcaption className="kicker">
              <span>{site.name} · {site.location}</span>
              <span>{site.education.degree} · {site.education.year}</span>
              <span>{site.education.school}</span>
            </figcaption>
          </figure>

          <div className="about-body">
            <div className="bio">{site.bio.map((p) => <p key={p}>{p}</p>)}</div>

            <dl className="stats">
              {site.stats.map((s) => (
                <div key={s.label}><dt className="kicker">{s.label}</dt><dd>{s.value}</dd></div>
              ))}
            </dl>

            <h3 className="sub-title">Experience</h3>
            <p className="xp-lede">{site.experienceLede}</p>
            <ol className="xp-list">
              {experience.map((role) => (
                <li key={role.id} className={`xp reveal${role.end ? "" : " is-now"}`}>
                  <span className="xp-mark" aria-hidden="true">{role.mark}</span>
                  <div className="xp-body">
                    <div className="xp-head">
                      <h4 className="xp-org">{role.org}</h4>
                      {role.end ? null : <span className="tl-now">Now</span>}
                    </div>
                    <RoleBlock role={role} initialDuration={roleDuration(role.start, role.end)} />
                  </div>
                </li>
              ))}
              <li className="xp xp-origin reveal">
                <span className="xp-mark" aria-hidden="true">&lt;/&gt;</span>
                <div className="xp-body">
                  <h4 className="xp-org">Wrote my first line of code</h4>
                  <p className="xp-when kicker">Sep 2019 · Hello, world</p>
                </div>
              </li>
            </ol>

            <h3 className="sub-title">Certificates</h3>
            <div className="certs">
              {site.certificates.map((c) => (
                <a key={c.label} className="text-link" href={c.href} target="_blank" rel="noopener noreferrer">{c.label} <ArrowUpRight /></a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
