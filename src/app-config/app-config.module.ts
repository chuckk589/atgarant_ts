import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { AppConfigService } from './app-config.controller';

@Global()
@Module({
  providers: [AppConfigService],
  exports:[AppConfigService]
})
export class AppConfigModule {
  public static forRootAsync(options: ConfigModuleOptions = {}): DynamicModule {
    return {
      module: AppConfigModule,
      imports: [ConfigModule.forRoot(options)],
      exports: [ConfigModule],
    };
  }
}
