import { WsException } from '@nestjs/websockets';
import { ArgumentsHost, Catch, WsExceptionFilter } from '@nestjs/common';

import { Server } from 'socket.io';

import { WsErrorEvent } from '@common/interfaces/websocket/events.interface';

@Catch(WsException)
export class WebSocketErrorFilter implements WsExceptionFilter<WsException> {
  catch(exception: WsException, host: ArgumentsHost): void {
    const client = host.switchToWs().getClient<Server>();
    const error = exception.getError();

    const { event, message } = error as WsErrorEvent;

    client.emit(event, { message });
  }
}
