import SectionHead from "@/components/ui/SectionHead";
import { PROCESS_NOTE, processSteps } from "@/content/process";

export default function Process() {
  return (
    <section className="sec" id="process">
      <div className="wrap">
        <SectionHead id="process" title="How I work" lede="Four steps from the first call to a product in your users' hands." />
        <div className="steps-track" aria-hidden="true"><span className="steps-fill" /></div>
        <ol className="steps">
          {processSteps.map((step) => (
            <li key={step.num} className="step reveal">
              <span className="step-num">{step.num}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <p className="kicker">{step.time}</p>
            </li>
          ))}
        </ol>
        <p className="kicker steps-note">{PROCESS_NOTE}</p>
      </div>
    </section>
  );
}
