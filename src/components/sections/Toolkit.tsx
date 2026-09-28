import TechTiles from "@/components/effects/TechTiles";
import SectionHead from "@/components/ui/SectionHead";
import { stackGroups } from "@/content/stack";

export default function Toolkit() {
  return (
    <section className="sec" id="stack">
      <div className="wrap">
        <SectionHead id="stack" title="Toolkit" lede="The languages, frameworks, and services I reach for, grouped the way I use them." />
      </div>
      <div className="wrap">
        <TechTiles />
      </div>
      <div className="wrap">
        <dl className="stack-grid">
          {stackGroups.map((g) => (
            <div key={g.label} className="stack-row">
              <dt className="kicker">{g.label}</dt>
              <dd><ul>{g.items.map((item) => <li key={item}>{item}</li>)}</ul></dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
