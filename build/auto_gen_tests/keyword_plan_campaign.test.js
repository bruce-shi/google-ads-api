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
// @ts-ignore
const test_utils_1 = require("../test_utils");
const customer = test_utils_1.newCustomer();
describe('KeywordPlanCampaign', () => __awaiter(this, void 0, void 0, function* () {
    describe('reporting', () => __awaiter(this, void 0, void 0, function* () {
        it('can retrieve a list of KeywordPlanCampaigns with all fields (if valid)', () => __awaiter(this, void 0, void 0, function* () {
            const keyword_plan_campaigns = yield customer.keywordPlanCampaigns.list();
            expect(keyword_plan_campaigns).toBeInstanceOf(Array);
            // @ts-ignore Ignore missing proto definitions for now
            if (keyword_plan_campaigns.length > 0 && keyword_plan_campaigns[0].keyword_plan_campaign.resource_name) {
                expect(keyword_plan_campaigns[0].keyword_plan_campaign).toEqual(expect.objectContaining({
                    resource_name: expect.stringContaining(`customers/${test_utils_1.CID}/keywordPlanCampaigns`) || '',
                }));
                // @ts-ignore Ignore missing proto definitions for now
                const resource = keyword_plan_campaigns[0].keyword_plan_campaign.resource_name;
                if (resource) {
                    const singleton = yield customer.keywordPlanCampaigns.get(resource);
                    expect(singleton).toBeInstanceOf(Object);
                    expect(singleton).toEqual(expect.objectContaining({
                        resource_name: expect.stringContaining(`customers/${test_utils_1.CID}/keywordPlanCampaigns`) || '',
                    }));
                }
            }
        }));
        it('throws an error when the request is invalid', () => __awaiter(this, void 0, void 0, function* () {
            yield expect(customer.keywordPlanCampaigns.list({
                limit: -10,
                constraints: ['FakeConstraint=INVALID'],
            })).rejects.toThrow('Unrecognized field');
        }));
    }));
}));
