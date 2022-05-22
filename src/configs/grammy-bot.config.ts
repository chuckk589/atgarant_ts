// import { BaseComposer, GrammyBotOptionsAsync } from 'src/types/interfaces';
// import { ConfigService } from '@nestjs/config';
// import { MikroORM } from '@mikro-orm/core';
// import { session } from 'grammy';
// import { globalComposer } from 'src/modules/bot/global/global.composer';
// import { globalModule } from 'src/modules/bot/global/global.module';
// import checkTime from 'src/modules/bot/middleware/checkTime';
// import i18n from 'src/modules/bot/middleware/i18n';
// import { Config } from 'src/modules/mikroorm/entities/Config';
// import { AppConfigService } from '../modules/app-config/app-config.service';

// export const GrammyBotOptions: GrammyBotOptionsAsync = {
//   imports: [globalModule, routerModule],
//   inject: [AppConfigService, globalComposer, routerController],
//   useFactory: async (AppConfigService: AppConfigService, ...composers: BaseComposer[]) => {
//     return {
//       token: AppConfigService.get('BOT_TOKEN_PROD', { infer: true }),
//       middleware: [session, checkTime, i18n.middleware(), ...composers.map((c) => c.getMiddleware())],
//     };
//   },
// };
