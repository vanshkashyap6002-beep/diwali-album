import { PAGES } from "../data/album-schema";
export interface Turn {
  from: number;
  to: number;
  direction: 1 | -1;
}
export function targetPage(current: number, delta: number) {
  return Math.max(0, Math.min(PAGES.length - 1, current + delta));
}
export function makeTurn(from: number, to: number): Turn | null {
  if (from === to || to < 0 || to >= PAGES.length) return null;
  return { from, to, direction: to > from ? 1 : -1 };
}
