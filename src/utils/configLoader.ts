import 'dotenv/config'
import { DI, init } from 'src/mikroorm/index'

async function load(): Promise<void> {
    await init()
    return new Promise(async (res, rej) => {
        try {
            const configs = await DI.ConfigRepository.findAll()
            configs.map(config => process.env[config.name!] = config.value);
            const options = process.env.PAYMENT_SERVICE == 'btc-core' ? { value: 'paymentMethod_BTC' } : {}
            const paymentMethods = await DI.PaymentMethodRepository.find(options)
            paymentMethods.map(paymentMethod => process.env[paymentMethod.value!] = `${paymentMethod.feeRaw} ${paymentMethod.feePercent} ${paymentMethod.minSum} ${paymentMethod.maxSum}`)
            res()
        } catch (error) {
            rej()
        }
    })
}


export { load }

