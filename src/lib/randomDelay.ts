export function randomDelay(maxMs: number, minMs: number = 0): number {
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}
