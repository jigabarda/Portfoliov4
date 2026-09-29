import DotField from "@/components/effects/DotField";
import { site } from "@/content/site";
import ContactForm from "./ContactForm";
import EmailLink from "./EmailLink";

export default function Contact() {
  return (
    <section className="sec contact" id="contact">
      <DotField />
      <div className="wrap">
        <p className="label"><b>#</b>contact</p>
        <h2 className="contact-title">Let&apos;s build<br />something<em>.</em></h2>

        <div className="contact-grid">
          <div className="contact-info">
            <div>
              <p className="kicker">Email</p>
              <EmailLink email={site.email} />
              <p className="note">Tell me what you&apos;re building. I usually reply within a day.</p>
            </div>
            <div>
              <p className="kicker">Elsewhere</p>
              <ul className="socials">
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a className="text-link" href={s.href} {...(s.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{s.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
