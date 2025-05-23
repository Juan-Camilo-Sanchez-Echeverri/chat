import { Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

import { envs } from './envs';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: envs.dbUrl,
      connectionFactory: (connection) => {
        connection.set('debug', true);
        return connection;
      },
    };
  }
}
