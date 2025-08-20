import { Injectable } from '@nestjs/common';

import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { Role, Status } from '@common/enums';
import { ConnectionService } from '@common/services';
import { ObjectId } from '@common/types';

import { UserDocument } from './types/user.types';

@Injectable()
export class UsersService extends ConnectionService<UserDocument> {
  constructor(@InjectConnection() connection: Connection) {
    super(connection, 'users');
  }

  async findActiveInstitutionAdmins(
    institution: ObjectId,
  ): Promise<UserDocument[]> {
    const [admins, rectors] = await Promise.all([
      this.collection.find({
        role: Role.Admin,
        status: Status.ACTIVE,
        institution,
      }),
      this.collection.find({
        role: Role.Rector,
        status: Status.ACTIVE,
        institution,
      }),
    ]);

    const [adminsArray, rectorsArray] = await Promise.all([
      admins.toArray(),
      rectors.toArray(),
    ]);

    return [...adminsArray, ...rectorsArray];
  }
}
