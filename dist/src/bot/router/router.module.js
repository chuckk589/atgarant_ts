"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerModule = void 0;
const common_1 = require("@nestjs/common");
const app_events_module_1 = require("../../app-events/app-events.module");
const arb_edit_menu_module_1 = require("../arb-edit-menu/arb-edit-menu.module");
const offer_edit_menu_module_1 = require("../offer-edit-menu/offer-edit-menu.module");
const offer_module_1 = require("../offer-menu/offer.module");
const router_controller_1 = require("./router.controller");
const router_service_1 = require("./router.service");
let routerModule = class routerModule {
};
routerModule = __decorate([
    (0, common_1.Module)({
        imports: [offer_module_1.offerModule, offer_edit_menu_module_1.OfferEditMenuModule, arb_edit_menu_module_1.ArbEditMenuModule, app_events_module_1.AppEventsModule],
        providers: [router_service_1.routerService, router_controller_1.routerController],
        exports: [router_controller_1.routerController]
    })
], routerModule);
exports.routerModule = routerModule;
//# sourceMappingURL=router.module.js.map