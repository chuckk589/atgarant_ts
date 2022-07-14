import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Configs } from '../entities/Configs';
import { Invoicestatuses } from '../entities/Invoicestatuses';
import { Offerstatuses } from '../entities/Offerstatuses';
import { Paymentmethods } from '../entities/Paymentmethods';

export class ConfigSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    em.create(Configs, {
      name: 'QIWI_P2P_TOKEN',
      value: '111',
      category: 'QIWI',
      requiresReboot: 1,
    });
    em.create(Configs, {
      name: 'BOT_TOKEN_PROD',
      value: '1863509702:AAHj4bH--KGvJwl8oguY0Rj4Uo7bHsAiUNg',
      category: 'Telegram',
      requiresReboot: 1,
    });
    em.create(Configs, {
      name: 'QIWI_P2P_TOKEN_SECRET',
      value: '111',
      category: 'QIWI',
      requiresReboot: 1,
    });
    em.create(Configs, {
      name: 'QIWI_API_TOKEN',
      value: '111',
      category: 'QIWI',
      requiresReboot: 1,
    });
    em.create(Configs, {
      name: 'COIN_API_KEY',
      value: '111',
      category: 'Payments_Coinpayments',
      requiresReboot: 1,
    });
    em.create(Configs, {
      name: 'COIN_API_KEY_SECRET',
      value: '111',
      category: 'Payments_Coinpayments',
      requiresReboot: 1,
    });
    em.create(Configs, {
      name: 'APP_API_ID',
      value: '7395347',
      category: 'Telegram',
      requiresReboot: 1,
    });
    em.create(Configs, {
      name: 'APP_API_HASH',
      value: '111',
      category: 'Telegram',
      requiresReboot: 1,
    });
    em.create(Configs, {
      name: 'APP_SESSION_STRING',
      value: '111',
      category: 'Telegram',
      requiresReboot: 0,
    });
    em.create(Configs, {
      name: 'ROLE_USER_0',
      value: 'user',
      category: 'config',
      requiresReboot: 0,
    });
    em.create(Configs, {
      name: 'ROLE_USER_1',
      value: 'admin',
      category: 'config',
      requiresReboot: 0,
    });
    em.create(Configs, {
      name: 'PAYMENT_SERVICE',
      value: 'coinpayments',
      category: 'Payments',
      requiresReboot: 0,
    });
    em.create(Configs, {
      name: 'BTC_WALLET',
      value: '11',
      category: 'Payments_Bitcoin-core',
      requiresReboot: 1,
    });
    em.create(Configs, {
      name: 'BTC_PASSWORD',
      value: 'bitcoinpassword',
      category: 'Payments_Bitcoin-core',
      requiresReboot: 1,
    });
    em.create(Configs, {
      name: 'BTC_USER',
      value: 'bitcoinuser',
      category: 'Payments_Bitcoin-core',
      requiresReboot: 1,
    });
    em.create(Configs, {
      name: 'BTC_NETWORK',
      value: 'testnet',
      category: 'Payments_Bitcoin-core',
      requiresReboot: 1,
    });
    em.create(Configs, {
      name: 'BTC_PORT',
      value: '18332',
      category: 'Payments_Bitcoin-core',
      requiresReboot: 1,
    });
    em.create(Configs, {
      name: 'BTC_CONFIRMATIONS',
      value: '0',
      category: 'Payments_Bitcoin-core',
      requiresReboot: 1,
    });
    em.create(Configs, {
      name: 'BTC_UPDATE_TIMEOUT',
      category: 'Payments_Bitcoin-core',
      requiresReboot: 1,
    });
    em.create(Configs, {
      name: 'BTC_INCOMING_TIMEOUT',
      category: 'Payments_Bitcoin-core',
      requiresReboot: 1,
    });
    em.create(Configs, {
      name: 'BTC_OUTGOING_TIMEOUT',
      category: 'Payments_Bitcoin-core',
      requiresReboot: 1,
    });
    em.create(Invoicestatuses, {
      value: 'waiting',
      name: 'Ожидание платежа',
    });
    em.create(Invoicestatuses, {
      value: 'success',
      name: 'Завершен',
    });
    em.create(Invoicestatuses, {
      value: 'refunded',
      name: 'Выплачен',
    });
    em.create(Offerstatuses, {
      value: 'pending',
      name: 'На согласовании',
    });
    em.create(Offerstatuses, {
      value: 'denied',
      name: 'Отклонена',
    });
    em.create(Offerstatuses, {
      value: 'accepted',
      name: 'Ожидание платежа',
    });
    em.create(Offerstatuses, {
      value: 'payed',
      name: 'Ожидает отправки',
    });
    em.create(Offerstatuses, {
      value: 'shipped',
      name: 'Отправлен',
    });
    em.create(Offerstatuses, {
      value: 'arrived',
      name: 'Доставлен',
    });
    em.create(Offerstatuses, {
      value: 'closed',
      name: 'Закрыта',
    });
    em.create(Offerstatuses, {
      value: 'awaitingPayment',
      name: 'Ожидание выплаты',
    });
    em.create(Offerstatuses, {
      value: 'arbitrary',
      name: 'Арбитраж',
    });
    em.create(Paymentmethods, {
      value: 'paymentMethod_LTCT',
      name: 'LTCT',
      feePercent: 10,
      feeRaw: 50,
      minSum: 200,
      maxSum: 5000,
    });
    em.create(Paymentmethods, {
      value: 'paymentMethod_CARD',
      name: 'Банковская карта',
      feePercent: 10,
      feeRaw: 50,
      minSum: 200,
      maxSum: 5000,
    });
    em.create(Paymentmethods, {
      value: 'paymentMethod_QIWI',
      name: 'QIWI',
      feePercent: 0,
      feeRaw: 10,
      minSum: 2,
      maxSum: 5000,
    });
    em.create(Paymentmethods, {
      value: 'paymentMethod_BTC',
      name: 'BTC',
      feePercent: 20,
      feeRaw: 50,
      minSum: 0,
      maxSum: 5000,
    });
    em.create(Paymentmethods, {
      value: 'paymentMethod_DASH',
      name: 'DASH',
      feePercent: 0,
      feeRaw: 0,
      minSum: 0,
      maxSum: 5000,
    });
    em.create(Paymentmethods, {
      value: 'paymentMethod_ETH',
      name: 'ETH',
      feePercent: 0,
      feeRaw: 0,
      minSum: 0,
      maxSum: 5000,
    });
    em.create(Paymentmethods, {
      value: 'paymentMethod_USDT',
      name: 'USDT',
      feePercent: 22,
      feeRaw: 100,
      minSum: 0,
      maxSum: 5000,
    });
  }
}
