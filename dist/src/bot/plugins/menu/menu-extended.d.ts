import { Context, Middleware, Filter, MiddlewareObj } from "grammy";
import { InlineKeyboardButton, LoginUrl, InlineKeyboardMarkup } from "grammy/out/platform.node";
export interface MenuFlavor {
    match?: string;
    menu: MenuControlPanel;
}
export interface MenuControlPanel {
    update(config: {
        immediate: true;
    }): Promise<void>;
    update(config?: {
        immediate?: false;
    }): void;
    close(config: {
        immediate: true;
    }): Promise<void>;
    close(config?: {
        immediate?: false;
    }): void;
    back(config: {
        immediate: true;
    }): Promise<void>;
    back(config?: {
        immediate?: false;
    }): void;
    nav(to: string, config: {
        immediate: true;
    }): Promise<void>;
    nav(to: string, config?: {
        immediate?: false;
    }): void;
}
declare type MenuMiddleware<C extends Context> = Middleware<Filter<C, "callback_query:data"> & MenuFlavor>;
declare type MaybePromise<T> = T | Promise<T>;
declare type DynamicString<C extends Context> = ((ctx: C) => MaybePromise<string>);
declare type MaybeDynamicString<C extends Context> = string | DynamicString<C>;
interface TextAndPayload<C extends Context> {
    text: MaybeDynamicString<C>;
    payload?: MaybeDynamicString<C>;
}
declare type MaybePayloadString<C extends Context> = MaybeDynamicString<C> | TextAndPayload<C>;
declare type Cb<C extends Context> = Omit<InlineKeyboardButton.CallbackButton, "callback_data"> & {
    middleware: MenuMiddleware<C>[];
    payload?: MaybeDynamicString<C>;
};
declare type NoCb = Exclude<InlineKeyboardButton, InlineKeyboardButton.CallbackButton>;
declare type RemoveAllTexts<T> = T extends {
    text: string;
} ? Omit<T, "text"> : T;
export declare type MenuButton<C extends Context> = {
    text: MaybeDynamicString<C>;
} & RemoveAllTexts<NoCb | Cb<C>>;
declare type RawRange<C extends Context> = MenuButton<C>[][];
declare type MaybeRawRange<C extends Context> = MenuRange<C> | RawRange<C>;
declare type DynamicRange<C extends Context> = (ctx: C) => MaybePromise<MaybeRawRange<C>>;
declare type MaybeDynamicRange<C extends Context> = MaybeRawRange<C> | DynamicRange<C>;
declare const ops: unique symbol;
export declare class MenuRange<C extends Context> {
    [ops]: MaybeDynamicRange<C>[];
    addRange(...range: MaybeDynamicRange<C>[]): this;
    add(...btns: MenuButton<C>[]): this;
    row(): this;
    url(text: MaybeDynamicString<C>, url: string): this;
    text(text: MaybeDynamicString<C>, ...middleware: MenuMiddleware<C>[]): this;
    text(text: TextAndPayload<C>, ...middleware: MenuMiddleware<C & {
        match: string;
    }>[]): this;
    text(text: MaybePayloadString<C>, ...middleware: MenuMiddleware<C>[]): this;
    login(text: MaybeDynamicString<C>, loginUrl: string | LoginUrl): this;
    switchInline(text: MaybeDynamicString<C>, query?: string): this;
    switchInlineCurrent(text: MaybeDynamicString<C>, query?: string): this;
    game(text: MaybeDynamicString<C>): this;
    pay(text: MaybeDynamicString<C>): this;
    submenu(text: MaybeDynamicString<C>, menu: string, ...middleware: MenuMiddleware<C>[]): this;
    submenu(text: TextAndPayload<C>, menu: string, ...middleware: MenuMiddleware<C & {
        match: string;
    }>[]): this;
    submenu(text: MaybePayloadString<C>, menu: string, ...middleware: MenuMiddleware<C>[]): this;
    back(text: MaybeDynamicString<C>, ...middleware: MenuMiddleware<C>[]): this;
    back(text: TextAndPayload<C>, ...middleware: MenuMiddleware<C & {
        match: string;
    }>[]): this;
    back(text: MaybePayloadString<C>, ...middleware: MenuMiddleware<C>[]): this;
    dynamic(rangeBuilder: (ctx: C, range: MenuRange<C>) => MaybePromise<MaybeRawRange<C> | void>): this;
    append(range: MaybeRawRange<C>): this;
}
export interface MenuOptions<C extends Context> {
    autoAnswer?: boolean;
    onMenuOutdated?: string | boolean | MenuMiddleware<C>;
    fingerprint?: DynamicString<C>;
}
export declare class Menu<C extends Context = Context> extends MenuRange<C> implements MiddlewareObj<C>, InlineKeyboardMarkup {
    private readonly id;
    private parent;
    private index;
    private readonly options;
    constructor(id: string, options?: MenuOptions<C>);
    readonly inline_keyboard: any[];
    register(menus: Menu<C> | Menu<C>[], parent?: string): void;
    private freeze;
    at(id: string): Menu<C>;
    private render;
    private prepare;
    middleware(): import("grammy").MiddlewareFn<C>;
    private makeNavInstaller;
}
export {};
