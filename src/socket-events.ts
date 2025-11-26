function createEvents<T extends readonly string[]>(
  events: T,
): { [K in T[number]]: K } {
  return events.reduce(
    (acc, name) => ({ ...acc, [name]: name }),
    {} as { [K in T[number]]: K },
  );
}

export const SocketEvents = createEvents([
  "BROADCAST_MESSAGES",
  "CREATE_GAME",
  "SEND_CARDS_META",
  "SEND_PUBLIC_DATA",
  "REQUEST_ROLE",
  "SEND_ROLE",
  "REQUEST_CHAR_OPTIONS",
  "SELECT_CHAR",
  "SEND_CHAR_OPTIONS",
  "SEND_TIMER_UPDATE",
  "JOIN_GAME",
  "GAME_CREATED",
  "ANSWER_TEST_PASSWORD",
  "ASK_FOR_LOBBY",
  "ANSWER_ASK_FOR_LOBBY",
  "CREATE_LOBBY",
  "EXIT_LOBBY",
  "JOIN_LOBBY",
  "KICKED_OUT",
  "KICK_OUT_PLAYER",
  "LOBBY_CREATED",
  "LOBBY_UPDATE",
  "REQUEST_LOBBY_DATA",
  "SEND_LOBBY_DATA",
  "SUBSCRIBE_LOBBIES",
  "TOGGLE_READY",
  "TOGGLE_SEAT_TYPE",
  "UNSUBSCRIBE_LOBBIES",
  "connection",
  "disconnect",
] as const);
