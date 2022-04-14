import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { load } from './utils/configLoader'

export async function bootstrap() {
  await load()
  const app = await NestFactory.create(AppModule);
  //await app.get(MikroORM).getSchemaGenerator().ensureDatabase();
  // await app.get(MikroORM).getSchemaGenerator().updateSchema();
  app.setGlobalPrefix('api/v1');
  app.useLogger(app.get(Logger));
  await app.listen(3000);
}
