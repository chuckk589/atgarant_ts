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
exports.ArbitrariesStatus = exports.Arbitraries = void 0;
const core_1 = require("@mikro-orm/core");
const Offers_1 = require("./Offers");
const Users_1 = require("./Users");
let Arbitraries = class Arbitraries {
    constructor() {
        this.buyerPayout = 0;
        this.sellerPayout = 0;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Arbitraries.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Arbitraries.prototype, "reason", void 0);
__decorate([
    (0, core_1.Property)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Arbitraries.prototype, "chatId", void 0);
__decorate([
    (0, core_1.Property)({ length: 512, nullable: true }),
    __metadata("design:type", String)
], Arbitraries.prototype, "comment", void 0);
__decorate([
    (0, core_1.Enum)({ items: () => ArbitrariesStatus, nullable: true }),
    __metadata("design:type", String)
], Arbitraries.prototype, "status", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'buyerPayout', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Arbitraries.prototype, "buyerPayout", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'sellerPayout', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Arbitraries.prototype, "sellerPayout", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'createdAt' }),
    __metadata("design:type", Date)
], Arbitraries.prototype, "createdAt", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'updatedAt', onUpdate: () => new Date() }),
    __metadata("design:type", Date)
], Arbitraries.prototype, "updatedAt", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Offers_1.Offers, fieldName: 'offerId', onUpdateIntegrity: 'cascade', onDelete: 'cascade', index: 'offerId' }),
    __metadata("design:type", Offers_1.Offers)
], Arbitraries.prototype, "offer", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Users_1.Users, fieldName: 'initiatorId', onUpdateIntegrity: 'cascade', onDelete: 'set null', nullable: true, index: 'initiatorId' }),
    __metadata("design:type", Users_1.Users)
], Arbitraries.prototype, "initiator", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Users_1.Users, fieldName: 'arbiterId', onUpdateIntegrity: 'cascade', onDelete: 'set null', nullable: true, index: 'arbiterId' }),
    __metadata("design:type", Users_1.Users)
], Arbitraries.prototype, "arbiter", void 0);
Arbitraries = __decorate([
    (0, core_1.Entity)()
], Arbitraries);
exports.Arbitraries = Arbitraries;
var ArbitrariesStatus;
(function (ArbitrariesStatus) {
    ArbitrariesStatus["ACTIVE"] = "active";
    ArbitrariesStatus["DISPUTED"] = "disputed";
    ArbitrariesStatus["CLOSED"] = "closed";
    ArbitrariesStatus["CLOSEDF"] = "closedF";
})(ArbitrariesStatus = exports.ArbitrariesStatus || (exports.ArbitrariesStatus = {}));
//# sourceMappingURL=Arbitraries.js.map