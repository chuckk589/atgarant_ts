import { session as session_ } from 'grammy'
import { Session, BotContext } from 'src/types/interfaces';

const initial = (): Session => ({
    
    // category: { id: undefined, name: undefined },
})

function getSessionKey(ctx: BotContext): string | undefined {
    // Give every user their personal session storage
    // (will be shared across groups and in their private chat)
    return ctx.from?.id.toString();
}

export const session = session_({
    initial: initial,
    getSessionKey: getSessionKey
})