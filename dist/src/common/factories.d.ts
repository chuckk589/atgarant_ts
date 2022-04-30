import { Bot } from "grammy";
import { BotContext, GrammyBotOptions } from "src/types/interfaces";
export declare function createBotFactory(options: GrammyBotOptions): Promise<Bot<BotContext>>;
