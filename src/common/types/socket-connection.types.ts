import { Socket, Server } from 'socket.io';

import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from '../interfaces/socket';

type InterServerEvents = Record<never, never>;

export type AppSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type AppServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
