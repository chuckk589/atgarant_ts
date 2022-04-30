"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferEditMenuModule = void 0;
const common_1 = require("@nestjs/common");
const offer_edit_menu_service_1 = require("./offer-edit-menu.service");
const offer_edit_menu_controller_1 = require("./offer-edit-menu.controller");
const app_events_module_1 = require("../../app-events/app-events.module");
const offer_module_1 = require("../offer-menu/offer.module");
let OfferEditMenuModule = class OfferEditMenuModule {
};
OfferEditMenuModule = __decorate([
    (0, common_1.Module)({
        imports: [offer_module_1.offerModule, app_events_module_1.AppEventsModule],
        providers: [offer_edit_menu_service_1.OfferEditMenuService, offer_edit_menu_controller_1.OfferEditMenuController],
        exports: [offer_edit_menu_controller_1.OfferEditMenuController],
    })
], OfferEditMenuModule);
exports.OfferEditMenuModule = OfferEditMenuModule;
//# sourceMappingURL=offer-edit-menu.module.js.map