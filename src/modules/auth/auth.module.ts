import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';

import { JwtModule } from '@nestjs/jwt';
import { envs } from '@config/envs';
import { UsersModule } from '../users/users.module';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: envs.jwtKey,
      global: true,
      signOptions: { expiresIn: '10d' },
    }),
    UsersModule,
  ],

  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
