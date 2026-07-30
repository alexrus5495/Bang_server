export function getCardRankValue(rank: string): number {
  switch (rank) {
    case "A":
      return 1;
    case "J":
      return 11;
    case "Q":
      return 12;
    case "K":
      return 13;
    default:
      return Number.parseInt(rank, 10) || 0;
  }
}
