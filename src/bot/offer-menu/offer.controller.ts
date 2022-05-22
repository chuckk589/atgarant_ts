import { Menu as MenuGrammy } from '@grammyjs/menu';
import { Injectable, SetMetadata } from '@nestjs/common';
import { AppConfigService } from 'src/app-config/app-config.service';
import { Offers, OffersFeePayer, OffersRole } from 'src/mikroorm/entities/Offers';
import { BaseMenu, BotContext, BotStep, PM } from 'src/types/interfaces';
import { Menu, MenuController } from '../common/decorators';
import { label } from '../common/helpers';
import { accountKeyboard, arbitraryKeyboard, mainKeyboard, offerKeyboard } from '../common/keyboards';
import { offerService } from './offer.service';
import { AppEventsController } from '../../app-events/app-events.controller';

@MenuController
export class offerController extends BaseMenu {
  constructor(private readonly offerService: offerService, private readonly AppConfigService: AppConfigService) {
    super();
  }
  @Menu('offer-menu')
  menu = new MenuGrammy<BotContext>('offer-menu')
    .dynamic((ctx, range) => {
      switch (ctx.session.step) {
        case BotStep.rules: {
          range.text(label({ text: 'acceptRules' }), async (ctx) => {
            await this.offerService.acceptRules(ctx);
            ctx.session.step = BotStep.roles;
            await ctx.editMessageText(ctx.i18n.t('askRole'));
          });
          range.text(label({ text: 'rejectRules' }), async (ctx) => {
            await ctx.deleteMessage();
            await ctx.reply(ctx.i18n.t('start'), { reply_markup: mainKeyboard(ctx) });
          });
          range.text(label({ text: 'getRules' }), (ctx) => ctx.reply(ctx.i18n.t('rulesContent')));
          break;
        }
        case BotStep.roles: {
          range.text(label({ text: 'buyer' }), async (ctx) => {
            ctx.session.step = BotStep.contact;
            ctx.session.pendingOffer.role = OffersRole.BUYER;
            await ctx.editMessageText(ctx.i18n.t('askContact'));
          });
          range.text(label({ text: 'seller' }), async (ctx) => {
            ctx.session.step = BotStep.contact;
            ctx.session.pendingOffer.role = OffersRole.SELLER;
            await ctx.editMessageText(ctx.i18n.t('askContact'));
          });
          break;
        }
        case BotStep.contact: {
          range.text(label({ text: 'back' }), async (ctx) => {
            ctx.session.step = BotStep.roles;
            await ctx.editMessageText(ctx.i18n.t('askRole'));
          });
          break;
        }
        case BotStep.fee: {
          range.text(label({ text: 'buyer' }), async (ctx) => {
            ctx.session.step = BotStep.payment;
            ctx.session.pendingOffer.feePayer = OffersFeePayer.BUYER;
            await ctx.editMessageText(ctx.i18n.t('askPaymentMethod'));
          });
          range.text(label({ text: 'seller' }), async (ctx) => {
            ctx.session.step = BotStep.payment;
            ctx.session.pendingOffer.feePayer = OffersFeePayer.SELLER;
            await ctx.editMessageText(ctx.i18n.t('askPaymentMethod'));
          });
          break;
        }
        case BotStep.payment: {
          const pms = this.AppConfigService.payments;
          pms.map((pm) =>
            range.text({ text: ctx.i18n.t(pm.method) || pm.method, payload: String(pm.id) }, async (ctx) => {
              ctx.session.step = BotStep.value;
              ctx.session.pendingOffer.paymentMethodId = Number(ctx.match);
              await ctx.editMessageText(ctx.i18n.t('askOfferValue'));
            }),
          );
          break;
        }
        case BotStep.value: {
          range.text(label({ text: 'back' }), async (ctx) => {
            ctx.session.step = BotStep.payment;
            await ctx.editMessageText(ctx.i18n.t('askPaymentMethod'));
          });
          break;
        }
        case BotStep.shipping: {
          range.text(label({ text: 'back' }), async (ctx) => {
            ctx.session.step = BotStep.value;
            await ctx.editMessageText(ctx.i18n.t('askOfferValue'));
          });
          break;
        }
        case BotStep.productDetails: {
          range.text(label({ text: 'back' }), async (ctx) => {
            ctx.session.step = BotStep.shipping;
            await ctx.editMessageText(ctx.i18n.t('askEstimatedShipping'));
          });
          break;
        }
        case BotStep.shippingDetails: {
          range.text(label({ text: 'back' }), async (ctx) => {
            ctx.session.step = BotStep.productDetails;
            await ctx.editMessageText(ctx.i18n.t('askProductDetails'));
          });
          break;
        }
        case BotStep.productRest: {
          range.text(label({ text: 'back' }), async (ctx) => {
            ctx.session.step = BotStep.shippingDetails;
            await ctx.editMessageText(ctx.i18n.t('askShippingDetails'));
          });
          break;
        }
        case BotStep.rest: {
          range.text(label({ text: 'back' }), async (ctx) => {
            ctx.session.step = BotStep.productRest;
            await ctx.editMessageText(ctx.i18n.t('askProductAdditionalDetails'));
          });
          break;
        }
        case BotStep.refund: {
          range.text(label({ text: 'back' }), async (ctx) => {
            ctx.session.step = BotStep.rest;
            await ctx.editMessageText(ctx.i18n.t('askRestDetails'));
          });
          break;
        }
      }
      return range;
    })
    .row();
}
