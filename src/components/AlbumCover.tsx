import { useEffect, useRef, useState } from "react";
import type { Album } from "../data/album-schema";
import { Diya, Rangoli } from "./FestiveArt";
export function AlbumCover({
  album,
  onOpen,
  quiet,
}: {
  album: Album;
  onOpen: () => void;
  quiet: boolean;
}) {
  const [opening, setOpening] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  return (
    <main className="cover-stage">
      <p className="eyebrow cover-intro">A PLACE FOR YOU IN OUR CELEBRATION</p>
      <div className={`closed-book ${opening ? "opening" : ""}`}>
        <div className="cover-paper-stack" />
        <button
          className="hardcover"
          onClick={() => {
            if (opening) return;
            setOpening(true);
            timer.current = setTimeout(onOpen, quiet ? 20 : 950);
          }}
          disabled={opening}
          aria-label={`Open ${album.recipient}'s Diwali album`}
        >
          <span className="cover-spine" />
          <span className="cover-border" />
          <span className="cover-top">
            A CHERMO KEEPSAKE <span>✦</span> DIWALI EDITION
          </span>
          <span className="cover-ornament">
            <Rangoli />
            <Diya />
          </span>
          <span className="cover-title">
            A Diya
            <br />
            <i>for You</i>
          </span>
          <span className="cover-rule" />
          <span className="cover-dedication">
            Made with love, for
            <br />
            <strong>{album.recipient || "you"}</strong>
          </span>
          <span className="cover-sender">
            FROM {album.sender || "SOMEONE WHO CARES"}
          </span>
          <span className="cover-bottom">a little light, a little closer</span>
        </button>
      </div>
      <p className="cover-hint">
        Touch the cover. There’s a little world inside.{" "}
        <span aria-hidden="true">↗</span>
      </p>
    </main>
  );
}
