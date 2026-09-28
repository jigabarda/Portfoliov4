import { testimonials } from "@/content/testimonials";

/** Renders the first approved quote; renders nothing until a client has approved one. */
export default function Testimonial() {
  const quote = testimonials.find((t) => t.approved);
  if (!quote) return null;

  return (
    <section className="sec" id="testimonials">
      <div className="wrap">
        <figure className="quote reveal">
          <div className="quote-top">
            <p className="label"><b>#</b>testimonials</p>
          </div>
          <span className="quote-mark" aria-hidden="true">“</span>
          <blockquote>{quote.quote}</blockquote>
          <figcaption>
            <strong>{quote.name}</strong> · {quote.role}
            <span className="quote-project">{quote.project}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
