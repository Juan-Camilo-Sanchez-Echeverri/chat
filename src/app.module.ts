import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { MongooseConfigService } from './modules/config/db';
import { ChatModule } from './modules/chat/chat.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ChatMessagesModule } from './modules/chat-messages/chat-messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({ useClass: MongooseConfigService }),
    ChatModule,
    AuthModule,
    UsersModule,
    ChatMessagesModule,
  ],
})
export class AppModule {}
