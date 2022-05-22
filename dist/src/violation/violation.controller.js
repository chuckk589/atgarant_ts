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
exports.ViolationController = void 0;
const common_1 = require("@nestjs/common");
const violation_service_1 = require("./violation.service");
const create_violation_dto_1 = require("./dto/create-violation.dto");
const update_violation_dto_1 = require("./dto/update-violation.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ViolationController = class ViolationController {
    constructor(violationService) {
        this.violationService = violationService;
    }
    create(createViolationDto) {
        return this.violationService.create(createViolationDto);
    }
    findAll() {
        return this.violationService.findAll();
    }
    findOne(id) {
        return this.violationService.findOne(+id);
    }
    update(id, updateViolationDto) {
        return this.violationService.update(+id, updateViolationDto);
    }
    remove(id) {
        return this.violationService.remove(+id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_violation_dto_1.CreateViolationDto]),
    __metadata("design:returntype", void 0)
], ViolationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ViolationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ViolationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_violation_dto_1.UpdateViolationDto]),
    __metadata("design:returntype", void 0)
], ViolationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ViolationController.prototype, "remove", null);
ViolationController = __decorate([
    (0, common_1.Controller)({
        path: 'violation',
        version: '1',
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [violation_service_1.ViolationService])
], ViolationController);
exports.ViolationController = ViolationController;
//# sourceMappingURL=violation.controller.js.map