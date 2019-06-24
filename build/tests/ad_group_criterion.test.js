"use strict";
// Auto Generated File! Do Not Edit.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("google-ads-node/build/lib/enums");
const index_1 = require("../index");
// @ts-ignore
const test_utils_1 = require("../test_utils");
const customer = test_utils_1.newCustomer();
describe('AdGroupCriterion', () => __awaiter(this, void 0, void 0, function* () {
    describe('reporting', () => __awaiter(this, void 0, void 0, function* () {
        it('can retrieve a list of AdGroupCriterions with all fields (if valid)', () => __awaiter(this, void 0, void 0, function* () {
            const ad_group_criterions = yield customer.adGroupCriteria.list();
            expect(ad_group_criterions).toBeInstanceOf(Array);
            // @ts-ignore Ignore missing proto definitions for now
            if (ad_group_criterions.length > 0 && ad_group_criterions[0].ad_group_criterion.resource_name) {
                expect(ad_group_criterions[0].ad_group_criterion).toEqual(expect.objectContaining({
                    resource_name: expect.stringContaining(`customers/${test_utils_1.CID}/adGroupCriteria`) || '',
                }));
                // @ts-ignore Ignore missing proto definitions for now
                const resource = ad_group_criterions[0].ad_group_criterion.resource_name;
                if (resource) {
                    const singleton = yield customer.adGroupCriteria.get(resource);
                    expect(singleton).toBeInstanceOf(Object);
                    expect(singleton).toEqual(expect.objectContaining({
                        resource_name: expect.stringContaining(`customers/${test_utils_1.CID}/adGroupCriteria`) || '',
                    }));
                }
            }
        }));
        it('throws an error when the request is invalid', () => __awaiter(this, void 0, void 0, function* () {
            yield expect(customer.adGroupCriteria.list({
                limit: -10,
                constraints: ['FakeConstraint=INVALID'],
            })).rejects.toThrow('Unrecognized field');
        }));
    }));
    describe('mutation', () => {
        let new_keyword_resource_name = '';
        it('can create a new keyword', () => __awaiter(this, void 0, void 0, function* () {
            const keyword = {
                ad_group: `customers/${test_utils_1.CID}/adGroups/${test_utils_1.ADGROUP_ID}`,
                status: enums_1.AdGroupCriterionStatus.PAUSED,
                keyword: {
                    text: test_utils_1.getRandomName('keyword'),
                    match_type: enums_1.KeywordMatchType.EXACT,
                },
            };
            const { results } = yield customer.adGroupCriteria.create(keyword);
            new_keyword_resource_name = results[0];
            expect(results[0]).toContain(`customers/${test_utils_1.CID}/adGroupCriteria/`);
        }));
        it('supports multiple operations when using create', () => __awaiter(this, void 0, void 0, function* () {
            const { results } = yield customer.adGroupCriteria.create([
                {
                    ad_group: `customers/${test_utils_1.CID}/adGroups/${test_utils_1.ADGROUP_ID}`,
                    keyword: {
                        text: test_utils_1.getRandomName('keyword'),
                        match_type: enums_1.KeywordMatchType.EXACT,
                    },
                },
                {
                    ad_group: `customers/${test_utils_1.CID}/adGroups/${test_utils_1.ADGROUP_ID}`,
                    keyword: {
                        text: test_utils_1.getRandomName('keyword'),
                        match_type: enums_1.KeywordMatchType.EXACT,
                    },
                },
            ], {
                validate_only: true,
            });
            /* Result is empty because we're using validate only */
            expect(results).toEqual([]);
        }));
        it('can update a keyword', () => __awaiter(this, void 0, void 0, function* () {
            const { results } = yield customer.adGroupCriteria.update({
                resource_name: new_keyword_resource_name,
                cpc_bid_micros: index_1.toMicros(1.5),
            });
            expect(results[0]).toEqual(new_keyword_resource_name);
        }));
        it('can delete a keyword', (done) => __awaiter(this, void 0, void 0, function* () {
            yield customer.adGroupCriteria.delete(new_keyword_resource_name);
            done();
        }));
    });
}));
