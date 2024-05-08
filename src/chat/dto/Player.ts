export class Player {
  name: string;
  socketId: string;
  id: number;
  tankId: number;
  dame: number;
  health: number;
  isDie: boolean;
  position: any;
}

export class Room {
  id: number;
  mapId: number;
  round: number;
  player_1: Player;
  player_2: Player;
  player_1_win: number;
  player_2_win: number;
}

export class JoinRoom {
  id?: string;
  player_id: number;
}

const playerDefault = new Player();
playerDefault.dame = 100;
playerDefault.isDie = false;
playerDefault.health = 200;
export { playerDefault };
