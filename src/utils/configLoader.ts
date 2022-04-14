import { Configs } from 'src/mikroorm/entities/Configs';
import { Paymentmethods } from 'src/mikroorm/entities/Paymentmethods';
import { DI, init, } from 'src/mikroorm/index'

async function load(): Promise<void> {
    return new Promise(async (res, rej) => {
        try {
            await init()
            const configs = await DI.em.find(Configs, {})
            configs.map(config => process.env[config.name!] = config.value);
            const options = process.env.PAYMENT_SERVICE == 'btc-core' ? { value: 'paymentMethod_BTC' } : {}
            const paymentMethods = await DI.em.find(Paymentmethods, options)
            paymentMethods.map(paymentMethod => process.env[paymentMethod.value!] = `${paymentMethod.feeRaw} ${paymentMethod.feePercent} ${paymentMethod.minSum} ${paymentMethod.maxSum}`)
            await DI.orm.close()
            res()
        } catch (error) {
            rej(error)
        }
    })
}


export { load }

