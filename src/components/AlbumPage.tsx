import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Album, Memory, PageId } from "../data/album-schema";
import { Altar, Diya, HomeScene, Rangoli } from "./FestiveArt";
import { HandmadeLetter } from "./HandmadeLetter";
import { FoldedNote } from "./FoldedNote";
import "../styles/scenes.css";
function Heading({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <header className="scene-heading">
      <span className="scene-number">A DIYA FOR YOU · {number}</span>
      <h2>{children}</h2>
    </header>
  );
}
function PhotoView({
  memory,
  onClose,
}: {
  memory: Memory;
  onClose: () => void;
}) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const active =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const root = document.getElementById("root");
    const previousInert = root?.inert ?? false;
    const previousHidden = root?.getAttribute("aria-hidden") ?? null;
    if (root) {
      root.inert = true;
      root.setAttribute("aria-hidden", "true");
    }
    function key(event: KeyboardEvent) {
      if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        close.current();
      }
      if (event.key === "Tab") {
        event.preventDefault();
        closeButton.current?.focus();
      }
    }
    document.addEventListener("keydown", key, true);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", key, true);
      if (root) {
        root.inert = previousInert;
        if (previousHidden === null) root.removeAttribute("aria-hidden");
        else root.setAttribute("aria-hidden", previousHidden);
      }
      active?.focus();
    };
  }, []);
  return createPortal(
    <div
      className="memory-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={memory.caption || "Your memory, enlarged"}
    >
      <button
        ref={closeButton}
        className="memory-lightbox-close"
        type="button"
        onClick={onClose}
      >
        Close photograph <span aria-hidden="true">×</span>
      </button>
      <figure>
        <img
          src={memory.src}
          alt={memory.caption || "A personal Diwali memory"}
        />
        <figcaption>
          {memory.caption}
          {memory.date && <span>{memory.date}</span>}
          {memory.demo && <small>Illustrated demo memory</small>}
        </figcaption>
      </figure>
    </div>,
    document.body,
  );
}
function Memories({ album }: { album: Album }) {
  const [selected, setSelected] = useState<Memory | null>(null);
  return (
    <>
      <Heading number="05">
        Moments I wish
        <br />
        you were here for.
      </Heading>
      <p className="scene-intro">
        A few little pieces of my celebration, kept for you.
      </p>
      {album.memories.length ? (
        <div className="memory-layout">
          {album.memories.slice(0, 3).map((memory, index) => (
            <figure
              className={`memory-print print-${index + 1}`}
              key={memory.id}
            >
              <button
                type="button"
                onClick={() => setSelected(memory)}
                aria-label={`Enlarge photo ${index + 1}${memory.caption ? `: ${memory.caption}` : ""}`}
              >
                <img
                  src={memory.src}
                  alt={memory.caption || `Diwali memory ${index + 1}`}
                  loading="lazy"
                />
              </button>
              <figcaption>
                {memory.caption || "A moment to keep"}
                {memory.date && <span>{memory.date}</span>}
                {memory.demo && <small>Demo memory</small>}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className="demo-memory-layout">
          {[
            "The doorstep, dressed in colour",
            "The first light of the evening",
            "A place saved for you",
          ].map((caption, index) => (
            <figure
              className={`memory-print demo-print print-${index + 1}`}
              key={caption}
            >
              <div className="demo-memory-art">
                {index === 0 ? (
                  <Rangoli />
                ) : index === 1 ? (
                  <Diya />
                ) : (
                  <HomeScene compact />
                )}
              </div>
              <figcaption>
                {caption}
                <small>Illustrated demo memory</small>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
      <p className="scene-footnote">
        {album.memories.length
          ? "Tap a photograph to hold it a little closer."
          : "Make it yours with up to three photographs in Personalise."}
      </p>
      {selected && (
        <PhotoView memory={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
function TwoHomes({ album }: { album: Album }) {
  const [revealed, setRevealed] = useState([false, false]);
  return (
    <>
      <Heading number="02">
        Two homes.
        <br />
        One Diwali.
      </Heading>
      <div className="two-homes-art">
        <div className="home-connection" aria-hidden="true" />
        <div className="little-home sender-home">
          <HomeScene compact />
          <button
            type="button"
            className="home-label"
            aria-expanded={revealed[0]}
            onClick={() => setRevealed((old) => [!old[0], old[1]])}
          >
            {revealed[0] ? (
              <>
                {album.sender}
                <small>{album.senderCity || "My home"}</small>
              </>
            ) : (
              "My light"
            )}
            <span aria-hidden="true">✦</span>
          </button>
        </div>
        <div className="little-home recipient-home">
          <HomeScene compact />
          <button
            type="button"
            className="home-label"
            aria-expanded={revealed[1]}
            onClick={() => setRevealed((old) => [old[0], !old[1]])}
          >
            {revealed[1] ? (
              <>
                {album.recipient}
                <small>{album.recipientCity || "Your home"}</small>
              </>
            ) : (
              "Your light"
            )}
            <span aria-hidden="true">✦</span>
          </button>
        </div>
      </div>
      <p className="scene-quote">
        Different places. Still part of the same celebration.
      </p>
      <p className="scene-footnote">Touch each light to see who is home.</p>
    </>
  );
}
function SameSky({ quiet }: { quiet: boolean }) {
  const [burst, setBurst] = useState(0);
  return (
    <>
      <Heading number="04">
        Under the
        <br />
        same sky.
      </Heading>
      <div className={`night-window ${quiet ? "quiet" : ""}`}>
        <div className="night-moon" />
        <div className="night-stars" />
        <div className="fireworks" key={burst} aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div className={`firework burst-${i}`} key={i}>
              {Array.from({ length: 12 }, (_, ray) => (
                <i
                  key={ray}
                  style={{ "--ray": `${ray * 30}deg` } as React.CSSProperties}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="night-houses" />
        <div className="balcony-rail" />
        <Diya className="window-diya" />
      </div>
      <p className="scene-quote">
        Wherever we are, we share this beautiful night.
      </p>
      <button
        type="button"
        className="text-button"
        onClick={() => setBurst((value) => value + 1)}
      >
        {quiet ? "Let the sky glow again" : "One more little celebration"}{" "}
        <span aria-hidden="true">✦</span>
      </button>
    </>
  );
}
export function AlbumPage({
  id,
  album,
  quiet,
  onReplay,
}: {
  id: PageId;
  album: Album;
  quiet: boolean;
  onReplay: () => void;
}) {
  const [lit, setLit] = useState(false);
  let content: React.ReactNode;
  switch (id) {
    case "diya":
      content = (
        <>
          <Heading number="01">
            A little light,
            <br />
            just for you.
          </Heading>
          <p className="scene-intro">
            Even from here, I wanted to brighten your evening.
          </p>
          <div className={`lighting-stage ${lit ? "lit" : ""}`}>
            <Rangoli className="diya-rangoli" />
            <Diya lit={lit} />
          </div>
          <button
            type="button"
            className="gold-button light-diya"
            disabled={lit}
            onClick={() => setLit(true)}
          >
            {lit ? "Your diya is glowing" : "Light the diya"}
            <span aria-hidden="true"> ✧</span>
          </button>
          <p className={`diya-message ${lit ? "revealed" : ""}`} role="status">
            {lit
              ? "Here's a little light, sent just for you."
              : "A small flame. A whole lot of feeling."}
          </p>
        </>
      );
      break;
    case "homes":
      content = <TwoHomes album={album} />;
      break;
    case "blessings":
      content = (
        <>
          <Heading number="03">
            Blessings
            <br />
            for your home.
          </Heading>
          <div className="blessing-altar">
            <Altar />
          </div>
          <div className="blessing-copy">
            <span aria-hidden="true">✺</span>
            <p>{album.blessing}</p>
          </div>
          <p className="scene-footnote">
            With wishes for peace, prosperity, health and happiness.
          </p>
        </>
      );
      break;
    case "sky":
      content = <SameSky quiet={quiet} />;
      break;
    case "memories":
      content = <Memories album={album} />;
      break;
    case "letter":
      content = (
        <>
          <Heading number="06">
            A letter
            <br />
            from me.
          </Heading>
          <p className="scene-intro">Some things feel better on paper.</p>
          <HandmadeLetter
            text={album.letter}
            sender={album.sender}
            recipient={album.recipient}
            quiet={quiet}
          />
        </>
      );
      break;
    case "wishes":
      content = (
        <>
          <Heading number="07">
            Three wishes.
            <br />
            All for you.
          </Heading>
          <p className="scene-intro">
            Tucked into these little folds, a few things I hope this year
            brings.
          </p>
          <div className="wish-stack">
            {album.wishes.map((wish, index) => (
              <FoldedNote key={index} text={wish} index={index} />
            ))}
          </div>
          <p className="scene-footnote">
            Open each one. Keep it as long as you like.
          </p>
        </>
      );
      break;
    case "final":
      content = (
        <>
          <Heading number="08">A little light stays.</Heading>
          <div className="final-home">
            <HomeScene />
          </div>
          <p className="final-thought">
            Distance can change where we celebrate. It doesn't change who
            belongs in our celebration.
          </p>
          <p className="final-closing">{album.closing}</p>
          <div className="final-signature">
            <p>Shubh Deepavali.</p>
            <strong>chermo</strong>
            <span>Cherish Every Moment.</span>
          </div>
          <button type="button" className="text-button" onClick={onReplay}>
            Visit this Diwali again <span aria-hidden="true">↺</span>
          </button>
        </>
      );
      break;
  }
  return (
    <section
      className={`album-scene scene-${id} ${quiet ? "quiet-scene" : ""}`}
      aria-label={
        {
          diya: "Light a diya",
          homes: "Two homes, one Diwali",
          blessings: "Blessings for your home",
          sky: "Under the same sky",
          memories: "Moments I wish you were here for",
          letter: "A letter from me",
          wishes: "Three wishes",
          final: "A little light stays",
        }[id]
      }
    >
      {content}
    </section>
  );
}
