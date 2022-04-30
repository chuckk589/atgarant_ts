import { TelegramService } from './telegram.service';
import { PinoLogger } from 'nestjs-pino';
import { AppConfigService } from 'src/app-config/app-config.service';
import { Bot } from 'grammy';
import { Socket } from 'socket.io';
import { BotContext, NewArbResponse } from 'src/types/interfaces';
export declare class TelegramGateway {
    private readonly telegramService;
    private readonly logger;
    private readonly AppConfigService;
    private bot;
    constructor(telegramService: TelegramService, logger: PinoLogger, AppConfigService: AppConfigService, bot: Bot<BotContext>);
    private clientStatus;
    private client;
    init: () => Promise<void>;
    newArbitraryChat: (offerId: number) => Promise<NewArbResponse>;
    getChatHistory: (arbId: number) => Promise<string>;
    handleEvent(data: string, socket: Socket): Promise<string>;
    private devInitConnection;
}
