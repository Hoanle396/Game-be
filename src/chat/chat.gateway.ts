import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JoinRoom, Player, Room, playerDefault } from './dto/Player';
import { Users } from 'src/entities/users.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  socket: Server;

  player: Map<string, Player> = new Map();

  room: Map<string, Room> = new Map();

  @SubscribeMessage('subscribe')
  handleSubscribe(
    client: Socket,
    payload: Users & {
      tankId: number;
    }
  ): void {
    const player = playerDefault;
    player.tankId = payload.tankId;
    player.name = payload.fullname;
    player.id = payload.id;
    player.socketId = client.id;

    this.player[client.id] = player;
    console.log(`Subscription done: ${payload}`);
  }

  @SubscribeMessage('play')
  handleJoin(client: Socket, payload: JoinRoom): void {
    const player = this.player[payload.player_id];
    let roomId = '';
    if (payload.id) {
      if (this.room[payload.id]) {
        const room = this.room[payload.id];
        if (room.player_1 && room.player_2) {
          // room not avilbale
        } else if (room.player_1 && !room.player_2) {
          room.player_2 = player;
        } else {
          room.player_1 = player;
        }
      } else {
        const room = new Room();
        room.player_1 = player;
        room.mapId = 1; //default map is 1;
      }
      roomId = payload.id;
    } else {
      // TODO: random game
      for (const r of this.room) {
        if (r[1].player_1 && !r[1].player_2) {
          const room = r[1];
          room.player_2 = player;
          this.room[r[0]] = room;
          roomId = r[0];
          break;
        }
      }
    }
    this.socket
      .to(this.room[roomId].player_1.socketId)
      .emit('joined', this.room[roomId]);
    this.socket
      .to(this.room[roomId].player_2.socketId)
      .emit('joined', this.room[roomId]);
    console.log(`Subscription done: ${payload}`);
  }

  @SubscribeMessage('send')
  send(@MessageBody() data: any) {
    console.log(data);
    this.socket.emit('receive', data);
  }

  @SubscribeMessage('play')
  handleMessage(client: Socket, payload: any): void {
    this.socket.to(this.player[payload.to_user]).emit('tank', payload);
  }

  afterInit() {
    console.log('socket avaible');
  }

  handleDisconnect(client: Socket) {
    this.player.delete(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }
}
