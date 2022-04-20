import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common";
import { Composer, FilterQuery } from "grammy";
import { LISTENERS_METADATA } from "src/constants";
import { BotContext, ListenerMetadata, MenuListenerMetadata, TMethod } from "src/types/interfaces";
import { Menu as MenuGrammy } from "@grammyjs/menu";

export function ComposerController<T extends { new(...args: any[]): {} }>(constructor: T) {
    const fn = (fn: Function) => fn()
    return class extends constructor {
        _composer = fn(() => {
            const composer = new Composer()
            const handlers: ListenerMetadata[] = Reflect.getMetadata(LISTENERS_METADATA, constructor.prototype)
            const that = <any>this
            handlers.map(handler => {
                if (handler.method == TMethod.on) {
                    composer.on(handler.query as FilterQuery, that[handler.key])
                } else if (handler.method == TMethod.command) {
                    composer.command(handler.query as FilterQuery, that[handler.key])
                } else if (handler.method == TMethod.use || handler.method == TMethod.menu) {
                    composer.use(that[handler.key])
                } else if (handler.method == TMethod.hears) {
                    composer.hears(handler.query, that[handler.key])
                }
            })
            return composer
        })
    };

}

export function MenuController<T extends { new(...args: any[]): {} }>(constructor: T) {
    const fn = (fn: Function) => fn()
    //console.log(Reflect.getMetadata(LISTENERS_METADATA, constructor.prototype))
    return class extends constructor {
        _menu = fn(() => {
            const menus: MenuListenerMetadata[] = Reflect.getMetadata(LISTENERS_METADATA, constructor.prototype)
            console.log(menus.length)
            if (menus.length !== 1) throw new Error('only 1 menu instance is allowed per menu module')
            const that = <any>this
            return that[menus[0].key]
        })
    };

}

export function RouterController<T extends { new(...args: any[]): {} }>(constructor: T) {
    const fn = (fn: Function) => fn()
    //console.log(Reflect.getMetadata(LISTENERS_METADATA, constructor.prototype))
    return class extends constructor {
        _router = fn(() => {
            const router: ListenerMetadata[] = Reflect.getMetadata(LISTENERS_METADATA, constructor.prototype)
            const that = <any>this
            return that[router.pop()?.key]
        })
    };

}
export const On = createListenerDecorator<FilterQuery | FilterQuery[]>(TMethod.on);
export const Command = createListenerDecorator<string>(TMethod.command);
export const Hears = createListenerDecorator<string>(TMethod.hears);
export const Use = createListenerDecorator(TMethod.use);

function createListenerDecorator<T>(method: TMethod) {
    return (query?: T): PropertyDecorator => {
        return (
            _target: any,
            _key?: string | symbol,
        ) => {
            const metadata: ListenerMetadata[] = [new ListenerMetadata(method, query, _key)]
            const previousValue = Reflect.getMetadata(LISTENERS_METADATA, _target) || [];
            const value = [...previousValue, ...metadata];
            Reflect.defineMetadata(LISTENERS_METADATA, value, _target);
        };
    };
}
export function Menu(name: string): PropertyDecorator {
    return (
        _target: any,
        _key?: string | symbol,
    ) => {
        const metadata: MenuListenerMetadata[] = [new MenuListenerMetadata(name, _key)]
        const previousValue = Reflect.getMetadata(LISTENERS_METADATA, _target) || [];
        const value = [...previousValue, ...metadata];
        Reflect.defineMetadata(LISTENERS_METADATA, value, _target);
    };
};