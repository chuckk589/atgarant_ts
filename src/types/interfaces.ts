import { ModuleMetadata, Type } from "@nestjs/common";
import { Composer, Context, FilterQuery, Middleware, SessionFlavor } from "grammy";
import { I18nContextFlavor } from "@grammyjs/i18n";
import { MenuFlavor } from "@grammyjs/menu";
import { createOfferDto } from "src/mikroorm/dto/create-offer.dto";

export interface GrammyBotOptions {
  token: string;
  composers?: any[],
  middleware?: any[]
}

export interface GrammyBotOptionsAsync extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<BotOptionsFactory>;
  useClass?: Type<BotOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<GrammyBotOptions> | GrammyBotOptions
  inject?: any[];
}

export interface BotOptionsFactory {
  createBotOptions(): Promise<GrammyBotOptions> | GrammyBotOptions;
}

export interface Session {
  pendingOffer?: createOfferDto
}

export type BotContext = Context & SessionFlavor<Session> & I18nContextFlavor & MenuFlavor

export interface ListenerMetadata {
  method: TMethod;
  query: string | RegExp;
  key: string;
}
export enum TMethod {
  command = "command",
  on = "on",
  use = "use",
  hears = "hears"
}
