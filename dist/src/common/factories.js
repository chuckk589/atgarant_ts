"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBotFactory = void 0;
const grammy_1 = require("grammy");
const interfaces_1 = require("../types/interfaces");
async function createBotFactory(options) {
    const bot = new grammy_1.Bot(options.token, {
        ContextConstructor: interfaces_1.BotContext,
    });
    options.middleware?.map(middleware => bot.use(middleware));
    options.composers?.map(composer => bot.use(composer));
    bot.start();
    return bot;
}
exports.createBotFactory = createBotFactory;
//# sourceMappingURL=factories.js.map