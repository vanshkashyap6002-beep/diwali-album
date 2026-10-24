import { useId, useState } from "react";
export function FoldedNote({ text, index }: { text: string; index: number }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className={`wish-keepsake wish-${index + 1} ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="wish-toggle"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="wish-fold" aria-hidden="true" />
        <span className="wish-stamp" aria-hidden="true">
          {["✿", "☼", "❋"][index]}
        </span>
        <span>
          {open ? `Fold wish ${index + 1} away` : `Open wish ${index + 1}`}
        </span>
      </button>
      {open && (
        <div id={id} className="wish-message">
          <span className="wish-number">0{index + 1}</span>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
}
