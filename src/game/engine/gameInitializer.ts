import type { DeckType } from "../../types.js";
import { Deck } from "./cards/deck.js";
import { Game } from "./core/game.js";
import { GameState } from "./state/gameState.js";
import { Player } from "./player/player.js";
import { EventSystem } from "../../eventSystem/eventSystem.js";

export async function initializeGame(
  playerCount: number,
  id: string,
  eventSystem: EventSystem,
) {
  const gameState = await createGameState(playerCount);

  eventSystem.preLaunch.gameCreated({
    deckSize: gameState.deck.length,
    gameId: id,
    numberOfSeats: gameState.players.length,
  });

  return new Game(id, gameState, eventSystem);
}

async function createGameState(playerCount: number): Promise<GameState> {
  //Check for correct player count
  if (playerCount < 4 || playerCount > 7 || !playerCount) {
    throw new Error("Incorrect number of players");
  }

  const players = await createPlayers(playerCount);
  const deck = await createDeck("main");
  const charDeck = await createDeck("char");
  const roleDeck = await createDeck("role", playerCount);

  return new GameState(deck, charDeck, roleDeck, players);
}

async function createDeck(deckType: DeckType, playerCount?: number) {
  const newDeck = await Deck.create(deckType);

  //Tweak for role decks only
  if (playerCount) {
    //Clear generated .deck property and fill it again to account player count.
    newDeck.deck = fillRoleDeck(playerCount);
  }

  newDeck.shuffle();
  return newDeck;
}

function fillRoleDeck(playerCount: number) {
  switch (playerCount) {
    case 4:
      return ["sheriff", "renegade", "outlaw", "outlaw"];
    case 5:
      return ["sheriff", "renegade", "outlaw", "outlaw", "deputy"];
    case 6:
      return ["sheriff", "renegade", "outlaw", "outlaw", "outlaw", "deputy"];
    case 7:
      return [
        "sheriff",
        "renegade",
        "outlaw",
        "outlaw",
        "outlaw",
        "deputy",
        "deputy",
      ];
    default:
      return [];
  }
}

async function createPlayers(playerCount: number) {
  const playersQueue = [];

  for (let i = 1; i <= playerCount; i++) {
    const player = new Player();
    playersQueue.push(player);
  }

  return playersQueue;
}
