"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotStep = exports.TMethod = exports.CommonConfig = exports.PM = exports.BasePaymentController = exports.BaseRouter = exports.BaseMenu = exports.BaseComposer = exports.MenuListenerMetadata = exports.ListenerMetadata = exports.BotContext = exports.OfferCallbackData = void 0;
const grammy_1 = require("grammy");
const helpers_1 = require("../bot/common/helpers");
class OfferCallbackData {
    constructor(callback_data) {
        const data = callback_data.split(':');
        if (data.length !== 4)
            throw new Error('incorrect OfferCallbackData payload!');
        this.type = data[0];
        this.action = data[1];
        this.mode = data[2];
        this.payload = data[3];
    }
}
exports.OfferCallbackData = OfferCallbackData;
class BotContext extends grammy_1.Context {
    constructor(update, api, me) {
        super(update, api, me);
        this.cleanAndReply = async (text, other, signal) => {
            await this.clean();
            return this.reply(text, other, signal);
        };
        this.replyAndSave = async (text, other, signal) => {
            await this.reply(text, other, signal).then(r => this.session.menuId = r.message_id);
        };
        this.cleanReplySave = async (text, other, signal) => {
            await this.clean();
            await this.replyAndSave(text, other, signal);
        };
        this.clean = async () => {
            if (this.session.menuId) {
                await this.api.deleteMessage(this.from.id, this.session.menuId).catch(() => { });
                this.session.menuId = undefined;
            }
        };
        this.save = async (messageId) => {
            this.session.menuId = messageId;
        };
    }
    get session() {
        throw new Error("Method not implemented.");
    }
    set session(session) {
        throw new Error("Method not implemented.");
    }
}
exports.BotContext = BotContext;
class ListenerMetadata {
    constructor(method, query, key) {
        this.method = method;
        this.query = method == TMethod.hears ? (0, helpers_1.match)(query) : query;
        this.key = String(key);
    }
}
exports.ListenerMetadata = ListenerMetadata;
class MenuListenerMetadata {
    constructor(name, key) {
        this.name = name;
        this.key = String(key);
    }
}
exports.MenuListenerMetadata = MenuListenerMetadata;
class BaseComposer {
    constructor() { }
    getMiddleware() {
        return this._composer;
    }
}
exports.BaseComposer = BaseComposer;
class BaseMenu {
    getMiddleware() {
        return this._menu;
    }
}
exports.BaseMenu = BaseMenu;
class BaseRouter {
    getMiddleware() {
        return this._router;
    }
}
exports.BaseRouter = BaseRouter;
class BasePaymentController {
}
exports.BasePaymentController = BasePaymentController;
class PM {
    constructor(method, paymentMethod) {
        const values = paymentMethod.split(':');
        this.feeRaw = Number.parseInt(values[0]);
        this.feePercent = Number.parseInt(values[1]);
        this.minSum = Number.parseInt(values[2]);
        this.maxSum = Number.parseInt(values[3]);
        this.id = Number.parseInt(values[4]);
        this.method = method;
    }
}
exports.PM = PM;
class CommonConfig {
    constructor(id, offerStatus) {
        const values = offerStatus.split(':');
        this.value = values[0];
        this.name = values[1];
        this.id = Number(id);
    }
}
exports.CommonConfig = CommonConfig;
var TMethod;
(function (TMethod) {
    TMethod["command"] = "command";
    TMethod["on"] = "on";
    TMethod["use"] = "use";
    TMethod["hears"] = "hears";
    TMethod["text"] = "text";
    TMethod["menu"] = "menu";
    TMethod["submenu"] = "submenu";
    TMethod["back"] = "back";
})(TMethod = exports.TMethod || (exports.TMethod = {}));
var BotStep;
(function (BotStep) {
    BotStep["default"] = "default";
    BotStep["rules"] = "rules";
    BotStep["roles"] = "roles";
    BotStep["fee"] = "fee";
    BotStep["contact"] = "contact";
    BotStep["payment"] = "payment";
    BotStep["value"] = "value";
    BotStep["shipping"] = "shipping";
    BotStep["productDetails"] = "productDetails";
    BotStep["shippingDetails"] = "shippingDetails";
    BotStep["productRest"] = "productRest";
    BotStep["rest"] = "rest";
    BotStep["refund"] = "refund";
    BotStep["checkout"] = "checkout";
    BotStep["manage"] = "manage";
    BotStep["offer"] = "offer";
    BotStep["arbitrary"] = "arbitrary";
    BotStep["setWallet"] = "setWallet";
    BotStep["setArbitrary"] = "setArbitrary";
    BotStep["setFeedbackP"] = "setFeedbackP";
    BotStep["setFeedbackN"] = "setFeedbackN";
})(BotStep = exports.BotStep || (exports.BotStep = {}));
//# sourceMappingURL=interfaces.js.map