import type { Point } from "./types";

const heuristic = (a: Point, b: Point, weight: number): number => {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  return (dx + dy) * weight;
};

export default heuristic;
