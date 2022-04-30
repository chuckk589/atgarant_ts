"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalModule = void 0;
const common_1 = require("@nestjs/common");
const global_service_1 = require("./global.service");
const global_composer_1 = require("./global.composer");
const offer_module_1 = require("../offer-menu/offer.module");
const app_events_module_1 = require("../../app-events/app-events.module");
const payment_provider_module_1 = require("../../payment-provider/payment-provider.module");
const offer_edit_menu_module_1 = require("../offer-edit-menu/offer-edit-menu.module");
const arb_edit_menu_module_1 = require("../arb-edit-menu/arb-edit-menu.module");
let globalModule = class globalModule {
};
globalModule = __decorate([
    (0, common_1.Module)({
        imports: [
            offer_module_1.offerModule,
            offer_edit_menu_module_1.OfferEditMenuModule,
            arb_edit_menu_module_1.ArbEditMenuModule,
            app_events_module_1.AppEventsModule,
            payment_provider_module_1.PaymentProviderModule.forRootAsync()
        ],
        providers: [global_service_1.globalService, global_composer_1.globalComposer],
        exports: [global_composer_1.globalComposer],
    })
], globalModule);
exports.globalModule = globalModule;
//# sourceMappingURL=global.module.js.map