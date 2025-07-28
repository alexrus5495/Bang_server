import { CARDPACKS } from "../../../config/cardpacks.js";
import type { Game } from "../core/game.js";
import type { Player } from "../player/player.js";

export type EffectWithTarget = (
  game: Game,
  player: Player,
  targetPlayer: Player,
  cardId: string, // A plug to make a type length === 4 (to differentiate from EffectWithoutTarget)
) => void;

export type EffectWithoutTarget = (
  game: Game,
  player: Player,
  cardId: string,
) => void;

export type CardEffectRegistry = Record<
  string,
  EffectWithTarget | EffectWithoutTarget
>;

export const CARD_EFFECTS_REGISTRY: CardEffectRegistry =
  await createCardEffectsRegistry().catch((e) => {
    console.log(`Fatal error loading card effects: ${e}`);
    throw e;
  });

async function createCardEffectsRegistry(): Promise<CardEffectRegistry> {
  const registry = {};

  for (const packName of CARDPACKS) {
    try {
      const packData = await importPackData(packName);
      Object.assign(registry, packData);
    } catch (e) {
      throw new Error(
        `Failed to load card pack ${packName}: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  }

  return registry;
}

async function importPackData(packName: string) {
  const module = await import(`../../cards/cards.${packName}.effects.ts`);

  //Check for correct type of default import
  if (!module.default || typeof module.default !== "object") {
    throw new Error(
      `Pack must export default object (received ${typeof module.default})`,
    );
  }

  //Check for correct content type inside import
  for (const [cardId, effect] of Object.entries(module.default)) {
    if (typeof effect !== "function") {
      throw new Error(
        `Card '${cardId}' has invalid effect type (expected function)`,
      );
    }
  }

  return module.default;
}
