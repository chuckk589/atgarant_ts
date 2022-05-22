"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferController = void 0;
const common_1 = require("@nestjs/common");
const offer_service_1 = require("./offer.service");
const create_arb_dto_1 = require("./dto/create-arb.dto");
const update_offer_dto_1 = require("./dto/update-offer.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let OfferController = class OfferController {
    constructor(offerService) {
        this.offerService = offerService;
    }
    findAll(userId) {
        return this.offerService.findAll(userId);
    }
    close(id) {
        return this.offerService.offerAction(id);
    }
    arbitrary(id, CreateArbDto) {
        return this.offerService.createArb(id, CreateArbDto);
    }
    update(id, updateOfferDto) {
        return this.offerService.update(+id, updateOfferDto);
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OfferController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(':id/action'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OfferController.prototype, "close", null);
__decorate([
    (0, common_1.Post)(':id/arbitrary'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_arb_dto_1.CreateArbDto]),
    __metadata("design:returntype", void 0)
], OfferController.prototype, "arbitrary", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_offer_dto_1.UpdateOfferDto]),
    __metadata("design:returntype", void 0)
], OfferController.prototype, "update", null);
OfferController = __decorate([
    (0, common_1.Controller)({
        path: 'offer',
        version: '1',
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [offer_service_1.OfferService])
], OfferController);
exports.OfferController = OfferController;
//# sourceMappingURL=offer.controller.js.map