import { useEffect, useId, useState } from "react";
export function HandmadeLetter({
  text,
  sender,
  recipient,
  quiet,
}: {
  text: string;
  sender: string;
  recipient: string;
  quiet: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const id = useId();
  const words = text.match(/\S+\s*|\s+/g) ?? [];
  const reduced =
    quiet ||
    (typeof matchMedia === "function" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    setCount(0);
  }, [text]);
  useEffect(() => {
    if (!open || reduced || count >= words.length) return;
    const timer = window.setTimeout(() => setCount((value) => value + 2), 100);
    return () => window.clearTimeout(timer);
  }, [open, reduced, count, words.length]);
  const complete = reduced || count >= words.length;
  return (
    <div className={`letter-keepsake ${open ? "is-open" : ""}`}>
      <div className="letter-envelope" aria-hidden="true">
        <div className="envelope-back" />
        <div className="envelope-flap" />
        <div className="envelope-pocket" />
        <span className="envelope-seal">✿</span>
      </div>
      <button
        type="button"
        className="text-button letter-open"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Fold my letter away" : "Open your letter"}
      </button>
      {open && (
        <div className="letter-paper" id={id}>
          <span className="letter-date">A LITTLE LETTER, THIS DIWALI</span>
          {!complete && (
            <button
              type="button"
              className="text-button letter-skip"
              onClick={() => setCount(words.length)}
            >
              Read the whole letter
            </button>
          )}
          <p className="letter-salutation">Dear {recipient},</p>
          <p className="handwritten-message" aria-label={text}>
            <span aria-hidden="true">
              {complete ? text : words.slice(0, count).join("")}
              <span
                className={complete ? "ink-cursor finished" : "ink-cursor"}
                aria-hidden="true"
              />
            </span>
          </p>
          {complete && (
            <p className="letter-signature">
              With a little light,
              <br />
              {sender}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
