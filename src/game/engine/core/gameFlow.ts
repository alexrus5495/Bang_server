import { EventSystem } from "../../../eventSystem/eventSystem.js";
import { GameActions } from "../../actions/gameActions.js";
import { GameStateController } from "../state/gameStateController.js";
import { TurnManager } from "./turnManager.js";

export class GameFlow {
  private actions!: GameActions;
  constructor(
    private stateCtrl: GameStateController,
    private turnManager: TurnManager,
    private eventSystem: EventSystem,
  ) {}
  public setActions(actions: GameActions): void {
    this.actions = actions;
  }

  /**
   * STEP 1: Match preparations
   */
  public async prepareGame(): Promise<void> {
    console.log("--- PREPARING GAME ---");

    // Deal roles, char cards and playing cards through preLaunch actions
    await this.actions.preLaunch.prepareMatch();

    console.log("--- GAME PREPARED ---");
  }

  /**
   * STEP 2: Launching the match and starting the first turn
   */
  public startGame(): void {
    console.log("--- STARTING GAME ---");
    this.eventSystem.preLaunch.gameStarted();

    // First turn is always the sheriff
    const sheriffIndex = this.stateCtrl.playerCtrl.currentPlayer;
    this.turnManager.startTurn(sheriffIndex);
  }

  /**
   * STEP 3: Handling the game end
   */
  public gameOver(winnerRole: string): void {
    console.log(`=================================`);
    console.log(`GAME OVER. Winner team: ${winnerRole}`);
    console.log(`=================================`);

    // this.eventSystem.flow.gameOver(winnerRole);
  }
}
