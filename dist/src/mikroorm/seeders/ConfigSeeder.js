"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigSeeder = void 0;
const seeder_1 = require("@mikro-orm/seeder");
const Configs_1 = require("../entities/Configs");
const Invoicestatuses_1 = require("../entities/Invoicestatuses");
const Offerstatuses_1 = require("../entities/Offerstatuses");
const Paymentmethods_1 = require("../entities/Paymentmethods");
class ConfigSeeder extends seeder_1.Seeder {
    async run(em) {
        em.create(Configs_1.Configs, {
            name: 'BOT_TOKEN_PROD',
            value: '1863509702:AAHj4bH--KGvJwl8oguY0Rj4Uo7bHsAiUNg',
        });
        em.create(Configs_1.Configs, {
            name: 'QIWI_P2P_TOKEN',
            value: '48e7qUxn9T7RyYE1MVZswX1FRSbE6iyCj2gCRwwF3Dnh5XrasNTx3BGPiMsyXQFNKQhvukniQG8RTVhYm3iP6DSnuZLYioqzHc3Vu9WctymYC5U5Qk1X8C73ZjGANfRG5ara6pKoWcRbweJVPNcLjczji4NgLtvsx6LRWVeuncDiY5b9iU4MWw1M1HF36',
            category: 'QIWI',
            requiresReboot: 1,
        });
        em.create(Configs_1.Configs, {
            name: 'BOT_TOKEN_PROD',
            value: '1863509702:AAHj4bH--KGvJwl8oguY0Rj4Uo7bHsAiUNg',
            category: 'Telegram',
            requiresReboot: 1,
        });
        em.create(Configs_1.Configs, {
            name: 'QIWI_P2P_TOKEN_SECRET',
            value: 'eyJ2ZXJzaW9uIjoiUDJQIiwiZGF0YSI6eyJwYXlpbl9tZXJjaGFudF9zaXRlX3VpZCI6IjhlamJ4cC0wMCIsInVzZXJfaWQiOiI3OTE2MTcyNDcyNiIsInNlY3JldCI6IjA0YTk4MTBhZWNjYjFjMDgzZGQzNjdlMWFkNTIxNWI1ZTBhNTEzYWNjNmQwZTVhNDFjNGI5NjA2NzdmNTA2YmUifX0=',
            category: 'QIWI',
            requiresReboot: 1,
        });
        em.create(Configs_1.Configs, {
            name: 'QIWI_API_TOKEN',
            value: '510452b6741b4909853c30802b890642',
            category: 'QIWI',
            requiresReboot: 1,
        });
        em.create(Configs_1.Configs, {
            name: 'COIN_API_KEY',
            value: 'f6d091fdfa11b7d6ca9558a5185bf35e6c3ec9c93e833af6b512ee49e60a5d8d',
            category: 'Payments_Coinpayments',
            requiresReboot: 1,
        });
        em.create(Configs_1.Configs, {
            name: 'COIN_API_KEY_SECRET',
            value: 'c1db08eA75bCC5e6Eb0210e1D48e88723eb02C7F6E31a293d78487AA1b4DA938',
            category: 'Payments_Coinpayments',
            requiresReboot: 1,
        });
        em.create(Configs_1.Configs, {
            name: 'APP_API_ID',
            value: '7395347',
            category: 'Telegram',
            requiresReboot: 1,
        });
        em.create(Configs_1.Configs, {
            name: 'APP_API_HASH',
            value: 'f8bdb57c37d9add226c5f93e5d71f2ec',
            category: 'Telegram',
            requiresReboot: 1,
        });
        em.create(Configs_1.Configs, {
            name: 'APP_SESSION_STRING',
            value: '1AgAOMTQ5LjE1NC4xNjcuNDEBuwp9jCoAehhaVLMHjRSoPIXhq1xC/4mQ/pNDO492iTOdyAp8wRbIpKjGxBy5BLnFzflmIeVysCfYCvfTgpYWQsPVSwofnxdEFzr+Pq39QHSySrGIFK9IzAKXwqWwG/n09H3PeZob54cKuMYYtrw2aRXXMZHtrL0yaFe4cy64dCAm9wuoI2A2+EyJ1IrK/mdOtPa0LJCZb0PSZ9ED3XMEJCZ26njxSXCM+nx4B8uQAgtNTyjcLxLw+2X4DkGC4cUnpW1kV1SD23lhE8zw7zhVoMBqCUvqdBw5qve0btxPSqnnBFY6RoSdaVcGy5kLpNvuDdgCWpuO+gAAYVOk9EgtmpM=',
            category: 'Telegram',
            requiresReboot: 0,
        });
        em.create(Configs_1.Configs, {
            name: 'ROLE_USER_0',
            value: 'user',
            category: 'config',
            requiresReboot: 0,
        });
        em.create(Configs_1.Configs, {
            name: 'ROLE_USER_1',
            value: 'admin',
            category: 'config',
            requiresReboot: 0,
        });
        em.create(Configs_1.Configs, {
            name: 'PAYMENT_SERVICE',
            value: 'coinpayments',
            category: 'Payments',
            requiresReboot: 0,
        });
        em.create(Configs_1.Configs, {
            name: 'BTC_WALLET',
            value: '11',
            category: 'Payments_Bitcoin-core',
            requiresReboot: 1,
        });
        em.create(Configs_1.Configs, {
            name: 'BTC_PASSWORD',
            value: 'bitcoinpassword',
            category: 'Payments_Bitcoin-core',
            requiresReboot: 1,
        });
        em.create(Configs_1.Configs, {
            name: 'BTC_USER',
            value: 'bitcoinuser',
            category: 'Payments_Bitcoin-core',
            requiresReboot: 1,
        });
        em.create(Configs_1.Configs, {
            name: 'BTC_NETWORK',
            value: 'testnet',
            category: 'Payments_Bitcoin-core',
            requiresReboot: 1,
        });
        em.create(Configs_1.Configs, {
            name: 'BTC_PORT',
            value: '18332',
            category: 'Payments_Bitcoin-core',
            requiresReboot: 1,
        });
        em.create(Configs_1.Configs, {
            name: 'BTC_CONFIRMATIONS',
            value: '0',
            category: 'Payments_Bitcoin-core',
            requiresReboot: 1,
        });
        em.create(Configs_1.Configs, {
            name: 'BTC_UPDATE_TIMEOUT',
            category: 'Payments_Bitcoin-core',
            requiresReboot: 1,
        });
        em.create(Configs_1.Configs, {
            name: 'BTC_INCOMING_TIMEOUT',
            category: 'Payments_Bitcoin-core',
            requiresReboot: 1,
        });
        em.create(Configs_1.Configs, {
            name: 'BTC_OUTGOING_TIMEOUT',
            category: 'Payments_Bitcoin-core',
            requiresReboot: 1,
        });
        em.create(Invoicestatuses_1.Invoicestatuses, {
            value: 'waiting',
            name: 'Ожидание платежа',
        });
        em.create(Invoicestatuses_1.Invoicestatuses, {
            value: 'success',
            name: 'Завершен',
        });
        em.create(Invoicestatuses_1.Invoicestatuses, {
            value: 'refunded',
            name: 'Выплачен',
        });
        em.create(Offerstatuses_1.Offerstatuses, {
            value: 'pending',
            name: 'На согласовании',
        });
        em.create(Offerstatuses_1.Offerstatuses, {
            value: 'denied',
            name: 'Отклонена',
        });
        em.create(Offerstatuses_1.Offerstatuses, {
            value: 'accepted',
            name: 'Ожидание платежа',
        });
        em.create(Offerstatuses_1.Offerstatuses, {
            value: 'payed',
            name: 'Ожидает отправки',
        });
        em.create(Offerstatuses_1.Offerstatuses, {
            value: 'shipped',
            name: 'Отправлен',
        });
        em.create(Offerstatuses_1.Offerstatuses, {
            value: 'arrived',
            name: 'Доставлен',
        });
        em.create(Offerstatuses_1.Offerstatuses, {
            value: 'closed',
            name: 'Закрыта',
        });
        em.create(Offerstatuses_1.Offerstatuses, {
            value: 'awaitingPayment',
            name: 'Ожидание выплаты',
        });
        em.create(Offerstatuses_1.Offerstatuses, {
            value: 'arbitrary',
            name: 'Арбитраж',
        });
        em.create(Paymentmethods_1.Paymentmethods, {
            value: 'paymentMethod_LTCT',
            name: 'LTCT',
            feePercent: 10,
            feeRaw: 50,
            minSum: 200,
            maxSum: 5000,
        });
        em.create(Paymentmethods_1.Paymentmethods, {
            value: 'paymentMethod_CARD',
            name: 'Банковская карта',
            feePercent: 10,
            feeRaw: 50,
            minSum: 200,
            maxSum: 5000,
        });
        em.create(Paymentmethods_1.Paymentmethods, {
            value: 'paymentMethod_QIWI',
            name: 'QIWI',
            feePercent: 0,
            feeRaw: 10,
            minSum: 2,
            maxSum: 5000,
        });
        em.create(Paymentmethods_1.Paymentmethods, {
            value: 'paymentMethod_BTC',
            name: 'BTC',
            feePercent: 20,
            feeRaw: 50,
            minSum: 0,
            maxSum: 5000,
        });
        em.create(Paymentmethods_1.Paymentmethods, {
            value: 'paymentMethod_DASH',
            name: 'DASH',
            feePercent: 0,
            feeRaw: 0,
            minSum: 0,
            maxSum: 5000,
        });
        em.create(Paymentmethods_1.Paymentmethods, {
            value: 'paymentMethod_ETH',
            name: 'ETH',
            feePercent: 0,
            feeRaw: 0,
            minSum: 0,
            maxSum: 5000,
        });
        em.create(Paymentmethods_1.Paymentmethods, {
            value: 'paymentMethod_USDT',
            name: 'USDT',
            feePercent: 22,
            feeRaw: 100,
            minSum: 0,
            maxSum: 5000,
        });
    }
}
exports.ConfigSeeder = ConfigSeeder;
//# sourceMappingURL=ConfigSeeder.js.map