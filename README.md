
## Description

A simple websocket event-driven written in NestJS using socket.io

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
$ pnpm run start:dev
```

## Events

#### createRoom
Message: roomName
Create a room with the given room name.
#### roomCreated
Listen to the roomCreated event and emit a message to the client about the room creation.
#### joinRoom
Message: roomName
Join a room with the given room name.
#### error
Listen to the error event to emit a message about the error
#### joinedRoom
Listen to the joinedRoom event and emit a message to the client about the room joining.
#### leaveRoom
Message: roomName
Leave a room with the given room name
#### leftRoom
Listen to the leftRoom event and emit a message to the client about the room leaving.
#### message
Message: {roomName: string, message: string}
Send a message to a room
#### notifications
Listen to the notifications event to emit a message to the client about the notifications.
