import { Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { envs } from './envs';
import { ExecModes } from '@common/enums';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: envs.dbUrl,
      connectionFactory: (connection: Connection) => {
        connection.set('debug', envs.nodeEnv === ExecModes.LOCAL);
        return connection;
      },
    };
  }
}
