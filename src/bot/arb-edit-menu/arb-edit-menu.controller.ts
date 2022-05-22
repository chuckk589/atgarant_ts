import { Controller, forwardRef, Inject, Injectable } from '@nestjs/common';
import { BaseMenu, BotContext, BotStep } from 'src/types/interfaces';
import { Menu, MenuController } from '../common/decorators';
import { Menu as MenuGrammy } from '@grammyjs/menu';
import { AppEventsController } from 'src/app-events/app-events.controller';
import { Offers } from 'src/mikroorm/entities/Offers';
import { feedbackMenu } from '../common/keyboards';
import { Arbitraries, ArbitrariesStatus } from 'src/mikroorm/entities/Arbitraries';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@MenuController
export class ArbEditMenuController extends BaseMenu {
  constructor(
    private readonly AppEventsController: AppEventsController,
    @InjectPinoLogger('ArbEditMenuController') private readonly logger: PinoLogger,
  ) {
    super();
  }
  @Menu('arb-edit-menu')
  menu = new MenuGrammy<BotContext>('arb-edit-menu').dynamic((ctx, range) => {
    const status = ctx.session.editedArb.status;
    status === ArbitrariesStatus.CLOSED &&
      range.text(ctx.i18n.t('arbitraryDispute'), async (ctx) => {
        try {
          ctx.session.editedArb.status = await this.AppEventsController.arbDisputed<Arbitraries>(
            ctx.session.editedArb,
            ctx.from.id,
          );
          await ctx.reply(ctx.i18n.t('arbitraryDisputed'));
          ctx.menu.update();
        } catch (error) {
          this.logger.error(error);
          await ctx.reply('arbDisputeFailed');
        }
      });
    return range;
  });
}
