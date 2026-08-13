import { Game } from "../core/game.js";
import { DefaultCharStrategy } from "./strategies/DefaultCharStrategy.js";
import { DefaultRoleStrategy } from "./strategies/DefaultRoleStrategy.js";
import { CandidateAction, ICharStrategy, IRoleStrategy } from "./types.js";

export class AiBrain {
  readonly playerId: string;
  private roleStrategy: IRoleStrategy;
  private charStrategy: ICharStrategy;

  constructor(
    playerId: string,
    roleStrategy: IRoleStrategy = new DefaultRoleStrategy(),
    charStrategy: ICharStrategy = new DefaultCharStrategy(),
  ) {
    this.playerId = playerId;
    this.roleStrategy = roleStrategy;
    this.charStrategy = charStrategy;
  }

  /**
   * Choose the best action (preparing for Utility AI)
   */
  public selectBestAction(
    candidateActions: CandidateAction[],
    game: Game,
  ): CandidateAction | null {
    if (candidateActions.length === 0) return null;

    let bestAction = candidateActions[0];
    let maxScore = -Infinity;

    for (const action of candidateActions) {
      let score = this.roleStrategy.evaluateAction(action, this.playerId, game);
      score = this.charStrategy.modifyScore(action, score);

      if (score > maxScore) {
        maxScore = score;
        bestAction = action;
      }
    }

    return bestAction;
  }

  public selectBestCharOption(
    options: { id: string; bullets: number }[],
  ): number {
    if (options.length === 0) return 0;

    let bestIndex = 0;
    let maxScore = -Infinity;

    options.forEach((option, index) => {
      let score = this.roleStrategy.evaluateCharOption(option);
      score = this.charStrategy.modifyCharScore(score);

      if (score > maxScore) {
        maxScore = score;
        bestIndex = index;
      }
    });

    return bestIndex;
  }
}
