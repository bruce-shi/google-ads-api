"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_utils_1 = require("../test_utils");
const customer = test_utils_1.newCustomer();
describe('Geo Target Constants', () => __awaiter(this, void 0, void 0, function* () {
    const location_id = '1021278';
    it('Retrieves Single Geo Target Constant', () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(1);
        const geo_target_constant = yield customer.geoTargetConstants.get(`geoTargetConstants/${location_id}`);
        expect(geo_target_constant.name).toEqual('Raleigh');
    }));
    it('Suggests Geo Target Constants', () => __awaiter(this, void 0, void 0, function* () {
        const geo_target_constants = yield customer.geoTargetConstants.suggest({
            locale: 'en',
            country_code: 'US',
            location_names: {
                names: ['mountain view'],
            },
        });
        expect(geo_target_constants[0].search_term).toEqual('mountain view');
        expect(geo_target_constants).toBeInstanceOf(Array);
    }));
}));
