"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.session = void 0;
const grammy_1 = require("grammy");
const create_offer_dto_1 = require("../../mikroorm/dto/create-offer.dto");
const Arbitraries_1 = require("../../mikroorm/entities/Arbitraries");
const Offers_1 = require("../../mikroorm/entities/Offers");
const interfaces_1 = require("../../types/interfaces");
const initial = () => ({
    user: {
        acceptedRules: 0,
        mode: 'default',
    },
    step: interfaces_1.BotStep.default,
    pendingOffer: new create_offer_dto_1.botOfferDto(new Offers_1.Offers()),
    editedOffer: new Offers_1.Offers(),
    editedArb: new Arbitraries_1.Arbitraries(),
    menuId: undefined,
});
function getSessionKey(ctx) {
    return ctx.from?.id.toString();
}
exports.session = (0, grammy_1.session)({
    initial: initial,
    getSessionKey: getSessionKey,
});
//# sourceMappingURL=session.js.map