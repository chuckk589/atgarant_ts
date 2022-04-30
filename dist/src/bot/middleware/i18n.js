"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = require("@grammyjs/i18n");
const path_1 = __importDefault(require("path"));
const i18n = new i18n_1.I18n({
    directory: path_1.default.resolve(__dirname, '../locales'),
    defaultLanguage: 'en',
    useSession: true,
    allowMissing: true,
    templateData: {
        pluralize: i18n_1.pluralize,
        uppercase: (value) => value.toUpperCase(),
    },
});
exports.default = i18n;
//# sourceMappingURL=i18n.js.map