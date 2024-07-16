import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  private rooms: { [key: string]: string[] } = {};

  createRoom(roomName: string): boolean {
    if (!this.rooms[roomName]) {
      this.rooms[roomName] = [];
      return true;
    }
    return false;
  }

  joinRoom(roomName: string, clientId: string): boolean {
    if (this.rooms[roomName] && !this.rooms[roomName].includes(clientId)) {
      this.rooms[roomName].push(clientId);
      return true;
    }
    return false;
  }

  leaveRoom(roomName: string, clientId: string): boolean {
    if (this.rooms[roomName]) {
      this.rooms[roomName] = this.rooms[roomName].filter(id => id !== clientId);
      return true;
    }
    return false;
  }

  getClientsInRoom(roomName: string): string[] {
    return this.rooms[roomName] || [];
  }

  deleteRoom(roomName: string): boolean {
    if (this.rooms[roomName]) {
      delete this.rooms[roomName];
      return true;
    }
    return false;
  }
}