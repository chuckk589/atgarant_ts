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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paymentmethods = void 0;
const core_1 = require("@mikro-orm/core");
let Paymentmethods = class Paymentmethods {
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Paymentmethods.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Paymentmethods.prototype, "value", void 0);
__decorate([
    (0, core_1.Property)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Paymentmethods.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'feePercent', nullable: true }),
    __metadata("design:type", Number)
], Paymentmethods.prototype, "feePercent", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'feeRaw', nullable: true }),
    __metadata("design:type", Number)
], Paymentmethods.prototype, "feeRaw", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'minSum', nullable: true }),
    __metadata("design:type", Number)
], Paymentmethods.prototype, "minSum", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'maxSum', nullable: true }),
    __metadata("design:type", Number)
], Paymentmethods.prototype, "maxSum", void 0);
Paymentmethods = __decorate([
    (0, core_1.Entity)()
], Paymentmethods);
exports.Paymentmethods = Paymentmethods;
//# sourceMappingURL=Paymentmethods.js.map