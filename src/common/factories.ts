import { Bot, Context, Middleware, NextFunction } from 'grammy';
import { BotContext, GrammyBotOptions } from 'src/types/interfaces';

export async function createBotFactory(options: GrammyBotOptions): Promise<Bot<BotContext>> {
  const bot = new Bot<BotContext>(options.token, {
    ContextConstructor: BotContext,
  });
  options.middleware?.map((middleware) => bot.use(middleware));
  options.composers?.map((composer) => bot.use(composer));
  bot.start();
  return bot;
}
