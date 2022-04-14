import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common";
import { Composer, FilterQuery } from "grammy";
import { LISTENERS_METADATA } from "src/constants";
import { ListenerMetadata, TMethod } from "src/types/interfaces";
import { match } from "./helpers";

export const ComposerController = (): ClassDecorator => SetMetadata('COMPOSER_METADATA', true);

export const On = createListenerDecorator(TMethod.on);
export const Command = createListenerDecorator(TMethod.command);
export const Hears = createListenerDecorator(TMethod.hears);

function createListenerDecorator(method: TMethod) {
    return (query: string): PropertyDecorator => {
        return (
            _target: any,
            _key?: string | symbol,
        ) => {
            const metadata: ListenerMetadata[] = [{ method, query: queryGenerator(method, query), key: String(_key) }]
            const previousValue = Reflect.getMetadata(LISTENERS_METADATA, _target) || [];
            const value = [...previousValue, ...metadata];
            Reflect.defineMetadata(LISTENERS_METADATA, value, _target);
        };
    };
}
const queryGenerator = (method: TMethod, query: string): RegExp | string => {
    return method == TMethod.hears ? match(query) : query
}