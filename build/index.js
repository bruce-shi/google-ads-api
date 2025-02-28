"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Gads-api Client */
const client_1 = __importDefault(require("./client"));
exports.GoogleAdsApi = client_1.default;
/* Gads-node types (note: these are non-grpc types, purely ts) */
/* Enums */
const enums = __importStar(require("google-ads-node/build/lib/enums"));
exports.enums = enums;
/* Types */
const types = __importStar(require("google-ads-node/build/lib/resources"));
exports.types = types;
/* Helpers */
const utils_1 = require("./utils");
exports.fromMicros = utils_1.fromMicros;
exports.toMicros = utils_1.toMicros;
exports.getEnumString = utils_1.getEnumString;
const token_1 = require("./token");
exports.getAccessToken = token_1.getAccessToken;
