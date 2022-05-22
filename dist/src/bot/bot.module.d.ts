import { DynamicModule } from '@nestjs/common';
import { GrammyBotOptionsAsync } from 'src/types/interfaces';
export declare class BotModule {
    static forRootAsync(options: GrammyBotOptionsAsync): DynamicModule;
}
