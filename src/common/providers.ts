import { MikroOrmModuleAsyncOptions } from "@mikro-orm/nestjs";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Composer, FilterQuery } from "grammy";
import { globalComposer } from "src/bot/global/global.composer";
import { globalModule } from "src/bot/global/global.module";
import checkTime from "src/bot/middleware/checkTime";
import i18n from "src/bot/middleware/i18n";
import { session } from "src/bot/middleware/session";
import { LISTENERS_METADATA } from "src/constants";
import { GrammyBotOptionsAsync, ListenerMetadata, TMethod } from "src/types/interfaces";

export const ORMOptionsProvider: MikroOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
        return {
            type: 'mysql',
            allowGlobalContext: true,
            entities: ['./dist/mikroorm/entities/'],
            entitiesTs: ['./src/mikroorm/entities/'],
            clientUrl: configService.get('database', { infer: true })
        };
    }
}
export const botOptionsProvider: GrammyBotOptionsAsync = {
    imports: [ConfigModule, globalModule],
    inject: [ConfigService, globalComposer],
    useFactory: (configService: ConfigService, ...composers: any[]) => {
        return {
            token: configService.get('BOT_TOKEN_PROD', { infer: true }),
            composers: generateComposers(composers) || [],
            middleware: [session, checkTime, i18n.middleware()]
        };
    }
}
function generateComposers(composerServices: any[]): Composer<any>[] {
    const composers = composerServices.reduce((sum, cur) => {
        const data: ListenerMetadata[] = Reflect.getMetadata(LISTENERS_METADATA, cur)
        if (data) {
            const composer = new Composer()
            data.map(d => {
                if (d.method == TMethod.on) {
                    composer.on(d.query as FilterQuery, cur[d.key])
                } else if (d.method == TMethod.command) {
                    composer.command(d.query as FilterQuery, cur[d.key])
                } else if (d.method == TMethod.use) {
                    composer.use(cur[d.key])
                }else if (d.method == TMethod.hears){
                    composer.hears(d.query, cur[d.key])
                }
            })
            sum.push(composer)
            return sum
        }
        return sum
    }, [])
    return composers
}