import { WsException } from '@nestjs/websockets';

import { WsErrorEvent } from '@common/interfaces/websocket/events.interface';

export class AppWsException extends WsException {
  constructor(event: WsErrorEvent['event'], message: string) {
    super({ event, message });
  }
}
