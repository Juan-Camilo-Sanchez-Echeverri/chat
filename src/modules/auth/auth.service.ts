import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { UserAuth } from './interfaces/user-auth.interface';
import { WsException } from '@nestjs/websockets';
import { User } from '../users/types/user.types';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async authenticateSocket(client: Socket): Promise<User> {
    const token = this.getTokenFromSocket(client);

    const payload = await this.jwtService.verifyAsync<UserAuth>(token);

    if (!payload) throw new WsException('Invalid token');

    const user = await this.userService.findOneById(payload._id);
    if (!user) throw new WsException('User not found');

    return user;
  }

  private getTokenFromSocket(client: Socket): string {
    const { handshake } = client;
    const token = handshake.headers.authorization || handshake.query.tk;

    if (!token) throw new WsException('Token not found in socket connection');

    return String(token);
  }
}
