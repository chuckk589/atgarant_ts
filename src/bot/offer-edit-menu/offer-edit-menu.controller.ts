import { Controller } from '@nestjs/common';
import { BaseMenu, BotContext } from 'src/types/interfaces';
import { Menu, MenuController } from '../common/decorators';
import { Menu as MenuGrammy } from "@grammyjs/menu";
import { OfferEditMenuService } from './offer-edit-menu.service';

@MenuController
export class OfferEditMenuController extends BaseMenu {
  constructor(private readonly offerEditMenuService: OfferEditMenuService) {
    super()
  }
  @Menu('offer-edit-menu')
  menu = new MenuGrammy<BotContext>("offer-edit-menu")
}
