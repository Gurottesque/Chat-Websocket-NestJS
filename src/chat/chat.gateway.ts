import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3001, { namespace: '/' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer() server: Server;
  
  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.server.emit('global', `Client: ${client.id} has connected `);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.server.emit('global', `Client: ${client.id} has disconnected `);
  }

  @SubscribeMessage('createRoom')
  handleCreateRoom(@ConnectedSocket() client: Socket, @MessageBody() roomName: string): boolean {
    const roomCreated = this.chatService.createRoom(roomName);
    if (roomCreated) {
      client.join(roomName);
      client.emit('roomCreated', roomName);
    } else {
      client.emit('error', `Room ${roomName} already exists.`);
    }
    return roomCreated;
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() roomName: string): boolean {
    const joined = this.chatService.joinRoom(roomName, client.id);
    if (joined) {
      client.join(roomName);
      client.emit('joinedRoom', roomName);
      this.server.to(roomName).emit('message', `Client: ${client.id} has joined `);

    } else {
      client.emit('error', `Failed to join room ${roomName}.`);
    }
    return joined;
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() roomName: string): boolean {
    const left = this.chatService.leaveRoom(roomName, client.id);
    if (left) {
      client.leave(roomName);
      client.emit('leftRoom', roomName);
    } else {
      client.emit('error', `Failed to leave room ${roomName}.`);
    }
    return left;
  }

  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: { roomName: string, message: string }): void {
    console.log(payload)
    const { roomName, message } = payload;
    console.log(`Message from client ${client.id} in room ${roomName}: ${message}`);
    this.server.to(roomName).emit('message', { clientId: client.id, message });
  
    const clientsInRoom = this.chatService.getClientsInRoom(roomName);
    clientsInRoom.forEach(clientId => {
      this.server.to(clientId).emit('notifications', { roomName, message });
    });
  }
}
