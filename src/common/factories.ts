import { Bot, Context } from "grammy";
import { GrammyBotOptions } from "src/types/interfaces";

export async function createBotFactory<T extends Context>(options: GrammyBotOptions): Promise<Bot<T>> {
    const bot = new Bot<T>(options.token);
    options.middleware?.map(middleware => bot.use(middleware))
    options.composers?.map(composer => bot.use(composer))
    bot.start()
    return bot;
}

