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
exports.OffersFeePayer = exports.OffersRole = exports.Offers = void 0;
const core_1 = require("@mikro-orm/core");
const Invoices_1 = require("./Invoices");
const Offerstatuses_1 = require("./Offerstatuses");
const Paymentmethods_1 = require("./Paymentmethods");
const Reviews_1 = require("./Reviews");
const Users_1 = require("./Users");
let Offers = class Offers {
    constructor() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.invoices = new core_1.Collection(this);
        this.reviews = new core_1.Collection(this);
    }
    async afterCreate(args) {
        const seller = args.entity.role === 'seller' ? 'initiator' : 'partner';
        const buyer = args.entity.role === 'buyer' ? 'initiator' : 'partner';
        args.em.getConnection().execute(`UPDATE profiles SET offersAsBuyer = offersAsBuyer + 1, totalOfferValueRub = totalOfferValueRub + ${this.offerValue} WHERE userId = ${this[buyer].id}`);
        args.em.getConnection().execute(`UPDATE profiles SET offersAsSeller = offersAsSeller + 1, totalOfferValueRub = totalOfferValueRub + ${this.offerValue} WHERE userId = ${this[seller].id}`);
    }
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Offers.prototype, "id", void 0);
__decorate([
    (0, core_1.Enum)({ items: () => OffersRole, nullable: true }),
    __metadata("design:type", String)
], Offers.prototype, "role", void 0);
__decorate([
    (0, core_1.Enum)({ fieldName: 'feePayer', items: () => OffersFeePayer, nullable: true }),
    __metadata("design:type", String)
], Offers.prototype, "feePayer", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'offerValue' }),
    __metadata("design:type", Number)
], Offers.prototype, "offerValue", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'feeBaked', nullable: true }),
    __metadata("design:type", Number)
], Offers.prototype, "feeBaked", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'estimatedShipping', columnType: 'date', nullable: true }),
    __metadata("design:type", String)
], Offers.prototype, "estimatedShipping", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'productDetails', length: 255, nullable: true }),
    __metadata("design:type", String)
], Offers.prototype, "productDetails", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'shippingDetails', length: 255, nullable: true }),
    __metadata("design:type", String)
], Offers.prototype, "shippingDetails", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'productAdditionalDetails', length: 255, nullable: true }),
    __metadata("design:type", String)
], Offers.prototype, "productAdditionalDetails", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'restDetails', length: 255, nullable: true }),
    __metadata("design:type", String)
], Offers.prototype, "restDetails", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'refundDetails', length: 255, nullable: true }),
    __metadata("design:type", String)
], Offers.prototype, "refundDetails", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'sellerWalletData', length: 255, nullable: true }),
    __metadata("design:type", String)
], Offers.prototype, "sellerWalletData", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'buyerWalletData', length: 255, nullable: true }),
    __metadata("design:type", String)
], Offers.prototype, "buyerWalletData", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'createdAt' }),
    __metadata("design:type", Date)
], Offers.prototype, "createdAt", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'updatedAt', onUpdate: () => new Date() }),
    __metadata("design:type", Date)
], Offers.prototype, "updatedAt", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Offerstatuses_1.Offerstatuses, fieldName: 'offerStatusId', onUpdateIntegrity: 'cascade', index: 'offerStatusId' }),
    __metadata("design:type", Offerstatuses_1.Offerstatuses)
], Offers.prototype, "offerStatus", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Users_1.Users, fieldName: 'partnerId', onUpdateIntegrity: 'cascade', onDelete: 'set null', nullable: true, index: 'partnerId' }),
    __metadata("design:type", Users_1.Users)
], Offers.prototype, "partner", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Users_1.Users, fieldName: 'initiatorId', onUpdateIntegrity: 'cascade', onDelete: 'set null', nullable: true, index: 'initiatorId' }),
    __metadata("design:type", Users_1.Users)
], Offers.prototype, "initiator", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Paymentmethods_1.Paymentmethods, fieldName: 'paymentMethodId', onUpdateIntegrity: 'cascade', index: 'paymentMethodId' }),
    __metadata("design:type", Paymentmethods_1.Paymentmethods)
], Offers.prototype, "paymentMethod", void 0);
__decorate([
    (0, core_1.OneToMany)(() => Invoices_1.Invoices, invoice => invoice.offer),
    __metadata("design:type", Object)
], Offers.prototype, "invoices", void 0);
__decorate([
    (0, core_1.OneToMany)(() => Reviews_1.Reviews, review => review.offer),
    __metadata("design:type", Object)
], Offers.prototype, "reviews", void 0);
__decorate([
    (0, core_1.AfterCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Offers.prototype, "afterCreate", null);
Offers = __decorate([
    (0, core_1.Entity)()
], Offers);
exports.Offers = Offers;
var OffersRole;
(function (OffersRole) {
    OffersRole["BUYER"] = "buyer";
    OffersRole["SELLER"] = "seller";
})(OffersRole = exports.OffersRole || (exports.OffersRole = {}));
var OffersFeePayer;
(function (OffersFeePayer) {
    OffersFeePayer["BUYER"] = "buyer";
    OffersFeePayer["SELLER"] = "seller";
})(OffersFeePayer = exports.OffersFeePayer || (exports.OffersFeePayer = {}));
//# sourceMappingURL=Offers.js.map