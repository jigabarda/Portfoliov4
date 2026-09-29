"use client";

import { useState } from "react";
import { splitTags } from "@/lib/tags";

/** Shows the first `max` tags; a dashed "+N more" chip reveals the rest in place. */
export default function TagList({ tags, max = 4 }: { tags: string[]; max?: number }) {
  const [expanded, setExpanded] = useState(false);
  const { shown, hidden } = splitTags(tags, max);
  const visible = expanded ? tags : shown;

  return (
    <ul className="tags">
      {visible.map((t) => <li key={t}>{t}</li>)}
      {!expanded && hidden.length ? (
        <li className="tag-more">
          <button type="button" aria-label={`Show ${hidden.length} more skills`} onClick={() => setExpanded(true)}>
            +{hidden.length} more
          </button>
        </li>
      ) : null}
    </ul>
  );
}
