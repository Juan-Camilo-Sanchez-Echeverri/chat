import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { InitChatDto } from './dto';
import { Server, Socket } from 'socket.io';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let chatService: ChatService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatGateway, ChatService, JwtService],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    chatService = module.get<ChatService>(ChatService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should handle connection', async () => {
    const client = {
      handshake: { headers: { 'x-token': 'test-token' }, query: {} },
      join: jest.fn(),
      data: {},
      disconnect: jest.fn(),
    } as unknown as Socket;

    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ id: 'user-id' });

    await gateway.handleConnection(client);

    expect(client.join).toHaveBeenCalledWith('user-id');
    expect(client.data.user).toEqual({ id: 'user-id' });
  });

  it('should handle disconnection', () => {
    const client = { id: 'client-id', leave: jest.fn() } as unknown as Socket;

    gateway.handleDisconnect(client);

    expect(client.leave).toHaveBeenCalledWith('client-id');
  });

  it('should create chat', async () => {
    const client = { data: { user: { id: 'user-id' } } } as unknown as Socket;
    const createChatDto: InitChatDto = {
      user: client.data.user,
      to: '',
    };
    const chat = { id: 'chat-id', messages: ['message1', 'message2'] };

    jest.spyOn(chatService, 'initChat').mockResolvedValue(chat);
    jest.spyOn(gateway.server, 'emit');

    await gateway.create(createChatDto, client);

    expect(chatService.initChat).toHaveBeenCalledWith(createChatDto);
    expect(gateway.server.emit).toHaveBeenCalledWith(
      'messages-chat',
      chat.messages,
    );
    expect(gateway.server.emit).toHaveBeenCalledWith('init-chat', {
      id: 'chat-id',
    });
  });

  it('should handle create chat error', async () => {
    const client = { data: { user: { id: 'user-id' } } } as unknown as Socket;

    const createChatDto: InitChatDto = {
      user: client.data.user,
      to: '',
    };

    jest
      .spyOn(chatService, 'initChat')
      .mockRejectedValue(new Error('Test error'));
    jest.spyOn(gateway.server, 'emit');

    await gateway.create(createChatDto, client);

    expect(gateway.server.emit).toHaveBeenCalledWith('init-chat', {
      error: 'Test error',
    });
  });
});
