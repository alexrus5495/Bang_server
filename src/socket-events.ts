function createEvents<T extends readonly string[]>(
  events: T,
): { [K in T[number]]: K } {
  return events.reduce(
    (acc, name) => ({ ...acc, [name]: name }),
    {} as { [K in T[number]]: K },
  );
}

export const SocketEvents = createEvents([
  // DEV
  "DEV_ADD_TO_HAND",
  "DEV_HEAL_PLAYER",
  "DEV_DAMAGE_PLAYER",

  // CORE
  "connect",
  "connection",
  "disconnect",

  // LOBBY EVENTS
  "SUBSCRIBE_LOBBIES",
  "CREATE_LOBBY",
  "EXIT_LOBBY",
  "JOIN_LOBBY",
  "KICKED_OUT",
  "JOIN_GAME",
  "ASK_FOR_LOBBY",
  "ANSWER_ASK_FOR_LOBBY",
  "ANSWER_TEST_PASSWORD",
  "KICK_OUT_PLAYER",
  "REQUEST_LOBBY_DATA",
  "SEND_LOBBY_DATA",
  "LOBBY_CREATED",
  "LOBBY_UPDATE",
  "TOGGLE_READY",
  "TOGGLE_SEAT_TYPE",
  "UNSUBSCRIBE_LOBBIES",

  // PRELAUNCH EVENTS
  "CREATE_GAME",
  "GAME_CREATED",
  "SEND_CARDS_META",
  "REQUEST_ROLE",
  "SEND_ROLE",
  "REQUEST_CHAR_OPTIONS",
  "SEND_CHAR_OPTIONS",
  "SELECT_CHAR",

  // GAME EVENTS
  "BROADCAST_EVENTS",
  "SEND_TIMER_UPDATE",
  "REQUEST_HAND_VALIDATION",
  "SEND_HAND_VALIDATION_DATA",
  "PLAY_CARD",
] as const);
