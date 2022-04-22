import { MikroOrmModule, MikroOrmModuleAsyncOptions } from "@mikro-orm/nestjs";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Composer, FilterQuery } from "grammy";
import { globalComposer } from "src/bot/global/global.composer";
import { globalModule } from "src/bot/global/global.module";
import checkTime from "src/bot/middleware/checkTime";
import i18n from "src/bot/middleware/i18n";
import { session } from "src/bot/middleware/session";
import { routerController } from "src/bot/router/router.controller";
import { routerModule } from "src/bot/router/router.module";
import { MikroORM } from "@mikro-orm/core";
import { GrammyBotOptionsAsync, ListenerMetadata, PaymentsOptions, PaymentsOptionsAsync, TMethod } from "src/types/interfaces";
import { Configs } from "src/mikroorm/entities/Configs";

export const ORMOptionsProvider: MikroOrmModuleAsyncOptions = {
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
    imports: [globalModule, routerModule],
    inject: [MikroORM, globalComposer, routerController],
    useFactory: async (orm: MikroORM, ...composers: any[]) => {
        const config = await orm.em.findOne(Configs, { name: 'BOT_TOKEN_PROD' })
        return {
            token: config.value,
            composers: composers.map(c => c.getComposer()),
            middleware: [session, checkTime, i18n.middleware()]
        };
    }
}

export const paymentsOptionsProvider: PaymentsOptionsAsync = {
    inject: [MikroORM],
    useFactory: async (orm: MikroORM) => {
        const config = await orm.em.findOne(Configs, { name: 'PAYMENT_SERVICE' })
        return { mode: config.value } as PaymentsOptions
    }
}