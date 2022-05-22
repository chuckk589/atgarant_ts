"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const preventOldUpdates = Date.now() / 1000;
async function default_1(ctx, next) {
    try {
        const date = ctx.msg?.date;
        if (date) {
            if (preventOldUpdates < ctx.msg.date) {
                await next();
            }
            else {
            }
        }
        else {
            await next();
        }
    }
    catch (error) {
        console.log(error);
    }
}
exports.default = default_1;
//# sourceMappingURL=checkTime.js.map