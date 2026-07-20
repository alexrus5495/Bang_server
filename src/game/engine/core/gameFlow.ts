import { MatchPreparer } from "./matchPreparer.js";
import type { PhaseContoller } from "./phaseContoller.js";

export class GameFlow {
  matchPreparer: MatchPreparer;
  private phaseCtrl: PhaseContoller;
  constructor(matchPreparer: MatchPreparer, phaseController: PhaseContoller) {
    this.matchPreparer = matchPreparer;
    this.phaseCtrl = phaseController;
  }

  public readonly phase = {
    prepareGame: () => this.prepareGame(),
    startGame: () => this.phaseCtrl.startGame(),
    gameOver: (winner: string) => this.phaseCtrl.gameOver(winner),
  };

  public async prepareGame() {
    await this.matchPreparer.prepare();
    this.phaseCtrl.startGame();
  }
}
