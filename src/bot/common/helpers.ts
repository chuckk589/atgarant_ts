import i18n from '../middleware/i18n'

export function match(key: string): RegExp {
    const locales: string[] = i18n.availableLocales()
    return new RegExp(locales.map(l => i18n.t(l, key)).join('|'))
}

// export function searchLabel(ctx: BotContext): string {
//     if (!ctx.session.category.id) {
//         return ctx.i18n.t("searchCategory")
//     } else {
//         return ctx.i18n.t("searchProduct", { category: ctx.session.category.name })
//     }
// }