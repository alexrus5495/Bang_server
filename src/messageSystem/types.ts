export type Message = SystemMessage | PlayerMessage;

export interface PlayerMessage {
  id: number;
  type: "player";
  author: string;
  content: string;
  timestamp: Date;
}

export interface SystemMessage {
  id: number;
  type: "system";
  template: keyof MessageTemplate;
  data: MessageTemplate[keyof MessageTemplate];
  timestamp: Date;
}

export interface MessageTemplate {
  game_started: null;
  player_turn_end: { player: MessageData_Player };
  player_turn_start: { player: MessageData_Player };
  player_card_drawn: {
    player: MessageData_Player;
    card: {
      id: string | null;
      index: number;
    };
    visibleTo: string[];
  };
  player_played_card: { player: MessageData_Player; card: MessageData_Card };
  player_player_card_against: {
    player1: MessageData_Player;
    player2: MessageData_Player;
    card: string;
  };
}

type MessageData_Card = {
  tag: "card";
  cardId: string;
};

type MessageData_Player = {
  tag: "player";
  isAI: boolean;
  nickname: string;
  id: string;
};
