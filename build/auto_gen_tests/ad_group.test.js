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
describe('AdGroup', () => __awaiter(this, void 0, void 0, function* () {
    describe('reporting', () => __awaiter(this, void 0, void 0, function* () {
        it('can retrieve a list of AdGroups with all fields (if valid)', () => __awaiter(this, void 0, void 0, function* () {
            const ad_groups = yield customer.adGroups.list();
            expect(ad_groups).toBeInstanceOf(Array);
            if (ad_groups.length > 0 && ad_groups[0].ad_group.resource_name) {
                expect(ad_groups[0].ad_group).toEqual(expect.objectContaining({
                    resource_name: expect.stringContaining(`customers/${test_utils_1.CID}/adGroups`) || '',
                }));
                const resource = ad_groups[0].ad_group.resource_name;
                if (resource) {
                    const singleton = yield customer.adGroups.get(resource);
                    expect(singleton).toBeInstanceOf(Object);
                    expect(singleton).toEqual(expect.objectContaining({
                        resource_name: expect.stringContaining(`customers/${test_utils_1.CID}/adGroups`) || '',
                    }));
                }
            }
        }));
        it('throws an error when the request is invalid', () => __awaiter(this, void 0, void 0, function* () {
            yield expect(customer.adGroups.list({
                limit: -10,
                constraints: ['FakeConstraint=INVALID'],
            })).rejects.toThrow('Unrecognized field');
        }));
    }));
}));
