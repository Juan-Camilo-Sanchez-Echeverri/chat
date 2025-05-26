import { WsException } from '@nestjs/websockets';
import { ArgumentsHost, Catch, WsExceptionFilter } from '@nestjs/common';

import { Server } from 'socket.io';

import { SocketErrorEvent } from '@common/interfaces/socket/socket-events.interface';

@Catch(WsException)
export class SocketExceptionFilter implements WsExceptionFilter<WsException> {
  catch(exception: WsException, host: ArgumentsHost): void {
    const client = host.switchToWs().getClient<Server>();
    const error = exception.getError();

    const { event, message } = error as SocketErrorEvent;

    client.emit(event, { message });
  }
}
