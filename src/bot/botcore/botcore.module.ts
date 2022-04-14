import { Module, DynamicModule, Provider } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Composer, Context, Middleware } from "grammy";
import { createBotFactory } from "src/common/factories";
import { LISTENERS_METADATA } from "src/constants";
import { GrammyBotOptionsAsync, GrammyBotOptions, BotOptionsFactory, ListenerMetadata, TMethod, BotContext } from "src/types/interfaces";


@Module({})
export class BotCoreModule {
    static forRootAsync<T extends Context>(options: GrammyBotOptionsAsync): DynamicModule {
        //const { imports, injects } = this.composeDependencies(options)
        return {
            module: BotCoreModule,
            imports: options.imports,
            providers: [
                {
                    provide: 'telegrafBotName',
                    useFactory: async (options: GrammyBotOptions) => await createBotFactory<T>(options),
                    inject: ['JWT_MODULE_OPTIONS'],
                },
                {
                    provide: 'JWT_MODULE_OPTIONS',
                    useFactory: options.useFactory,
                    inject: options.inject || [],
                }
            ]
        };
    }
    // private static generateComposers(options: GrammyBotOptionsAsync): Composer<any>[] {
    //     const composers = options.include?.reduce((sum, cur) => {
    //         //search for composerService amoung all services attached to module
    //         const composerService = Reflect.getMetadata('providers', cur).find((p: Object) => Reflect.getMetadata('COMPOSER_METADATA', p))
    //         //slice 'constructor' key
    //         const keys = Object.getOwnPropertyNames(cur.prototype).slice(1)
    //         const composer = new Composer()
    //         keys.forEach(key => {
    //             const data: ListenerMetadata = Reflect.getMetadata(LISTENERS_METADATA, composerService.prototype[key])
    //             if (data.method == TMethod.on) {
    //                 composer.on(data.query, composerService.prototype[key])
    //             } else if (data.method == TMethod.command) {
    //                 composer.command(data.query, composerService.prototype[key])
    //             } else if (data.method == TMethod.use) {
    //                 composer.use(composerService.prototype[key])
    //             }
    //         })
    //         sum.push(composer)
    //         return sum
    //     }, [])
    //     console.log(composers)
    //     return composers
    // }
    // private static composeDependencies(options: GrammyBotOptionsAsync): { imports: any, injects: any } {
    //     return {
    //         imports: options.imports?.concat(options.include || []) || [],
    //         injects: options.inject?.concat(
    //             ...options.include
    //                 ?.map(i => Reflect.getMetadata('providers', i)
    //                     .filter((p: Object) => Reflect.getMetadata('COMPOSER_METADATA', p))) || []
    //         ) || []
    //     }
    // }
    // private static createAsyncProviders(options: GrammyBotOptionsAsync): Provider[] {
    //     if (options.useExisting || options.useFactory) {
    //         return [this.createAsyncOptionsProvider(options)];
    //     }
    //     return [
    //         this.createAsyncOptionsProvider(options),
    //         {
    //             provide: options.useClass!,
    //             useClass: options.useClass!
    //         }
    //     ];
    // }

    // private static createAsyncOptionsProvider(options: GrammyBotOptionsAsync): Provider {
    //     if (options.useFactory) {
    //         return {
    //             provide: 'JWT_MODULE_OPTIONS',
    //             useFactory: options.useFactory,
    //             inject: options.inject || []
    //         };
    //     }
    //     return {
    //         provide: 'JWT_MODULE_OPTIONS',
    //         useFactory: async (optionsFactory: BotOptionsFactory) => await optionsFactory.createBotOptions(),
    //         inject: [options.useExisting! || options.useClass]
    //     };
    // }
}