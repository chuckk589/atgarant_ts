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
exports.InvoicesType = exports.Invoices = void 0;
const core_1 = require("@mikro-orm/core");
const Invoicestatuses_1 = require("./Invoicestatuses");
const Offers_1 = require("./Offers");
let Invoices = class Invoices {
    constructor() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Invoices.prototype, "id", void 0);
__decorate([
    (0, core_1.Enum)({ items: () => InvoicesType, nullable: true }),
    __metadata("design:type", String)
], Invoices.prototype, "type", void 0);
__decorate([
    (0, core_1.Property)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Invoices.prototype, "currency", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'float', nullable: true }),
    __metadata("design:type", Number)
], Invoices.prototype, "value", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'float', nullable: true }),
    __metadata("design:type", Number)
], Invoices.prototype, "fee", void 0);
__decorate([
    (0, core_1.Property)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Invoices.prototype, "txnId", void 0);
__decorate([
    (0, core_1.Property)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Invoices.prototype, "url", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'createdAt' }),
    __metadata("design:type", Date)
], Invoices.prototype, "createdAt", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'updatedAt', onUpdate: () => new Date() }),
    __metadata("design:type", Date)
], Invoices.prototype, "updatedAt", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => Offers_1.Offers,
        fieldName: 'offerId',
        onUpdateIntegrity: 'cascade',
        onDelete: 'cascade',
        index: 'offerId',
    }),
    __metadata("design:type", Offers_1.Offers)
], Invoices.prototype, "offer", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => Invoicestatuses_1.Invoicestatuses,
        fieldName: 'invoiceStatusId',
        onUpdateIntegrity: 'cascade',
        index: 'invoiceStatusId',
    }),
    __metadata("design:type", Invoicestatuses_1.Invoicestatuses)
], Invoices.prototype, "invoiceStatus", void 0);
Invoices = __decorate([
    (0, core_1.Entity)()
], Invoices);
exports.Invoices = Invoices;
var InvoicesType;
(function (InvoicesType) {
    InvoicesType["IN"] = "in";
    InvoicesType["OUT"] = "out";
    InvoicesType["REFUND"] = "refund";
})(InvoicesType = exports.InvoicesType || (exports.InvoicesType = {}));
//# sourceMappingURL=Invoices.js.map