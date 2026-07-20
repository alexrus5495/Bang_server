import type { CardEffectRegistry } from "../engine/cards/cardEffectsRegistry.js";
import { BANG } from "./effects/base/bang.js";
import { MISSED } from "./effects/base/missed.js";
import { BEER } from "./effects/base/beer.js";
import { GATLING } from "./effects/base/gatling.js";
import { DUEL } from "./effects/base/duel.js";
import { GENERAL_STORE } from "./effects/base/general_store.js";
import { SALOON } from "./effects/base/saloon.js";
import { STAGECOACH } from "./effects/base/stagecoach.js";
import { WELLS_FARGO } from "./effects/base/wells_fargo.js";
import { PANIC } from "./effects/base/panic.js";
import { CAT_BALOU } from "./effects/base/cat_balou.js";
import { INDIANS } from "./effects/base/indians.js";
import { VOLCANIC } from "./effects/base/volcanic.js";
import { SCHOFIELD } from "./effects/base/schofield.js";
import { REMINGTON } from "./effects/base/remington.js";
import { CARABINE } from "./effects/base/carabine.js";
import { WINCHESTER } from "./effects/base/winchester.js";
import { BARREL } from "./effects/base/barrel.js";
import { SCOPE } from "./effects/base/scope.js";
import { MUSTANG } from "./effects/base/mustang.js";
import { DYNAMITE } from "./effects/base/dynamite.js";
import { JAIL } from "./effects/base/jail.js";

export default {
  BANG,
  BARREL,
  BEER,
  CARABINE,
  CAT_BALOU,
  DUEL,
  DYNAMITE,
  GATLING,
  GENERAL_STORE,
  INDIANS,
  JAIL,
  MISSED,
  MUSTANG,
  PANIC,
  REMINGTON,
  SALOON,
  SCHOFIELD,
  SCOPE,
  STAGECOACH,
  VOLCANIC,
  WELLS_FARGO,
  WINCHESTER,
} satisfies CardEffectRegistry;
