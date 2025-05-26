import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';

import { User } from '@modules/users/types/user.types';

export const WsUser = createParamDecorator((_data, ctx: ExecutionContext) => {
  const client = ctx.switchToWs().getClient<Socket>();
  const data = client.data as { user: User };

  return data.user;
});
