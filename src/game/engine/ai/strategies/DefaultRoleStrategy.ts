import { Game } from "../../core/game.js";
import { CandidateAction, IRoleStrategy } from "../types.js";

export class DefaultRoleStrategy implements IRoleStrategy {
  evaluateCharOption(_option: { id: string; bullets: number }): number {
    return 10;
  }

  evaluateAction(
    _action: CandidateAction,
    _botPlayerId: string,
    _game: Game,
  ): number {
    //Plug logic - every action has the same value
    return 10;
  }
}
