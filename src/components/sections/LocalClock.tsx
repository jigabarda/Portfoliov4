"use client";

import { useEffect, useState } from "react";

/** Renders "--:--" on the server, then the live time in `timeZone`. */
export default function LocalClock({ timeZone }: { timeZone: string }) {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return <span className="clock">{time}</span>;
}
