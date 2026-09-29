"use client";

import { Fragment, startTransition, useActionState, useEffect, useRef } from "react";
import { sendInquiry, type InquiryField, type InquiryState } from "@/app/actions/contact";
import { ArrowRight } from "@/components/icons";
import { BUDGETS } from "@/lib/budgets";

const initial: InquiryState = { status: "idle" };

export default function ContactForm() {
  const [state, action, pending] = useActionState(sendInquiry, initial);
  const formRef = useRef<HTMLFormElement>(null);

  // Submitted manually so a failed submission keeps what the visitor typed; clear only on success.
  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  const err = (field: InquiryField) => state.fieldErrors?.[field];
  const invalid = (field: InquiryField) => (err(field) ? { "aria-invalid": true, "aria-describedby": `cf-${field}-error` } : {});
  const errorText = (field: InquiryField) =>
    err(field) ? <p className="field-error" id={`cf-${field}-error`}>{err(field)}</p> : null;

  return (
    <form
      ref={formRef}
      className="form"
      id="contact-form"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
    >
      <div className="hp" aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="form-row">
        <div className="field">
          <label className="kicker" htmlFor="cf-name">Your name<span className="req" aria-hidden="true">*</span></label>
          <input id="cf-name" name="name" type="text" autoComplete="name" placeholder="Jane Cruz" required {...invalid("name")} />
          {errorText("name")}
        </div>
        <div className="field">
          <label className="kicker" htmlFor="cf-email">Email<span className="req" aria-hidden="true">*</span></label>
          <input id="cf-email" name="email" type="email" autoComplete="email" placeholder="jane@company.com" required {...invalid("email")} />
          {errorText("email")}
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label className="kicker" htmlFor="cf-company">Company</label>
          <input id="cf-company" name="company" type="text" autoComplete="organization" placeholder="Optional" />
        </div>
        <div className="field">
          <label className="kicker" htmlFor="cf-timeline">Ideal timeline</label>
          <input id="cf-timeline" name="timeline" type="text" placeholder="e.g. Next month, Q1 2027, flexible" />
        </div>
      </div>

      <div className="field">
        <label className="kicker" htmlFor="cf-project">Project type<span className="req" aria-hidden="true">*</span></label>
        <input id="cf-project" name="project" type="text" placeholder="e.g. Sales dashboard, booking app, AI chatbot" required {...invalid("project")} />
        {errorText("project")}
      </div>

      <fieldset className="choice">
        <legend className="kicker">Budget</legend>
        <div className="pills">
          {BUDGETS.map((b, i) => (
            <Fragment key={b.value}>
              <input type="radio" id={`cf-budget-${i}`} name="budget" value={b.value} defaultChecked={i === 0} />
              <label htmlFor={`cf-budget-${i}`}>{b.label}</label>
            </Fragment>
          ))}
        </div>
      </fieldset>

      <div className="field">
        <label className="kicker" htmlFor="cf-msg">About the project<span className="req" aria-hidden="true">*</span></label>
        <textarea id="cf-msg" name="message" placeholder="What are you building, who is it for, and what would a great result look like?" required minLength={10} {...invalid("message")} />
        {errorText("message")}
      </div>

      <div className="form-foot">
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? "Sending…" : <>Send message <ArrowRight /></>}
        </button>
      </div>

      {state.message ? <p className="form-note" role="status">{state.message}</p> : null}
    </form>
  );
}
