import { useEffect, useRef, useState } from "react";
import type { Album, Memory } from "../data/album-schema";
import { compressPhoto } from "../utils/photos";
import "../styles/creator.css";

type Props = {
  album: Album;
  onChange: (album: Album) => void;
  onClose: () => void;
};
const steps = ["The two of you", "Words from the heart", "Little memories"];
export function Creator({ album, onChange, onClose }: Props) {
  const [draft, setDraft] = useState<Album>(() => ({
    ...album,
    wishes: [...album.wishes],
    memories: album.memories.map((memory) => ({ ...memory })),
  }));
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const close = useRef(onClose);
  const alive = useRef(true);
  close.current = onClose;
  useEffect(() => {
    alive.current = true;
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    heading.current?.focus();
    function key(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close.current();
      }
      if (event.key !== "Tab") return;
      const elements = Array.from(
        dialog.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex="0"]',
        ) ?? [],
      ).filter((el) => el.getClientRects().length > 0);
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!first) {
        event.preventDefault();
        return;
      }
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !elements.includes(document.activeElement as HTMLElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !elements.includes(document.activeElement as HTMLElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", key);
    return () => {
      alive.current = false;
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, []);
  function changeStep(next: number) {
    setStep(next);
    setError("");
    requestAnimationFrame(() => heading.current?.focus());
  }
  function field(
    key:
      | "sender"
      | "recipient"
      | "relationship"
      | "senderCity"
      | "recipientCity"
      | "opening"
      | "blessing"
      | "letter"
      | "closing",
    label: string,
    multiline = false,
    max = 160,
  ) {
    return (
      <label className="creator-field" htmlFor={`creator-${key}`}>
        <span>{label}</span>
        {multiline ? (
          <textarea
            id={`creator-${key}`}
            value={draft[key]}
            maxLength={max}
            rows={key === "letter" ? 6 : 3}
            onChange={(e) =>
              setDraft((previous) => ({ ...previous, [key]: e.target.value }))
            }
          />
        ) : (
          <input
            id={`creator-${key}`}
            value={draft[key]}
            maxLength={max}
            onChange={(e) =>
              setDraft((previous) => ({ ...previous, [key]: e.target.value }))
            }
          />
        )}
      </label>
    );
  }
  async function addPhotos(files: FileList | null) {
    if (!files?.length || busy) return;
    const available = 3 - draft.memories.length;
    if (files.length > available) {
      setError(
        `There is room for ${available} more ${available === 1 ? "photo" : "photos"}. Please select fewer.`,
      );
      return;
    }
    setBusy(true);
    setError("");
    try {
      const memories: Memory[] = [];
      for (const file of Array.from(files))
        memories.push({
          id: crypto.randomUUID(),
          src: await compressPhoto(file),
          caption: "",
          date: "",
        });
      if (alive.current)
        setDraft((previous) => ({
          ...previous,
          memories: [...previous.memories, ...memories].slice(0, 3),
        }));
    } catch (error) {
      if (alive.current)
        setError(
          error instanceof Error
            ? error.message
            : "Please try another photograph.",
        );
    } finally {
      if (alive.current) setBusy(false);
    }
  }
  return (
    <div className="creator-backdrop">
      <div
        className="creator-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="creator-title"
        aria-describedby="creator-session"
        ref={dialog}
      >
        <header className="creator-header">
          <span className="creator-brand">CHERMO · A DIYA FOR YOU</span>
          <button
            type="button"
            className="creator-close"
            onClick={onClose}
            aria-label="Close personalisation"
          >
            ×
          </button>
        </header>
        <div className="creator-intro">
          <p className="creator-eyebrow">MAKE THIS DIWALI YOURS</p>
          <h2 id="creator-title" tabIndex={-1} ref={heading}>
            {steps[step]}
          </h2>
          <p id="creator-session">
            A private preview in this tab. Your words and photos are not
            uploaded or published, and disappear when you refresh.
          </p>
        </div>
        <ol className="creator-steps" aria-label="Personalisation progress">
          {steps.map((label, index) => (
            <li key={label} aria-current={index === step ? "step" : undefined}>
              <span>{index + 1}</span>
              <span>{label}</span>
            </li>
          ))}
        </ol>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (step < 2) changeStep(step + 1);
            else {
              onChange(draft);
              onClose();
            }
          }}
        >
          <div className="creator-content">
            {step === 0 && (
              <>
                <div className="creator-grid">
                  {field("sender", "Your name", false, 60)}
                  {field("recipient", "Their name", false, 60)}
                  {field("senderCity", "Your city", false, 80)}
                  {field("recipientCity", "Their city", false, 80)}
                </div>
                {field("relationship", "Your relationship", false, 80)}
                <p className="creator-hint">
                  A friend, a sibling, your partner — anyone who feels like
                  home.
                </p>
              </>
            )}
            {step === 1 && (
              <>
                {field("opening", "Your opening words", true, 300)}
                {field("blessing", "A blessing for their home", true, 500)}
                {field("letter", "Your letter", true, 2400)}
                {draft.wishes.map((wish, index) => (
                  <label className="creator-field" key={index}>
                    <span>Wish {index + 1}</span>
                    <textarea
                      rows={2}
                      maxLength={240}
                      value={wish}
                      onChange={(event) => {
                        const value = event.target.value;
                        setDraft((previous) => {
                          const wishes: Album["wishes"] = [...previous.wishes];
                          wishes[index] = value;
                          return { ...previous, wishes };
                        });
                      }}
                    />
                  </label>
                ))}
                {field("closing", "Your closing words", true, 400)}
              </>
            )}
            {step === 2 && (
              <>
                <p className="creator-hint">
                  Up to three photographs. JPG, PNG or WebP, under 15 MB each.
                  We resize them gently in your browser.
                </p>
                <div className="creator-memories">
                  {draft.memories.map((memory, index) => (
                    <div className="creator-memory" key={memory.id}>
                      <img
                        src={memory.src}
                        alt={memory.caption || `Memory ${index + 1}`}
                      />
                      <div>
                        <label className="creator-field">
                          <span>Caption for photo {index + 1}</span>
                          <input
                            value={memory.caption}
                            maxLength={160}
                            onChange={(event) => {
                              const caption = event.target.value;
                              setDraft((previous) => ({
                                ...previous,
                                memories: previous.memories.map((item) =>
                                  item.id === memory.id
                                    ? { ...item, caption }
                                    : item,
                                ),
                              }));
                            }}
                          />
                        </label>
                        <label className="creator-field">
                          <span>Date or little detail</span>
                          <input
                            value={memory.date}
                            maxLength={80}
                            placeholder="Diwali at home, 2025"
                            onChange={(event) => {
                              const date = event.target.value;
                              setDraft((previous) => ({
                                ...previous,
                                memories: previous.memories.map((item) =>
                                  item.id === memory.id
                                    ? { ...item, date }
                                    : item,
                                ),
                              }));
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          className="creator-remove"
                          disabled={busy}
                          aria-label={`Remove photo ${index + 1}`}
                          onClick={() =>
                            setDraft((previous) => ({
                              ...previous,
                              memories: previous.memories.filter(
                                (item) => item.id !== memory.id,
                              ),
                            }))
                          }
                        >
                          Remove photo
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {draft.memories.length < 3 && (
                  <label className="creator-upload">
                    <span>
                      {busy
                        ? "Preparing your memories…"
                        : "Add your photographs"}
                    </span>
                    <input
                      aria-label="Add your photographs"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      disabled={busy}
                      onChange={(event) => {
                        void addPhotos(event.target.files);
                        event.target.value = "";
                      }}
                    />
                  </label>
                )}
                <label className="creator-sound">
                  <input
                    type="checkbox"
                    checked={draft.sound}
                    onChange={(event) =>
                      setDraft((previous) => ({
                        ...previous,
                        sound: event.target.checked,
                      }))
                    }
                  />
                  Enable gentle sound for this preview
                </label>
                <p className="creator-hint">
                  Sound can also be turned off inside the album.
                </p>
              </>
            )}
            {error && (
              <p className="creator-error" role="alert">
                {error}
              </p>
            )}
            <span className="creator-status" role="status">
              {busy ? "Preparing photos. Please wait." : ""}
            </span>
          </div>
          <footer className="creator-footer">
            <button
              type="button"
              className="creator-secondary"
              onClick={() => (step === 0 ? onClose() : changeStep(step - 1))}
            >
              {step === 0 ? "Cancel" : "Back"}
            </button>
            <span>{step + 1} / 3</span>
            <button className="creator-primary" type="submit" disabled={busy}>
              {step === 2 ? "Preview my Diwali" : "Continue"}
              <span aria-hidden="true"> ↗</span>
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
