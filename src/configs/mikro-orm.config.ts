import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import 'dotenv/config';

const MikroORMOptions: MikroOrmModuleOptions = {
  type: 'mysql',
  allowGlobalContext: true,
  ...(process.env.NODE_ENV === 'development' ? { debug: true, logger: console.log.bind(console) } : {}),
  entities: ['./dist/src/mikroorm/entities/'],
  entitiesTs: ['./src/mikroorm/entities/'],
  clientUrl: process.env.NODE_ENV === 'development' ? process.env.DB_URL_DEV : process.env.DB_URL,
  seeder: {
    path: './dist/mikroorm/seeders', // path to the folder with seeders
    pathTs: './src/mikroorm/seeders', // path to the folder with TS seeders (if used, we should put path to compiled files in `path`)
    defaultSeeder: 'DatabaseSeeder', // default seeder class name
    glob: '!(*.d).{js,ts}', // how to match seeder files (all .js and .ts files, but not .d.ts)
    emit: 'ts', // seeder generation mode
    fileName: (className: string) => className, // seeder file naming convention
  },
};

export default MikroORMOptions;
