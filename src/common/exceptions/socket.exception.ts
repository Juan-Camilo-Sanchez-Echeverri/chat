import { WsException } from '@nestjs/websockets';

import { SocketErrorEvent } from '../interfaces/socket';

export class SocketException extends WsException {
  constructor(event: SocketErrorEvent['event'], message: string) {
    super({ event, message });
  }
}
