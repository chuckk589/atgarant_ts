"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const telegram_service_1 = require("./telegram.service");
const telegram_1 = require("telegram");
const sessions_1 = require("telegram/sessions");
const nestjs_pino_1 = require("nestjs-pino");
const app_config_service_1 = require("../app-config/app-config.service");
const common_1 = require("@nestjs/common");
const grammy_1 = require("grammy");
const socket_io_1 = require("socket.io");
const constants_1 = require("../constants");
const input = require('input');
let TelegramGateway = class TelegramGateway {
    constructor(telegramService, logger, AppConfigService, bot) {
        this.telegramService = telegramService;
        this.logger = logger;
        this.AppConfigService = AppConfigService;
        this.bot = bot;
        this.clientStatus = false;
        this.init = async () => {
            try {
                const stringSession = new sessions_1.StringSession(this.AppConfigService.get('APP_SESSION_STRING'));
                this.client = new telegram_1.TelegramClient(stringSession, Number(this.AppConfigService.get('APP_API_ID')), this.AppConfigService.get('APP_API_HASH'), { connectionRetries: 5 });
                await this.client.connect();
                this.clientStatus = true;
            }
            catch (error) {
                this.logger.error(`TelegramGateway init failed! ${error}`);
            }
        };
        this.newArbitraryChat = async (offerId) => {
            if (!this.clientStatus)
                throw new Error('TelegramGateway clientStatus false');
            const botData = await this.bot.api.getMe();
            const botUsername = `@${botData.username}`;
            const newChat = await this.client.invoke(new telegram_1.Api.channels.CreateChannel({
                broadcast: false,
                megagroup: true,
                about: '',
                title: `Арбитраж по сделке ${offerId}`,
            }));
            await this.client.invoke(new telegram_1.Api.channels.InviteToChannel({
                channel: +`-100${newChat.chats[0].id}`,
                users: [botUsername],
            }));
            const inviteLink = await this.client.invoke(new telegram_1.Api.channels.GetFullChannel({ channel: newChat.chats[0].id }));
            return { error: false, inviteLink: inviteLink.fullChat.exportedInvite.link, chat_id: `100${newChat.chats[0].id}` };
        };
        this.getChatHistory = async (arbId) => {
            if (!this.clientStatus)
                throw new Error('TelegramGateway clientStatus false');
            const arb = await this.telegramService.getArbitrary(arbId);
            const result = await this.client.invoke(new telegram_1.Api.messages.GetHistory({
                peer: -1 * Number(arb.chatId),
            }));
            result.messages.reverse();
            const involvedUsers = result.users.reduce((sum, cur) => {
                sum[cur.id] = {
                    username: cur.username,
                    phone: cur.phone,
                };
                return sum;
            }, {});
            const generatedOutput = result.messages.reduce((sum, cur) => {
                if (cur.message)
                    sum += `${new Date(cur.date * 1000).toLocaleString()} ${involvedUsers[cur.fromId.userId].username || involvedUsers[cur.fromId.userId].phone}: ${cur.message}\n`;
                return sum;
            }, '');
            return generatedOutput;
        };
        if (this.AppConfigService.get('node_env') !== 'development')
            this.init();
    }
    async handleEvent(data, socket) {
        await this.client.invoke(new telegram_1.Api.auth.LogOut());
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
            const newSessionString = this.client.session.save();
            await this.telegramService.updateSessionString(newSessionString);
            socket.emit('done', { session: newSessionString });
            process.env.APP_SESSION_STRING = newSessionString;
        });
        return data;
    }
    async devInitConnection() {
        console.log('Loading interactive example...');
        const client = new telegram_1.TelegramClient(new sessions_1.StringSession(''), Number(this.AppConfigService.get('APP_API_ID')), this.AppConfigService.get('APP_API_HASH'), {
            connectionRetries: 5,
        });
        await client.start({
            phoneNumber: async () => await input.text('Please enter your number: '),
            password: async () => await input.text('Please enter your password: '),
            phoneCode: async () => await input.text('Please enter the code you received: '),
            onError: (err) => console.log(err),
        });
        console.log('You should now be connected.');
        console.log(client.session.save());
        await client.sendMessage('me', { message: 'Hello!' });
    }
};
__decorate([
    (0, websockets_1.SubscribeMessage)('phoneCode'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], TelegramGateway.prototype, "handleEvent", null);
TelegramGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __param(1, (0, nestjs_pino_1.InjectPinoLogger)('TelegramGateway')),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => constants_1.BOT_NAME))),
    __metadata("design:paramtypes", [telegram_service_1.TelegramService,
        nestjs_pino_1.PinoLogger,
        app_config_service_1.AppConfigService,
        grammy_1.Bot])
], TelegramGateway);
exports.TelegramGateway = TelegramGateway;
//# sourceMappingURL=telegram.gateway.js.map