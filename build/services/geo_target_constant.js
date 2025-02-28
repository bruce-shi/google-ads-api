"use strict";
// manual_mode: This file has been manually modified and should not be touched by generate_services.js
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
// @ts-ignore
const lodash_1 = require("lodash");
const service_1 = __importDefault(require("./service"));
/**
 * @constants
 */
const RESOURCE_URL_NAME = 'geoTargetConstants';
const GET_METHOD = 'getGeoTargetConstant';
const GET_REQUEST = 'GetGeoTargetConstantRequest';
class GeoTargetConstantService extends service_1.default {
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.serviceGet({
                request: GET_REQUEST,
                resource: `${RESOURCE_URL_NAME}/${id}`,
                method: GET_METHOD,
                entity_id: id,
            });
        });
    }
    list(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getListResults('geo_target_constant', options);
        });
    }
    suggest(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const pb = this.buildResource('SuggestGeoTargetConstantsRequest', options);
            const response = yield this.service.suggestGeoTargetConstants(pb);
            const parsed = this.parseServiceResults(lodash_1.values(response.geoTargetConstantSuggestions));
            return parsed;
        });
    }
}
exports.default = GeoTargetConstantService;
