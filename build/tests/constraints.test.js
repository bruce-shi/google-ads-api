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
const index_1 = require("../index");
const test_utils_1 = require("../test_utils");
const customer = test_utils_1.newCustomerWithMetrics();
describe('Constraints', () => {
    it('supports using a single constraints object', () => __awaiter(this, void 0, void 0, function* () {
        const [{ campaign, campaign_budget }] = yield customer.report({
            entity: 'campaign',
            attributes: ['campaign.status', 'campaign.advertising_channel_type', 'campaign_budget.status'],
            constraints: {
                'campaign.status': index_1.enums.CampaignStatus.ENABLED,
                'campaign.advertising_channel_type': index_1.enums.AdvertisingChannelType.SEARCH,
                'campaign_budget.status': index_1.enums.BudgetStatus.ENABLED,
            },
        });
        expect(campaign).toEqual(expect.objectContaining({
            status: 2,
            advertising_channel_type: 2,
        }));
        expect(campaign_budget.status).toEqual(2);
    }));
    it('supports using key, val, op style constraints', () => __awaiter(this, void 0, void 0, function* () {
        const [{ campaign }] = yield customer.report({
            entity: 'campaign',
            attributes: ['campaign.status', 'campaign.status'],
            constraints: [
                {
                    key: 'campaign.status',
                    op: '=',
                    val: index_1.enums.CampaignStatus.PAUSED,
                },
            ],
        });
        expect(campaign.status).toEqual(index_1.enums.CampaignStatus.PAUSED);
    }));
});
