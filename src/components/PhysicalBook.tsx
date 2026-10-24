import { useCallback, useEffect, useRef, useState } from "react";
import { PAGES, type Album } from "../data/album-schema";
import { makeTurn, targetPage, type Turn } from "../app/album-flow";
import { PageTurn } from "./PageTurn";
import { AlbumPage } from "./AlbumPage";
import { Rangoli } from "./FestiveArt";
export function PhysicalBook({
  album,
  quiet,
  onReplay,
  onClose,
}: {
  album: Album;
  quiet: boolean;
  onReplay: () => void;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0),
    [turn, setTurn] = useState<Turn | null>(null),
    [contents, setContents] = useState(false);
  const lock = useRef(false),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null),
    pointer = useRef<{
      x: number;
      y: number;
      target: EventTarget | null;
    } | null>(null);
  const pending = useRef<Turn | null>(null);
  const [visited, setVisited] = useState<number[]>([0]);
  const current = useRef(0);
  const main = useRef<HTMLElement>(null);
  const finish = useCallback(() => {
    const t = pending.current;
    if (t) {
      current.current = t.to;
      setIndex(t.to);
    }
    pending.current = null;
    setTurn(null);
    lock.current = false;
    if (timer.current) clearTimeout(timer.current);
  }, []);
  const go = useCallback(
    (to: number) => {
      if (lock.current) return;
      const t = makeTurn(current.current, to);
      if (!t) return;
      lock.current = true;
      pending.current = t;
      setVisited((old) => (old.includes(to) ? old : [...old, to]));
      setTurn(t);
      setContents(false);
      timer.current = setTimeout(finish, quiet ? 30 : 960);
    },
    [finish, quiet],
  );
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (
        (e.target instanceof Element && e.target.closest(
          'input,textarea,select,[role="dialog"]',
        )) ||
        e.altKey ||
        e.ctrlKey ||
        e.metaKey
      )
        return;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        go(targetPage(current.current, e.key === "ArrowRight" ? 1 : -1));
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [go]);
  return (
    <main className="album-stage" ref={main}>
      <div className="album-topline">
        <button className="text-button" onClick={onClose}>
          ← The cover
        </button>
        <span className="eyebrow">
          A DIWALI, MADE FOR {album.recipient || "YOU"}
        </span>
        <button
          className="text-button"
          onClick={() => setContents(!contents)}
          aria-expanded={contents}
          aria-controls="chapter-list"
        >
          Chapters ☰
        </button>
      </div>
      <div className="physical-book">
        <aside className="inside-cover">
          <div className="inside-border" />
          <span className="eyebrow">KEEP THIS LITTLE LIGHT</span>
          <Rangoli />
          <h2>
            Some distances
            <br />
            are crossed
            <br />
            <em>with a little love.</em>
          </h2>
          <p>
            A Diwali for {album.recipient || "you"},<br />
            from {album.sender || "someone who cares"}.
          </p>
          <span className="inside-signature">chermo</span>
          <span className="binding-stitch top" />
          <span className="binding-stitch bottom" />
        </aside>
        <div
          className="book-right"
          onPointerDown={(e) => {
            if (
              (e.target as HTMLElement).closest(
                'button,input,textarea,select,a,[role="dialog"]',
              )
            )
              return;
            pointer.current = { x: e.clientX, y: e.clientY, target: e.target };
            e.currentTarget.setPointerCapture?.(e.pointerId);
          }}
          onPointerUp={(e) => {
            const start = pointer.current;
            pointer.current = null;
            if (!start) return;
            const dx = e.clientX - start.x,
              dy = e.clientY - start.y;
            if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4)
              go(targetPage(current.current, dx < 0 ? 1 : -1));
          }}
          onPointerCancel={() => (pointer.current = null)}
        >
          <div className="book-page-edges" />
          {PAGES.map((p, i) => {
            const turning =
              !!turn &&
              (turn.direction === 1 ? i === turn.from : i === turn.to);
            const visible = turn
              ? i === turn.from || i === turn.to
              : i === index;
            return (
              <PageTurn
                key={p.id}
                visible={visible}
                active={!turn && i === index}
                turning={turning}
                direction={turn?.direction ?? 1}
                onDone={finish}
              >
                <div className="page-running-head">
                  <span>DIWALI · {album.sender || "WITH LOVE"}</span>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </div>
                {visited.includes(i) && (
                  <AlbumPage
                    id={p.id}
                    album={album}
                    quiet={quiet}
                    onReplay={onReplay}
                  />
                )}
              </PageTurn>
            );
          })}
        </div>
      </div>
      <nav className="book-navigation" aria-label="Album pages">
        <button
          aria-label="Previous page"
          onClick={() => go(targetPage(index, -1))}
          disabled={index === 0 || !!turn}
        >
          ← <span>Previous</span>
        </button>
        <span aria-live="polite" aria-atomic="true">
          {String(index + 1).padStart(2, "0")} <i>/ 08</i>
          <small>{PAGES[index].title}</small>
        </span>
        <button
          aria-label="Next page"
          onClick={() => go(targetPage(index, 1))}
          disabled={index === 7 || !!turn}
        >
          <span>Next</span> →
        </button>
      </nav>
      <p className="navigation-hint">
        Turn with the arrows, or swipe the paper.
      </p>
      {contents && (
        <nav
          id="chapter-list"
          className="chapter-list"
          aria-label="Choose a chapter"
        >
          <div>
            <span className="eyebrow">YOUR LITTLE DIWALI</span>
            <button
              aria-label="Close chapters"
              onClick={() => setContents(false)}
            >
              ×
            </button>
          </div>
          {PAGES.map((p, i) => (
            <button
              key={p.id}
              aria-current={i === index ? "page" : undefined}
              onClick={() => {
                if (i === index) setContents(false);
                else go(i);
              }}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              {p.title}
              <span>↗</span>
            </button>
          ))}
        </nav>
      )}
    </main>
  );
}
