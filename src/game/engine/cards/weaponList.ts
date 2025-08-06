import { CARDPACKS } from "../../../config/cardpacks.js";
import type { PlayingCardMeta } from "../../../types.js";

export const WEAPON_LIST = await createWeaponList();

type WeaponList = Map<string, number>;

async function createWeaponList(): Promise<WeaponList> {
  const weaponList = new Map<string, number>();

  for (const packName of CARDPACKS) {
    const packData = (await addPackData(packName)) as Record<
      string,
      PlayingCardMeta
    >;

    for (const card of Object.values(packData)) {
      const weaponId = card.cardTypeId;
      if (!card._range)
        throw new Error(`Weapon card ${weaponId} is missing range value`);
      const weaponRange = card._range as number;

      if (!weaponList.has(weaponId)) weaponList.set(weaponId, weaponRange);
    }
  }

  return weaponList;
}

async function importPackData(packName: string) {
  try {
    const pack = await import(`../../cards/cards.${packName}.meta.js`);
    return pack.default;
  } catch (e) {
    throw new Error(
      e instanceof Error
        ? e.message
        : typeof e === "string"
          ? e
          : "Unknown error loading pack",
    );
  }
}

async function addPackData(packName: string) {
  const packData = await importPackData(packName);

  if (!packData) {
    console.warn(`Pack "${packName}" not found or invalid!`);
    return;
  }

  return packData.WEAPONS;
}
