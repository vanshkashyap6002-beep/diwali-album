import type { ReactNode } from "react";
import { Rangoli } from "./FestiveArt";
export function PageTurn({
  children,
  visible,
  active,
  direction,
  turning,
  onDone,
}: {
  children: ReactNode;
  visible: boolean;
  active: boolean;
  direction: 1 | -1;
  turning: boolean;
  onDone: () => void;
}) {
  return (
    <div
      className={`book-leaf ${visible ? "visible" : ""} ${active ? "active" : ""} ${turning ? `turning ${direction === 1 ? "forward" : "backward"}` : ""}`}
      aria-hidden={!active}
      inert={!active}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) onDone();
      }}
    >
      <div className="page-face page-front">
        <div className="page-content">{children}</div>
        <span className="page-curl" />
      </div>
      <div className="page-face page-back" aria-hidden="true">
        <Rangoli />
        <span>A little light, kept between these pages.</span>
      </div>
    </div>
  );
}
