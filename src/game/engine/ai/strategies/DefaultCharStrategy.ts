import { CandidateAction, ICharStrategy } from "../types.js";

export class DefaultCharStrategy implements ICharStrategy {
  modifyCharScore(score: number): number {
    // Just a plug for later
    return score;
  }

  modifyScore(action: CandidateAction, score: number): number {
    // Plug logic - the score is unmodified
    return score;
  }
}
