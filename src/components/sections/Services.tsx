import SectionHead from "@/components/ui/SectionHead";
import { services } from "@/content/services";

export default function Services() {
  return (
    <section className="sec" id="services">
      <div className="wrap">
        <SectionHead id="services" title="What I do" lede="Six ways I help businesses, from the first idea to long after launch." />
        <div className="services">
          {services.map((s) => (
            <article key={s.title} className="service reveal">
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <p className="kicker">{s.includes.join(" · ")}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
