"use client";

import { useEffect, useRef, useState } from "react";

/** mailto link that also copies the address, for visitors with no mail app set up. */
export default function EmailLink({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onClick = () => {
    if (!navigator.clipboard?.writeText) return;
    navigator.clipboard.writeText(email).then(
      () => {
        setCopied(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), 3500);
      },
      () => {},
    );
  };

  return (
    <>
      <a className="email email-link" href={`mailto:${email}?subject=Project%20inquiry`} onClick={onClick}>{email}</a>
      <p className={`copied-note${copied ? " is-on" : ""}`} role="status" aria-live="polite">
        {copied ? "Address copied, in case your email app didn’t open" : ""}
      </p>
    </>
  );
}
