import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { UserDocument } from './types/user.types';
import { ConnectionService } from '@common/services';

@Injectable()
export class UsersService extends ConnectionService<UserDocument> {
  constructor(@InjectConnection() connection: Connection) {
    super(connection, 'users');
  }
}
