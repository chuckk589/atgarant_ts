import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // await app.get(MikroORM).getSchemaGenerator().ensureDatabase();
  // await app.get(MikroORM).getSchemaGenerator().updateSchema();
  app.setGlobalPrefix('api/v1');
  setTimeout(() => {
    console.log(process.env)
  }, 3000);
  await app.listen(3000);
}
