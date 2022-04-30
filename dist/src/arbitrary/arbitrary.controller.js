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
exports.ArbitraryController = void 0;
const common_1 = require("@nestjs/common");
const arbitrary_service_1 = require("./arbitrary.service");
const close_arbitrary_dto_1 = require("./dto/close-arbitrary.dto");
const dispute_arbitrary_dto_1 = require("./dto/dispute-arbitrary.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ArbitraryController = class ArbitraryController {
    constructor(arbitraryService) {
        this.arbitraryService = arbitraryService;
    }
    findAll(userId) {
        return this.arbitraryService.findAll(userId);
    }
    getHistory(id) {
        return this.arbitraryService.getHistory(id);
    }
    close(id, CloseArbDto) {
        return this.arbitraryService.closeArb(id, CloseArbDto);
    }
    dispute(id, DisputeArbDto) {
        return this.arbitraryService.disputeArb(id, DisputeArbDto);
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArbitraryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id/history'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ArbitraryController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Post)(':id/close'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, close_arbitrary_dto_1.CloseArbDto]),
    __metadata("design:returntype", Promise)
], ArbitraryController.prototype, "close", null);
__decorate([
    (0, common_1.Post)(':id/dispute'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dispute_arbitrary_dto_1.DisputeArbDto]),
    __metadata("design:returntype", Promise)
], ArbitraryController.prototype, "dispute", null);
ArbitraryController = __decorate([
    (0, common_1.Controller)({
        path: 'arbitrary',
        version: '1'
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [arbitrary_service_1.ArbitraryService])
], ArbitraryController);
exports.ArbitraryController = ArbitraryController;
//# sourceMappingURL=arbitrary.controller.js.map