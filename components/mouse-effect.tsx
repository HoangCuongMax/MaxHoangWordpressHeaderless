"use client";

import { useEffect } from "react";

export function MouseEffect() {
  useEffect(() => {
    let frame = 0;

    function handlePointerMove(event: PointerEvent) {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        document.documentElement.style.setProperty(
          "--mouse-x",
          `${event.clientX}px`
        );
        document.documentElement.style.setProperty(
          "--mouse-y",
          `${event.clientY}px`
        );
      });
    }

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return <div className="mouse-effect" aria-hidden="true" />;
}
