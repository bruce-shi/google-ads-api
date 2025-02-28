"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const request_1 = __importDefault(require("request"));
const ADWORDS_AUTH_URL = 'https://accounts.google.com/o/oauth2/token';
const token_cache_1 = require("./token_cache");
exports.getAccessToken = ({ client_id, client_secret, refresh_token }) => __awaiter(this, void 0, void 0, function* () {
    const hash = getTokenHash({
        client_id,
        client_secret,
        refresh_token,
    });
    const now = Date.now();
    if (token_cache_1.cached_tokens[hash] && token_cache_1.cached_tokens[hash].expires > now) {
        return token_cache_1.cached_tokens[hash].access_token;
    }
    if (token_cache_1.unresolved_token_promises[hash]) {
        return (yield token_cache_1.unresolved_token_promises[hash]).access_token;
    }
    const token_promise = refreshAccessToken(client_id, client_secret, refresh_token)
        .then(token => {
        token_cache_1.cached_tokens[hash] = token;
        delete token_cache_1.unresolved_token_promises[hash];
        return {
            access_token: token.access_token,
            expires: now + token.expires_in * 1000 - 1000 * 60 * 3,
        };
    })
        .catch(e => {
        delete token_cache_1.unresolved_token_promises[hash];
        return Promise.reject(e);
    });
    token_cache_1.unresolved_token_promises[hash] = token_promise;
    const token_object = yield token_promise;
    token_cache_1.cached_tokens[hash] = token_object;
    return token_object.access_token;
});
const getTokenHash = (auth) => crypto_1.default
    .createHash('sha256')
    .update(`${auth.client_id}_${auth.refresh_token}`)
    .digest('base64');
const refreshAccessToken = (client_id, client_secret, refresh_token) => {
    const options = {
        url: ADWORDS_AUTH_URL,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: {
            client_id,
            client_secret,
            refresh_token,
            grant_type: 'refresh_token',
        },
    };
    return new Promise((resolve, reject) => {
        request_1.default(options, (error, response, body) => {
            if (error) {
                reject(error);
            }
            else {
                const token = JSON.parse(body);
                resolve(token);
            }
        });
    });
};
