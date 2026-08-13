import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { Game } from "../../core/game.js";
import { AiBrain } from "../AiBrain.js";
import { EventType, GameEvent } from "../../../../eventSystem/types.js";

export interface AiHandlerContext<K extends keyof EventType = keyof EventType> {
  game: Game;
  data: EventType[K];
  event: GameEvent;
  brain?: AiBrain;
  brains: Map<string, AiBrain>;
}

export type AiHandler<K extends keyof EventType = any> = (
  ctx: AiHandlerContext<K>,
) => void;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let handlersRegistry: Record<string, AiHandler<any>> | null = null;

function getAllHandlerFiles(dirPath: string): string[] {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      files = files.concat(getAllHandlerFiles(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

export async function getAiHandlers(): Promise<Record<string, AiHandler<any>>> {
  if (handlersRegistry) return handlersRegistry;

  const handlers: Record<string, AiHandler<any>> = {};
  const allFilePaths = getAllHandlerFiles(__dirname);

  for (const filePath of allFilePaths) {
    const fileName = path.basename(filePath);

    if (
      fileName.startsWith("index") ||
      fileName.startsWith("loader") ||
      fileName.startsWith("types") ||
      fileName.endsWith(".d.ts") ||
      fileName.endsWith(".map") ||
      (!fileName.endsWith(".ts") && !fileName.endsWith(".js"))
    ) {
      continue;
    }

    const eventType = fileName.split(".")[0];

    const module = await import(pathToFileURL(filePath).href);
    const handler = module.default;

    if (typeof handler === "function") {
      handlers[eventType] = handler;
    } else {
      console.warn(
        `[AiHandlers] File at ${filePath} is missing a default export function.`,
      );
    }
  }

  handlersRegistry = handlers;
  return handlersRegistry;
}
