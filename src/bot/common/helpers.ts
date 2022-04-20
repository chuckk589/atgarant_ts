import { BotContext } from 'src/types/interfaces'
import i18n from '../middleware/i18n'

export function match(key: string): RegExp {
    const locales: string[] = i18n.availableLocales()
    return new RegExp(locales.map(l => i18n.t(l, key)).join('|'))
}

// export const label = (ctx: BotContext) => {
//     return (label: string) => ctx.i18n.t(label)
// }
export const label = (payload: { text: string, payload?: string }) => {
    return (ctx: BotContext) => ctx.i18n.t(payload.text)
}

// export function searchLabel(ctx: BotContext): string {
//     if (!ctx.session.category.id) {
//         return ctx.i18n.t("searchCategory")
//     } else {
//         return ctx.i18n.t("searchProduct", { category: ctx.session.category.name })
//     }
// }