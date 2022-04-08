import pino from 'pino'

const logger = pino({
    timestamp: () => `,"time":"${new Date(Date.now()).toLocaleString()}"`,
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
})
export default logger