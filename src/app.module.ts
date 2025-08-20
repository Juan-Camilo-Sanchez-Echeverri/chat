import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { MongooseConfigService } from '@config/db';

import { AuthModule } from '@modules/auth/auth.module';
import { ChatMessagesModule } from '@modules/chat-messages/chat-messages.module';
import { ChatModule } from '@modules/chat/chat.module';
import { StudentsModule } from '@modules/students/students.module';
import { UsersModule } from '@modules/users/users.module';

@Module({
  imports: [
    // Global common modules
    MongooseModule.forRootAsync({ useClass: MongooseConfigService }),

    // Business modules
    ChatModule,
    AuthModule,
    UsersModule,
    ChatMessagesModule,
    StudentsModule,
  ],
})
export class AppModule {}
