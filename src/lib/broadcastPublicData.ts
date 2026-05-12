import { io } from "../server.js";
import { SocketEvents } from "../socket-events.js";
import { formPublicData } from "./formPublicData.js";
import { lobbyManager } from "./LobbyManager.js";

type PendingBroadcast = {
  timeout: NodeJS.Timeout;
  startedAt: number;
};

const pendingBroadcasts = new Map<string, PendingBroadcast>();

const DEBOUNCE_MS = 25;
const MAX_WAIT_MS = 100;

export function broadcastPublicData(id: string) {
  const existing = pendingBroadcasts.get(id);

  const now = Date.now();

  if (existing) {
    const elapsed = now - existing.startedAt;

    clearTimeout(existing.timeout);

    const timeout = setTimeout(
      () => flushBroadcast(id),
      Math.max(0, DEBOUNCE_MS),
    );

    pendingBroadcasts.set(id, {
      timeout,
      startedAt: elapsed >= MAX_WAIT_MS ? now : existing.startedAt,
    });

    if (elapsed >= MAX_WAIT_MS) {
      flushBroadcast(id);
    }

    return;
  }

  const timeout = setTimeout(() => flushBroadcast(id), DEBOUNCE_MS);

  pendingBroadcasts.set(id, {
    timeout,
    startedAt: now,
  });
}

async function flushBroadcast(id: string) {
  const pending = pendingBroadcasts.get(id);

  if (pending) {
    clearTimeout(pending.timeout);
    pendingBroadcasts.delete(id);
  }

  const lobby = lobbyManager.lobbies[id];
  if (!lobby) return;

  const game = lobby.game;
  if (!game) return;

  const clientsInRoom = await io.in(id).fetchSockets();

  clientsInRoom.forEach((client) => {
    client.emit(SocketEvents.SEND_PUBLIC_DATA, formPublicData(client.id, game));
  });
}
