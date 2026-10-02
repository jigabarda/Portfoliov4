import DotField from "@/components/effects/DotField";
import { ArrowRight } from "@/components/icons";
import { site } from "@/content/site";
import LocalClock from "./LocalClock";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <DotField />
      <div className="wrap">
        <p className="status"><span className="dot" aria-hidden="true" />{site.status}</p>

        <h1 className="hero-name">
          <span className="line"><span>James Ivan</span></span>
          <span className="line"><span>Gabarda<em>.</em></span></span>
        </h1>

        <div className="hero-grid">
          <p className="hero-lede">{site.heroLede}</p>
          <dl className="meta">
            <div><dt className="kicker">Based in</dt><dd>{site.location}</dd></div>
            <div><dt className="kicker">Local time</dt><dd><LocalClock timeZone={site.timeZone} /> {site.timeZoneLabel}</dd></div>
            <div><dt className="kicker">Now</dt><dd>{site.now}</dd></div>
            <div><dt className="kicker">Focus</dt><dd>{site.focus}</dd></div>
          </dl>
        </div>

        <div className="hero-cta">
          <div className="btn-group">
            <a className="btn btn-primary" href="#contact">Start a project <ArrowRight /></a>
            <a className="btn btn-ghost" href="#projects">See my work</a>
          </div>
        </div>
      </div>
    </section>
  );
}
