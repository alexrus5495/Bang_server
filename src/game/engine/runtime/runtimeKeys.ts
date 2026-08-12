export const promiseKeys = {
  allPlayersAssigned: "allPlayersAssigned",
  charSelection: "charSelection",
  bang: "bang",
  gatling: "player{index}_gatling",
  duel: "player{index}_duel",
  general_store: "player{index}_general_store",
  panic: "panic",
  cat_balou: "cat_balou",
  indians: "player{index}_indians",
} as const;

export const timerKeys = {
  charSelection: "player{index}_charSelection",
  general_store: "player{index}_storeSelection",
};
