import { useEffect, useRef, useState } from "react";
import { HomeScene } from "./FestiveArt";
import type { EntranceController } from "../three/DiwaliEntrance";
export function CinematicEntry({
  opening,
  onEnter,
  quiet,
}: {
  opening: string;
  onEnter: () => void;
  quiet: boolean;
}) {
  const host = useRef<HTMLDivElement>(null),
    scene = useRef<EntranceController | null>(null);
  const [ready, setReady] = useState(false),
    [entering, setEntering] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    let disposed = false;
    setReady(false);
    if (quiet || new URLSearchParams(location.search).has("fallback")) return;
    import("../three/DiwaliEntrance")
      .then(({ createEntrance }) => {
        if (disposed || !host.current) return;
        try {
          scene.current = createEntrance(host.current, () => {
            scene.current?.dispose();
            scene.current = null;
            setReady(false);
          });
          setReady(true);
        } catch {
          setReady(false);
        }
      })
      .catch(() => setReady(false));
    return () => {
      disposed = true;
      scene.current?.dispose();
      scene.current = null;
    };
  }, [quiet]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const enter = () => {
    if (entering) return;
    setEntering(true);
    scene.current?.enter();
    timer.current = setTimeout(onEnter, quiet ? 30 : 1750);
  };
  return (
    <main className={`entry ${entering ? "entering" : ""}`}>
      <div className="entry-art">
        <span className="entry-firework" aria-hidden="true" />
        <div className={`entry-fallback ${ready ? "webgl-ready" : ""}`}>
          <HomeScene />
        </div>
        <div className="three-host" ref={host} aria-hidden="true" />
        <span className="scene-caption">
          THE DOOR IS OPEN. THE LIGHT IS YOURS.
        </span>
      </div>
      <section className="entry-copy">
        <span className="eyebrow">
          <span className="tiny-star">✦</span> A CHERMO DIWALI KEEPSAKE
        </span>
        <h1>
          A little Diwali,
          <br />
          <span className="entry-line">made just</span>{" "}
          <em>for you.</em>
        </h1>
        <p>{opening}</p>
        <button className="gold-button" onClick={enter} disabled={entering}>
          {entering ? "Come a little closer…" : "Enter the celebration"}{" "}
          <span aria-hidden="true">↗</span>
        </button>
        <span className="entry-footnote">
          Eight little moments. One place for you.
        </span>
      </section>
      <div className="entry-bottom">
        <span>Some moments deserve more than a message.</span>
        <span>HANDCRAFTED WITH A LITTLE LIGHT</span>
      </div>
    </main>
  );
}
