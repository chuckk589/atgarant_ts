"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevSeeder = void 0;
const seeder_1 = require("@mikro-orm/seeder");
const Users_1 = require("../entities/Users");
class DevSeeder extends seeder_1.Seeder {
    async run(em) {
        em.create(Users_1.Users, {
            chatId: '5177177451',
            role: 1,
        });
        em.create(Users_1.Users, {
            chatId: '1993835727',
            role: 2,
        });
    }
}
exports.DevSeeder = DevSeeder;
//# sourceMappingURL=DevSeeder.js.map