import { Game } from "../core/game.js";

export interface CandidateAction {
  type: string;
  payload?: any;
}

export interface IRoleStrategy {
  evaluateCharOption(option: { id: string; bullets: number }): number;
  evaluateAction(
    action: CandidateAction,
    botPlayerId: string,
    game: Game,
  ): number;
}

export interface ICharStrategy {
  modifyCharScore(score: number): number;
  modifyScore(action: CandidateAction, score: number): number;
}
