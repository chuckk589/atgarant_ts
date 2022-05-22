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
exports.ReviewsRate = exports.Reviews = void 0;
const core_1 = require("@mikro-orm/core");
const Offers_1 = require("./Offers");
const Users_1 = require("./Users");
let Reviews = class Reviews {
    constructor() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Reviews.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ length: 512, nullable: true }),
    __metadata("design:type", String)
], Reviews.prototype, "text", void 0);
__decorate([
    (0, core_1.Enum)({ items: () => ReviewsRate, nullable: true }),
    __metadata("design:type", String)
], Reviews.prototype, "rate", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'createdAt' }),
    __metadata("design:type", Date)
], Reviews.prototype, "createdAt", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'updatedAt', onUpdate: () => new Date() }),
    __metadata("design:type", Date)
], Reviews.prototype, "updatedAt", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => Offers_1.Offers,
        fieldName: 'offerId',
        onUpdateIntegrity: 'cascade',
        onDelete: 'set null',
        nullable: true,
        index: 'offerId',
    }),
    __metadata("design:type", Offers_1.Offers)
], Reviews.prototype, "offer", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => Users_1.Users,
        fieldName: 'recipientId',
        onUpdateIntegrity: 'cascade',
        onDelete: 'set null',
        nullable: true,
        index: 'recipientId',
    }),
    __metadata("design:type", Users_1.Users)
], Reviews.prototype, "recipient", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => Users_1.Users,
        fieldName: 'authorId',
        onUpdateIntegrity: 'cascade',
        onDelete: 'set null',
        nullable: true,
        index: 'authorId',
    }),
    __metadata("design:type", Users_1.Users)
], Reviews.prototype, "author", void 0);
Reviews = __decorate([
    (0, core_1.Entity)()
], Reviews);
exports.Reviews = Reviews;
var ReviewsRate;
(function (ReviewsRate) {
    ReviewsRate["POSITIVE"] = "positive";
    ReviewsRate["NEGATIVE"] = "negative";
})(ReviewsRate = exports.ReviewsRate || (exports.ReviewsRate = {}));
//# sourceMappingURL=Reviews.js.map