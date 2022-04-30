"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Menu = exports.MenuRange = void 0;
const grammy_1 = require("grammy");
const b = 0xff;
const toNums = (str) => Array.from(str).map((c) => c.codePointAt(0));
const dec = new TextDecoder();
function tinyHash(nums) {
    let hash = 17;
    for (const n of nums)
        hash = ((hash << 5) + (hash << 2) + hash + n) >>> 0;
    const bytes = [hash >>> 24, (hash >> 16) & b, (hash >> 8) & b, hash & b];
    return dec.decode(Uint8Array.from(bytes));
}
const INJECT_METHODS = new Set([
    "editMessageText",
    "editMessageCaption",
    "editMessageMedia",
    "editMessageReplyMarkup",
    "stopPoll",
]);
const ops = Symbol("menu building operations");
class MenuRange {
    constructor() {
        this[_a] = [];
    }
    addRange(...range) {
        this[ops].push(...range);
        return this;
    }
    add(...btns) {
        return this.addRange([btns]);
    }
    row() {
        return this.addRange([[], []]);
    }
    url(text, url) {
        return this.add({ text, url });
    }
    text(text, ...middleware) {
        return this.add(typeof text === "object"
            ? { ...text, middleware }
            : { text, middleware });
    }
    login(text, loginUrl) {
        return this.add({
            text,
            login_url: typeof loginUrl === "string"
                ? { url: loginUrl }
                : loginUrl,
        });
    }
    switchInline(text, query = "") {
        return this.add({ text, switch_inline_query: query });
    }
    switchInlineCurrent(text, query = "") {
        return this.add({ text, switch_inline_query_current_chat: query });
    }
    game(text) {
        return this.add({ text, callback_game: {} });
    }
    pay(text) {
        return this.add({ text, pay: true });
    }
    submenu(text, menu, ...middleware) {
        return this.text(text, middleware.length === 0
            ? (ctx) => ctx.menu.nav(menu)
            : (ctx, next) => (ctx.menu.nav(menu), next()), ...middleware);
    }
    back(text, ...middleware) {
        return this.text(text, middleware.length === 0
            ? (ctx) => ctx.menu.back()
            : (ctx, next) => (ctx.menu.back(), next()), ...middleware);
    }
    dynamic(rangeBuilder) {
        return this.addRange(async (ctx) => {
            const range = new MenuRange();
            const res = await rangeBuilder(ctx, range);
            if (res instanceof Menu) {
                throw new Error("Cannot use a `Menu` instance as a dynamic range, did you mean to return an instance of `Menu.Range` instead?");
            }
            return res instanceof MenuRange ? res : range;
        });
    }
    append(range) {
        if (range instanceof MenuRange) {
            this[ops].push(...range[ops]);
            return this;
        }
        else
            return this.addRange(range);
    }
}
exports.MenuRange = MenuRange;
_a = ops;
class Menu extends MenuRange {
    constructor(id, options = {}) {
        super();
        this.id = id;
        this.parent = undefined;
        this.index = new Map();
        this.inline_keyboard = new Proxy([], {
            get: () => {
                throw new Error(`Cannot send menu '${this.id}'! Did you forget to use bot.use() for it?`);
            },
        });
        if (id.includes("/")) {
            throw new Error(`You cannot use '/' in a menu identifier ('${id}')`);
        }
        this.index.set(id, this);
        const outdated = options.onMenuOutdated;
        this.options = {
            autoAnswer: options.autoAnswer ?? true,
            onMenuOutdated: outdated === undefined || outdated === true
                ? "Menu was outdated, try again!"
                : outdated,
            fingerprint: options.fingerprint ?? (() => ""),
        };
        if (options.onMenuOutdated === false &&
            options.fingerprint !== undefined) {
            throw new Error("Cannot use a fingerprint function when outdated detection is disabled!");
        }
    }
    register(menus, parent = this.id) {
        const arr = Array.isArray(menus) ? menus : [menus];
        const existing = arr.find((m) => this.index.has(m.id));
        if (existing !== undefined) {
            throw new Error(`Menu '${existing.id}' already registered!`);
        }
        this.freeze();
        for (const menu of arr) {
            menu.freeze();
            menu.index.forEach((m, id) => {
                this.index.set(id, m);
                m.index = this.index;
            });
            menu.parent = parent;
        }
    }
    freeze() {
        if (Object.isFrozen(this[ops]))
            return;
        this[ops].push = () => {
            throw new Error("You cannot change a menu after your bot started! Did you mean to use a dynamic range instead?");
        };
        Object.freeze(this[ops]);
    }
    at(id) {
        const menu = this.index.get(id);
        if (menu === undefined) {
            const validIds = Array.from(this.index.keys())
                .map((k) => `'${k}'`)
                .join(", ");
            throw new Error(`Menu '${id}' is not known to menu '${this.id}'! Known submenus are: ${validIds}`);
        }
        return menu;
    }
    async render(ctx) {
        const renderer = createRenderer(ctx, async (btn, i, j) => {
            const text = await uniform(ctx, btn.text);
            if ("middleware" in btn) {
                const row = i.toString(16);
                const col = j.toString(16);
                const payload = await uniform(ctx, btn.payload, "");
                if (payload.includes("/")) {
                    throw new Error(`Could not render menu '${this.id}'! Payload must not contain a '/' character but was '${payload}'`);
                }
                return {
                    callback_data: `${this.id}/${row}/${col}/${payload}/`,
                    text,
                };
            }
            else
                return { ...btn, text };
        });
        const rendered = await renderer(this[ops]);
        const lengths = [rendered.length, ...rendered.map((row) => row.length)];
        const fingerprint = await uniform(ctx, this.options.fingerprint);
        for (const row of rendered) {
            for (const btn of row) {
                if ("callback_data" in btn) {
                    let type;
                    let data;
                    if (fingerprint) {
                        type = "f";
                        data = toNums(fingerprint);
                    }
                    else {
                        type = "h";
                        data = [...lengths, ...toNums(btn.text)];
                    }
                    btn.callback_data += type + tinyHash(data);
                }
            }
        }
        return rendered;
    }
    async prepare(payload, ctx) {
        if (payload.reply_markup instanceof Menu) {
            const menu = this.index.get(payload.reply_markup.id);
            if (menu !== undefined) {
                const rendered = await menu.render(ctx);
                payload.reply_markup = { inline_keyboard: rendered };
            }
        }
    }
    middleware() {
        const composer = new grammy_1.Composer((ctx, next) => {
            ctx.api.config.use(async (prev, method, payload, signal) => {
                const p = payload;
                if (Array.isArray(p.results)) {
                    await Promise.all(p.results.map((r) => this.prepare(r, ctx)));
                }
                else
                    await this.prepare(p, ctx);
                return await prev(method, payload, signal);
            });
            return next();
        });
        composer.on("callback_query:data").lazy(async (ctx) => {
            const [id, rowStr, colStr, payload, ...rest] = ctx
                .callbackQuery.data.split("/");
            const [type, ...h] = rest.join("/");
            const hash = h.join("");
            if (!rowStr || !colStr)
                return [];
            if (type !== "h" && type !== "f")
                return [];
            const menu = this.index.get(id);
            if (menu === undefined)
                return [];
            const row = parseInt(rowStr, 16);
            const col = parseInt(colStr, 16);
            if (row < 0 || col < 0) {
                const msg = `Invalid button position '${rowStr}/${colStr}'`;
                throw new Error(msg);
            }
            const outdated = menu.options.onMenuOutdated;
            if (payload)
                ctx.match = payload;
            const navInstaller = this.makeNavInstaller(menu);
            function menuIsOutdated() {
                if (outdated === false)
                    throw new Error("cannot happen");
                return typeof outdated !== "string"
                    ? [navInstaller, outdated]
                    : (ctx) => Promise.all([
                        ctx.answerCallbackQuery({ text: outdated }),
                        ctx.editMessageReplyMarkup({ reply_markup: menu }),
                    ]);
            }
            const fingerprint = await uniform(ctx, menu.options.fingerprint);
            const useFp = fingerprint !== "";
            if (useFp !== (type === "f"))
                return menuIsOutdated();
            if (useFp && tinyHash(toNums(fingerprint)) !== hash) {
                return menuIsOutdated();
            }
            const renderer = createRenderer(ctx, (btn) => btn);
            const range = await renderer(menu[ops]);
            const check = !useFp && outdated !== false;
            if (check && (row >= range.length || col >= range[row].length)) {
                return menuIsOutdated();
            }
            const btn = range[row][col];
            if (!("middleware" in btn)) {
                if (check)
                    return menuIsOutdated();
                throw new Error(`Cannot invoke handlers because menu '${menu.id}' is outdated!`);
            }
            if (check) {
                const rowCount = range.length;
                const rowLengths = range.map((row) => row.length);
                const label = await uniform(ctx, btn.text);
                const data = [rowCount, ...rowLengths, ...toNums(label)];
                const expectedHash = tinyHash(data);
                if (hash !== expectedHash)
                    return menuIsOutdated();
            }
            const handler = btn.middleware;
            const mw = [navInstaller, ...handler];
            if (!menu.options.autoAnswer)
                return mw;
            const c = new grammy_1.Composer();
            c.fork((ctx) => ctx.answerCallbackQuery());
            c.use(...mw);
            return c;
        });
        return composer.middleware();
    }
    makeNavInstaller(menu) {
        return async (ctx, next) => {
            let injectMenu = false;
            let targetMenu = menu;
            ctx.api.config.use((prev, method, payload, signal) => {
                if (INJECT_METHODS.has(method) &&
                    !("reply_markup" in payload) &&
                    "chat_id" in payload &&
                    payload.chat_id !== undefined &&
                    payload.chat_id === ctx.chat?.id &&
                    "message_id" in payload &&
                    payload.message_id !== undefined &&
                    payload.message_id === ctx.msg?.message_id) {
                    injectMenu = false;
                    Object.assign(payload, { reply_markup: targetMenu });
                }
                return prev(method, payload, signal);
            });
            async function nav({ immediate } = {}, menu) {
                injectMenu = true;
                targetMenu = menu;
                if (immediate)
                    await ctx.editMessageReplyMarkup();
            }
            const controlPanel = {
                update: (config) => nav(config, menu),
                close: (config) => nav(config, undefined),
                nav: (to, config) => nav(config, menu.at(to)),
                back: (config) => {
                    const parent = menu.parent;
                    if (parent === undefined) {
                        throw new Error(`Cannot navigate back from menu '${menu.id}', no known parent!`);
                    }
                    return nav(config, menu.at(parent));
                },
            };
            Object.assign(ctx, { menu: controlPanel });
            try {
                await next();
                if (injectMenu)
                    await nav({ immediate: true }, targetMenu);
            }
            finally {
                Object.assign(ctx, { menu: undefined });
            }
        };
    }
}
exports.Menu = Menu;
function createRenderer(ctx, buttonTransformer) {
    async function layout(keyboard, range) {
        const k = await keyboard;
        const btns = typeof range === "function" ? await range(ctx) : range;
        if (btns instanceof MenuRange) {
            return btns[ops].reduce(layout, keyboard);
        }
        let first = true;
        for (const row of btns) {
            if (!first)
                k.push([]);
            const i = k.length - 1;
            for (const button of row) {
                const j = k[i].length;
                const btn = await buttonTransformer(button, i, j);
                k[i].push(btn);
            }
            first = false;
        }
        return k;
    }
    return (ops) => ops.reduce(layout, Promise.resolve([[]]));
}
function uniform(ctx, value, fallback = "") {
    if (value === undefined)
        return fallback;
    else if (typeof value === "function")
        return value(ctx);
    else
        return value;
}
//# sourceMappingURL=menu-extended.js.map