"use client";

import type { ReactNode } from "react";
import { useProjectDrawer } from "./ProjectDrawer";

type Props = { projectId: string; className?: string; ariaLabel?: string; children: ReactNode };

export default function OpenProjectButton({ projectId, className, ariaLabel, children }: Props) {
  const { open } = useProjectDrawer();
  return (
    <button type="button" className={className} aria-label={ariaLabel} onClick={(e) => open(projectId, e.currentTarget)}>
      {children}
    </button>
  );
}
