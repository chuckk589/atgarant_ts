import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { TelegramService } from './telegram.service';
import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AppConfigService } from 'src/app-config/app-config.service';
import { Inject, forwardRef } from '@nestjs/common';
import { Bot } from 'grammy';
import { Socket, Server } from 'socket.io';
import { BOT_NAME } from 'src/constants';
import { BotContext, NewArbResponse } from 'src/types/interfaces';
const input = require('input');

@WebSocketGateway()
export class TelegramGateway {
  constructor(
    private readonly telegramService: TelegramService,
    @InjectPinoLogger('TelegramGateway') private readonly logger: PinoLogger,
    private readonly AppConfigService: AppConfigService,
    @Inject(forwardRef(() => BOT_NAME)) private bot: Bot<BotContext>,
  ) {
    if (this.AppConfigService.get('node_env') !== 'development') this.init();
  }
  private clientStatus = false;
  private client: TelegramClient;

  init = async () => {
    try {
      const stringSession = new StringSession(this.AppConfigService.get('APP_SESSION_STRING'));
      this.client = new TelegramClient(
        stringSession,
        Number(this.AppConfigService.get('APP_API_ID')),
        this.AppConfigService.get('APP_API_HASH'),
        { connectionRetries: 5 },
      );
      await this.client.connect();
      this.clientStatus = true;
    } catch (error) {
      this.logger.error(`TelegramGateway init failed! ${error}`);
    }
  };
  newArbitraryChat = async (offerId: number): Promise<NewArbResponse> => {
    if (!this.clientStatus) throw new Error('TelegramGateway clientStatus false');
    const botData = await this.bot.api.getMe();
    const botUsername = `@${botData.username}`;
    const newChat: any = await this.client.invoke(
      new Api.channels.CreateChannel({
        broadcast: false,
        megagroup: true,
        about: '',
        title: `Арбитраж по сделке ${offerId}`,
      }),
    );
    await this.client.invoke(
      new Api.channels.InviteToChannel({
        channel: +`-100${newChat.chats[0].id}`,
        users: [botUsername],
      }),
    );
    const inviteLink = await this.client.invoke(new Api.channels.GetFullChannel({ channel: newChat.chats[0].id }));
    return { error: false, inviteLink: inviteLink.fullChat.exportedInvite.link, chat_id: `100${newChat.chats[0].id}` };
  };
  getChatHistory = async (arbId: number): Promise<string> => {
    if (!this.clientStatus) throw new Error('TelegramGateway clientStatus false');
    const arb = await this.telegramService.getArbitrary(arbId);
    const result: any = await this.client.invoke(
      new Api.messages.GetHistory({
        peer: -1 * Number(arb.chatId),
      }),
    );
    result.messages.reverse();
    const involvedUsers = result.users.reduce((sum: any, cur: any) => {
      sum[cur.id] = {
        username: cur.username,
        phone: cur.phone,
      };
      return sum;
    }, {});
    const generatedOutput = result.messages.reduce((sum: any, cur: any) => {
      if (cur.message)
        sum += `${new Date(cur.date * 1000).toLocaleString()} ${
          involvedUsers[cur.fromId.userId].username || involvedUsers[cur.fromId.userId].phone
        }: ${cur.message}\n`;
      return sum;
    }, '');
    return generatedOutput;
  };
  //TODO: aint right
  @SubscribeMessage('phoneCode')
  async handleEvent(@MessageBody() data: string, @ConnectedSocket() socket: Socket): Promise<string> {
    await this.client.invoke(new Api.auth.LogOut());
    this.client
      .start({
        phoneNumber: data,
        phoneCode: function () {
          return new Promise((res, rej) => {
            socket.on('code', (code, callback) => {
              callback('got code');
              res(code);
            });
            setTimeout(() => {
              rej();
            }, 60 * 1000);
          });
        },
        onError: (err) => {
          this.logger.error(err);
          socket.emit('done', { error: err });
        },
      })
      .then(async () => {
        const newSessionString = this.client.session.save() as any;
        await this.telegramService.updateSessionString(newSessionString);
        socket.emit('done', { session: newSessionString });
        process.env.APP_SESSION_STRING = newSessionString;
      });
    return data;
  }

  private async devInitConnection() {
    console.log('Loading interactive example...');
    const client = new TelegramClient(
      new StringSession(''),
      Number(this.AppConfigService.get('APP_API_ID')),
      this.AppConfigService.get('APP_API_HASH'),
      {
        connectionRetries: 5,
      },
    );
    await client.start({
      phoneNumber: async () => await input.text('Please enter your number: '),
      password: async () => await input.text('Please enter your password: '),
      phoneCode: async () => await input.text('Please enter the code you received: '),
      onError: (err) => console.log(err),
    });
    console.log('You should now be connected.');
    console.log(client.session.save()); // Save this string to avoid logging in again
    await client.sendMessage('me', { message: 'Hello!' });
  }
}
