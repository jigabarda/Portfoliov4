import { Fragment } from "react";
import { SERVICE_BAND } from "@/content/services";

/** Decorative divider; the same words are real content in #services, so it is hidden from assistive tech. */
export default function ServicesBand() {
  const run = [...SERVICE_BAND, ...SERVICE_BAND];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {run.map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            <span>{word}</span>
            <i />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
