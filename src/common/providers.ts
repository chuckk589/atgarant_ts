import { MikroOrmModuleAsyncOptions } from '@mikro-orm/nestjs';
import { ConfigService } from '@nestjs/config';
import { globalComposer } from 'src/bot/global/global.composer';
import { globalModule } from 'src/bot/global/global.module';
import checkTime from 'src/bot/middleware/checkTime';
import i18n from 'src/bot/middleware/i18n';
import { session } from 'src/bot/middleware/session';
import { routerController } from 'src/bot/router/router.controller';
import { routerModule } from 'src/bot/router/router.module';
import { MikroORM } from '@mikro-orm/core';
import { GrammyBotOptionsAsync } from 'src/types/interfaces';
import { Configs } from 'src/mikroorm/entities/Configs';

// export const ORMOptionsProvider: MikroOrmModuleAsyncOptions = {
//   inject: [ConfigService],
//   useFactory: (configService: ConfigService) => {
//     return {
//       type: 'mysql',
//       allowGlobalContext: true,
//       entities: ['./dist/mikroorm/entities/'],
//       entitiesTs: ['./src/mikroorm/entities/'],
//       clientUrl: configService.get('database', { infer: true }),
//       seeder: {
//         path: './dist/modules/mikroorm/seeders', // path to the folder with seeders
//         pathTs: './src/modules/mikroorm/seeders', // path to the folder with TS seeders (if used, we should put path to compiled files in `path`)
//         defaultSeeder: 'DevSeeder', // default seeder class name
//         glob: '!(*.d).{js,ts}', // how to match seeder files (all .js and .ts files, but not .d.ts)
//         emit: 'ts', // seeder generation mode
//         fileName: (className: string) => className, // seeder file naming convention
//       },
//     };
//   },
// };
export const botOptionsProvider: GrammyBotOptionsAsync = {
  imports: [globalModule, routerModule],
  inject: [MikroORM, globalComposer, routerController],
  useFactory: async (orm: MikroORM, ...composers: any[]) => {
    const config = await orm.em.findOne(Configs, { name: 'BOT_TOKEN_PROD' });
    return {
      token: config.value,
      composers: composers.map((c) => c.getMiddleware()),
      middleware: [session, checkTime, i18n.middleware()],
    };
  },
};
