"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Menu = exports.Use = exports.Hears = exports.Command = exports.On = exports.RouterController = exports.MenuController = exports.ComposerController = void 0;
const grammy_1 = require("grammy");
const constants_1 = require("../../constants");
const interfaces_1 = require("../../types/interfaces");
function ComposerController(constructor) {
    const fn = (fn) => fn();
    return class extends constructor {
        constructor() {
            super(...arguments);
            this._composer = fn(() => {
                const composer = new grammy_1.Composer();
                const handlers = Reflect.getMetadata(constants_1.LISTENERS_METADATA, constructor.prototype);
                const that = this;
                handlers.map((handler) => {
                    if (handler.method == interfaces_1.TMethod.on) {
                        composer.on(handler.query, that[handler.key]);
                    }
                    else if (handler.method == interfaces_1.TMethod.command) {
                        composer.command(handler.query, that[handler.key]);
                    }
                    else if (handler.method == interfaces_1.TMethod.use || handler.method == interfaces_1.TMethod.menu) {
                        composer.use(that[handler.key]);
                    }
                    else if (handler.method == interfaces_1.TMethod.hears) {
                        composer.hears(handler.query, that[handler.key]);
                    }
                });
                return composer;
            });
        }
    };
}
exports.ComposerController = ComposerController;
function MenuController(constructor) {
    const fn = (fn) => fn();
    return class extends constructor {
        constructor() {
            super(...arguments);
            this._menu = fn(() => {
                const menus = Reflect.getMetadata(constants_1.LISTENERS_METADATA, constructor.prototype);
                if (menus.length !== 1)
                    throw new Error('only 1 menu instance is allowed per menu module');
                const that = this;
                return that[menus[0].key];
            });
        }
    };
}
exports.MenuController = MenuController;
function RouterController(constructor) {
    const fn = (fn) => fn();
    return class extends constructor {
        constructor() {
            super(...arguments);
            this._router = fn(() => {
                const router = Reflect.getMetadata(constants_1.LISTENERS_METADATA, constructor.prototype);
                const that = this;
                return that[router.pop()?.key];
            });
        }
    };
}
exports.RouterController = RouterController;
exports.On = createListenerDecorator(interfaces_1.TMethod.on);
exports.Command = createListenerDecorator(interfaces_1.TMethod.command);
exports.Hears = createListenerDecorator(interfaces_1.TMethod.hears);
exports.Use = createListenerDecorator(interfaces_1.TMethod.use);
function createListenerDecorator(method) {
    return (query) => {
        return (_target, _key) => {
            const metadata = [new interfaces_1.ListenerMetadata(method, query, _key)];
            const previousValue = Reflect.getMetadata(constants_1.LISTENERS_METADATA, _target) || [];
            const value = [...previousValue, ...metadata];
            Reflect.defineMetadata(constants_1.LISTENERS_METADATA, value, _target);
        };
    };
}
function Menu(name) {
    return (_target, _key) => {
        const metadata = [new interfaces_1.MenuListenerMetadata(name, _key)];
        const previousValue = Reflect.getMetadata(constants_1.LISTENERS_METADATA, _target) || [];
        const value = [...previousValue, ...metadata];
        Reflect.defineMetadata(constants_1.LISTENERS_METADATA, value, _target);
    };
}
exports.Menu = Menu;
//# sourceMappingURL=decorators.js.map