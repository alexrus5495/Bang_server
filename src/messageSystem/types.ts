export type Message = SystemMessage | PlayerMessage;

export interface PlayerMessage {
  type: "player";
  author: string;
  content: string;
  timestamp: Date;
}

export interface SystemMessage {
  type: "system";
  template: keyof MessageTemplate;
  data: MessageTemplate[keyof MessageTemplate];
  timestamp: Date;
}

export interface MessageTemplate {
  game_started: null;
  player_turn_end: { player: MessageData_Player };
  player_turn_start: { player: MessageData_Player };
  player_played_card: { player: MessageData_Player; card: MessageData_Card };
  player_player_card_against: {
    player1: MessageData_Player;
    player2: MessageData_Player;
    card: string;
  };
}

type MessageData_Card = {
  type: "card";
  data: string;
};

type MessageData_Player = {
  type: "player";
  isAI: boolean;
  data: string;
};
