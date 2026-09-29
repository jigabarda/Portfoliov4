import { site } from "@/content/site";

export default function ExperienceStrip() {
  return (
    <section className="strip" aria-label="Where I have worked">
      <div className="wrap strip-inner">
        <p className="kicker">Experience at</p>
        <ul>{site.employers.map((name) => <li key={name}>{name}</li>)}</ul>
      </div>
    </section>
  );
}
