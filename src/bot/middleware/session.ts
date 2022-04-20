import { session as session_ } from 'grammy'
import { botOfferDto } from 'src/mikroorm/dto/create-offer.dto';
import { Offers } from 'src/mikroorm/entities/Offers';
import { Session, BotContext, BotStep, OfferMode } from 'src/types/interfaces';

const initial = (): Session => ({
    user: {
        acceptedRules: 0,
        mode: OfferMode.default
    },
    step: BotStep.default,
    pendingOffer: new botOfferDto(new Offers())
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