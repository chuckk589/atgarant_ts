export interface AppConfig {
    env: string,
    test: number
}

export default (): AppConfig => ({
    env: process.env.NODE_ENV || 'development',
    test: 228,
});