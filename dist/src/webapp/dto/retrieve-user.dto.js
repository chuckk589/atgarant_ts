"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetrieveWebAppUser = void 0;
class RetrieveWebAppUser {
    constructor(user) {
        console.log(user);
        this.chatId = user.chatId;
        this.username = user.username;
        this.id = user.id;
        this.violations = user.violations?.length;
        this.offers = user.profile?.offersAsBuyer + user.profile?.offersAsSeller;
    }
}
exports.RetrieveWebAppUser = RetrieveWebAppUser;
//# sourceMappingURL=retrieve-user.dto.js.map