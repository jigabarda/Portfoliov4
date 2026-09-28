"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "@/components/icons";
import TagList from "@/components/ui/TagList";
import type { Role } from "@/content/types";
import { formatRange, roleDuration } from "@/lib/duration";

/**
 * Role, dates, summary, collapsible detail, and tags.
 * `initialDuration` comes from the server so hydration matches; current roles then update to today's date.
 */
export default function RoleBlock({ role, initialDuration }: { role: Role; initialDuration: string }) {
  const [open, setOpen] = useState(false);
  const [duration, setDuration] = useState(initialDuration);
  const panelId = `xp-more-${role.id}`;

  useEffect(() => {
    if (!role.end) setDuration(roleDuration(role.start));
  }, [role.start, role.end]);

  return (
    <div className="xp-roleblock">
      <p className="xp-role">{role.role}</p>
      <p className="xp-when kicker">{formatRange(role.start, role.end)} · <span className="xp-dur">{duration}</span></p>
      <p className="xp-desc">{role.summary}</p>
      <div className={`xp-more${open ? " is-open" : ""}`} id={panelId}>
        <div><p className="xp-desc">{role.more}</p></div>
      </div>
      <button className="xp-toggle" type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((o) => !o)}>
        <span>{open ? "Show less" : "Show more"}</span>
        <ChevronDown />
      </button>
      <TagList tags={role.tags} max={4} />
    </div>
  );
}
