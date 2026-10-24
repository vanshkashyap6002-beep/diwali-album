import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { CinematicEntry } from "./components/CinematicEntry";
import { AlbumCover } from "./components/AlbumCover";
import { PhysicalBook } from "./components/PhysicalBook";
import { defaultAlbum } from "./data/default-album";
import type { Album } from "./data/album-schema";
import "./styles/book.css";
const Creator = lazy(() =>
  import("./components/Creator").then((m) => ({ default: m.Creator })),
);
export default function App() {
  const [stage, setStage] = useState<"entry" | "cover" | "book">("entry"),
    [album, setAlbum] = useState<Album>(defaultAlbum),
    [editing, setEditing] = useState(false),
    [quiet, setQuiet] = useState(
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
    [sound, setSound] = useState(false),
    [audioError, setAudioError] = useState("");
  const audio = useRef<AudioContext | null>(null);
  const content = useRef<HTMLDivElement>(null);
  const stopSound = () => {
    void audio.current?.close().catch(() => {});
    audio.current = null;
    setSound(false);
  };
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setQuiet(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    if (quiet) stopSound();
  }, [quiet]);
  useEffect(() => {
    const visibility = () => {
      if (document.hidden) stopSound();
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      void audio.current?.close().catch(() => {});
    };
  }, []);
  const toggleSound = async () => {
    if (sound) {
      stopSound();
      return;
    }
    try {
      const ctx = new AudioContext();
      await ctx.resume();
      audio.current = ctx;
      const gain = ctx.createGain();
      gain.gain.value = 0.012;
      gain.connect(ctx.destination);
      [130.81, 196, 261.63].forEach((frequency, i) => {
        const tone = ctx.createOscillator();
        tone.frequency.value = frequency;
        tone.type = "sine";
        const soft = ctx.createGain();
        soft.gain.value = i === 0 ? 1 : 0.25;
        tone.connect(soft).connect(gain);
        tone.start();
      });
      setSound(true);
      setAudioError("");
    } catch {
      setAudioError(
        "Sound is unavailable in this browser. The album works silently.",
      );
    }
  };
  const move = (next: "entry" | "cover" | "book") => {
    setStage(next);
    window.scrollTo({ top: 0, behavior: "instant" });
    requestAnimationFrame(() => content.current?.focus());
  };
  return (
    <div className={quiet ? "app quiet" : "app"}>
      <div inert={editing} aria-hidden={editing || undefined}>
        <header className="app-header">
          <button
            className="wordmark brand-button"
            onClick={() => move("entry")}
            aria-label="CHERMO — return to the entrance"
          >
            chermo<span>CHERISH EVERY MOMENT</span>
          </button>
          <div className="header-actions">
            {album.sound && (
              <button
                onClick={toggleSound}
                aria-pressed={sound}
                aria-label={sound ? "Mute sound" : "Enable sound"}
              >
                {sound ? "♫" : "♪"}{" "}
                <span>{sound ? "Sound on" : "Sound off"}</span>
              </button>
            )}
            <button
              onClick={() => setQuiet(!quiet)}
              aria-pressed={quiet}
              aria-label="Quiet view"
            >
              ✧ <span>Quiet view</span>
            </button>
            <button onClick={() => setEditing(true)}>
              Make it yours <span aria-hidden="true">↗</span>
            </button>
          </div>
        </header>
        <div ref={content} tabIndex={-1} className="experience" key={stage}>
          {stage === "entry" ? (
            <CinematicEntry
              opening={album.opening}
              quiet={quiet}
              onEnter={() => move("cover")}
            />
          ) : stage === "cover" ? (
            <AlbumCover
              album={album}
              quiet={quiet}
              onOpen={() => move("book")}
            />
          ) : (
            <PhysicalBook
              album={album}
              quiet={quiet}
              onReplay={() => move("entry")}
              onClose={() => move("cover")}
            />
          )}
        </div>
        {audioError && (
          <p role="status" className="audio-error">
            {audioError}
          </p>
        )}
        <footer className="ownership">
          © {new Date().getFullYear()} CHERMO. Original design & experience. All
          rights reserved.
        </footer>
      </div>
      {editing && (
        <Suspense
          fallback={
            <div className="loading-editor" role="status">
              Opening your keepsake studio…
            </div>
          }
        >
          <Creator
            album={album}
            onClose={() => setEditing(false)}
            onChange={(next) => {
              setAlbum(next);
              setEditing(false);
              stopSound();
              move("entry");
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
