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
const enums_1 = require("google-ads-node/build/lib/enums");
const __1 = require("..");
const test_utils_1 = require("../test_utils");
const customer = test_utils_1.newCustomerWithMetrics();
const customer_no_metrics = test_utils_1.newCustomer();
describe('customer', () => {
    describe('report', () => {
        it('retrieves data for a specified entity (with metrics + constraints)', () => __awaiter(this, void 0, void 0, function* () {
            const ad_group = yield customer.report({
                entity: 'ad_group',
                attributes: ['ad_group.id', 'ad_group.name', 'ad_group.campaign', 'ad_group.status'],
                metrics: ['metrics.cost_micros'],
                constraints: [
                    {
                        'ad_group.status': enums_1.AdGroupStatus.ENABLED,
                    },
                ],
                limit: 5,
            });
            expect(ad_group).toBeInstanceOf(Array);
            expect(ad_group.length).toEqual(5);
            const a = ad_group[0].ad_group;
            expect(a).toEqual(expect.objectContaining({
                resource_name: expect.stringContaining(`customers/${test_utils_1.CID_WITH_METRICS}/adGroups/`),
                id: expect.any(Number),
                name: expect.any(String),
                campaign: expect.stringContaining(`customers/${test_utils_1.CID_WITH_METRICS}/campaigns/`),
                status: enums_1.AdGroupStatus.ENABLED,
            }));
            expect(ad_group[0].metrics).toEqual(expect.objectContaining({
                cost_micros: expect.any(Number),
            }));
        }));
        it('retrieves data when using segments', () => __awaiter(this, void 0, void 0, function* () {
            const ad_group = yield customer.report({
                entity: 'ad_group',
                attributes: ['ad_group.id', 'campaign.id'],
                segments: ['segments.device'],
                limit: 3,
            });
            expect(ad_group[0]).toEqual({
                ad_group: expect.objectContaining({
                    resource_name: expect.any(String),
                    id: expect.any(Number),
                }),
                campaign: expect.objectContaining({
                    resource_name: expect.any(String),
                    id: expect.any(Number),
                }),
                segments: expect.objectContaining({
                    device: expect.any(Number),
                }),
            });
        }));
        it('supports using date constants', () => __awaiter(this, void 0, void 0, function* () {
            const [ad_group] = yield customer.report({
                entity: 'ad_group',
                attributes: ['ad_group.id'],
                segments: ['segments.date'],
                date_constant: 'TODAY',
                limit: 1,
            });
            const expected_date = new Date().toJSON().slice(0, 10);
            expect(ad_group.segments.date).toEqual(expected_date);
        }));
        it('supports custom date ranges', () => __awaiter(this, void 0, void 0, function* () {
            const ad_groups = yield customer.report({
                entity: 'ad_group',
                attributes: ['ad_group.id'],
                segments: ['segments.date'],
                from_date: '2019-01-01',
                to_date: '2019-01-10',
                order_by: 'segments.date',
                sort_order: 'ASC',
            });
            expect(ad_groups[0].segments.date).toEqual('2019-01-01');
            expect(ad_groups[ad_groups.length - 1].segments.date).toEqual('2019-01-10');
        }));
        it("retrieves no rows for entities that don't exist", () => __awaiter(this, void 0, void 0, function* () {
            const rows = yield customer.report({
                entity: 'campaign',
                attributes: ['campaign.id'],
                constraints: [{ 'campaign.id': '0123456789' }],
            });
            expect(rows).toEqual([]);
            expect(rows.length).toEqual(0);
        }));
        it('retrieves no rows because all metrics are zero (when using segments)', () => __awaiter(this, void 0, void 0, function* () {
            const data = yield customer_no_metrics.report({
                entity: 'ad_group',
                // @ts-ignore
                attributes: ['ad_group.id', 'campaign.id'],
                segments: ['segments.device'],
                limit: 10,
            });
            expect(data).toEqual([]);
            expect(data.length).toEqual(0);
        }));
    });
    describe('query', () => {
        it('can retrieve data via an gaql string', () => __awaiter(this, void 0, void 0, function* () {
            const campaigns = yield customer.query(`
                SELECT 
                    ad_group.id, 
                    ad_group.name,
                    campaign.id,
                    campaign.status
                FROM ad_group
                WHERE campaign.status = ENABLED
                LIMIT 5
            `);
            expect(campaigns.length).toEqual(5);
            expect(campaigns[0]).toEqual({
                ad_group: expect.objectContaining({
                    resource_name: expect.any(String),
                    id: expect.any(Number),
                    name: expect.any(String),
                }),
                campaign: expect.objectContaining({
                    resource_name: expect.any(String),
                    id: expect.any(Number),
                    status: enums_1.CampaignStatus.ENABLED,
                }),
            });
        }));
    });
    describe('list', () => {
        it('retrieves customers directly accessible by the user authenticating the call', () => __awaiter(this, void 0, void 0, function* () {
            const customers = yield customer.list();
            expect(customers[0]).toEqual({
                customer: expect.objectContaining({
                    resource_name: expect.stringContaining(`customers/${test_utils_1.CID_WITH_METRICS}`),
                    currency_code: expect.any(String),
                    time_zone: expect.any(String),
                }),
            });
        }));
    });
    describe('get', () => {
        it('should retrieve a single customer via an id or resource name', () => __awaiter(this, void 0, void 0, function* () {
            const c = yield customer.get(test_utils_1.CID_WITH_METRICS);
            expect(c).toEqual(expect.objectContaining({
                resource_name: `customers/${test_utils_1.CID_WITH_METRICS}`,
                id: expect.any(Number),
                descriptive_name: expect.any(String),
                currency_code: expect.any(String),
            }));
        }));
    });
    describe('update', () => {
        it('should update specified fields of a customer', (done) => __awaiter(this, void 0, void 0, function* () {
            const c = {
                resource_name: `customers/${test_utils_1.CID}`,
                descriptive_name: 'A new descriptive name',
            };
            yield customer_no_metrics.update(c, {
                validate_only: true,
            });
            done();
        }));
    });
    describe('mutate', () => {
        it('should be able to perform mutations with temporary resource ids', () => __awaiter(this, void 0, void 0, function* () {
            const response = yield customer.mutateResources([
                {
                    _resource: 'CampaignBudget',
                    resource_name: `customers/${test_utils_1.CID_WITH_METRICS}/campaignBudgets/-1`,
                    name: test_utils_1.getRandomName('budget'),
                    amount_micros: 3000000,
                    explicitly_shared: true,
                },
                {
                    _resource: 'Campaign',
                    resource_name: `customers/${test_utils_1.CID_WITH_METRICS}/campaigns/-2`,
                    campaign_budget: `customers/${test_utils_1.CID_WITH_METRICS}/campaignBudgets/-1`,
                    name: test_utils_1.getRandomName('campaign'),
                    advertising_channel_type: __1.enums.AdvertisingChannelType.SEARCH,
                    status: __1.enums.CampaignStatus.PAUSED,
                    manual_cpc: {
                        enhanced_cpc_enabled: true,
                    },
                },
                {
                    _resource: 'AdGroup',
                    resource_name: `customers/${test_utils_1.CID_WITH_METRICS}/adGroups/-3`,
                    campaign: `customers/${test_utils_1.CID_WITH_METRICS}/campaigns/-2`,
                    name: test_utils_1.getRandomName('adgroup'),
                    status: __1.enums.AdGroupStatus.PAUSED,
                },
                {
                    _resource: 'AdGroup',
                    resource_name: `customers/${test_utils_1.CID_WITH_METRICS}/adGroups/-4`,
                    campaign: `customers/${test_utils_1.CID_WITH_METRICS}/campaigns/-2`,
                    name: test_utils_1.getRandomName('adgroup'),
                    status: __1.enums.AdGroupStatus.PAUSED,
                },
            ], {
                validate_only: true,
            });
            expect(response.results).toEqual([]);
        }));
        it('should be atomic by default', () => __awaiter(this, void 0, void 0, function* () {
            yield expect(customer.mutateResources([
                {
                    _resource: 'CampaignBudget',
                    resource_name: `customers/${test_utils_1.CID_WITH_METRICS}/campaignBudgets/-1`,
                    name: test_utils_1.getRandomName('budget'),
                    amount_micros: 3000000,
                    explicitly_shared: true,
                },
                {
                    _resource: 'Campaign',
                    resource_name: `customers/${test_utils_1.CID_WITH_METRICS}/campaigns/-2`,
                    campaign_budget: `customers/${test_utils_1.CID_WITH_METRICS}/campaignBudgets/123`,
                    name: test_utils_1.getRandomName('campaign'),
                    advertising_channel_type: __1.enums.AdvertisingChannelType.SEARCH,
                    status: __1.enums.CampaignStatus.PAUSED,
                    manual_cpc: {
                        enhanced_cpc_enabled: true,
                    },
                },
            ], { validate_only: true })).rejects.toThrow();
        }));
        it('should support partial failures', () => __awaiter(this, void 0, void 0, function* () {
            const response = yield customer_no_metrics.mutateResources([
                {
                    _resource: 'CampaignBudget',
                    resource_name: `customers/${test_utils_1.CID}/campaignBudgets/-1`,
                    name: test_utils_1.getRandomName('budget'),
                    amount_micros: 3000000,
                    explicitly_shared: true,
                },
                {
                    _resource: 'Campaign',
                    resource_name: `customers/${test_utils_1.CID}/campaigns/-2`,
                    campaign_budget: `customers/${test_utils_1.CID}/campaignBudgets/123`,
                    name: test_utils_1.getRandomName('campaign'),
                    advertising_channel_type: __1.enums.AdvertisingChannelType.SEARCH,
                    status: __1.enums.CampaignStatus.PAUSED,
                    manual_cpc: {
                        enhanced_cpc_enabled: true,
                    },
                },
                {
                    _resource: 'AdGroup',
                    resource_name: `customers/${test_utils_1.CID_WITH_METRICS}/adGroups/-3`,
                    campaign: `customers/${test_utils_1.CID_WITH_METRICS}/campaigns/-2`,
                    name: test_utils_1.getRandomName('adgroup'),
                    status: __1.enums.AdGroupStatus.PAUSED,
                },
            ], { partial_failure: true });
            /* The first resource should exist, and the other two should fail to be created */
            expect(response.results).toEqual([expect.any(String), '', '']);
            expect(response.partial_failure_error).toBeDefined();
            expect(response.partial_failure_error.message).toContain('Multiple errors');
        }));
        it('should support specifying the _operation type', () => __awaiter(this, void 0, void 0, function* () {
            const response = yield customer_no_metrics.mutateResources([
                {
                    _resource: 'CampaignBudget',
                    _operation: 'create',
                    resource_name: `customers/${test_utils_1.CID}/campaignBudgets/-1`,
                    name: test_utils_1.getRandomName('budget'),
                    amount_micros: 3000000,
                    explicitly_shared: true,
                },
                {
                    _resource: 'Campaign',
                    _operation: 'update',
                    resource_name: `customers/${test_utils_1.CID}/campaigns/${test_utils_1.CAMPAIGN_ID}`,
                    campaign_budget: `customers/${test_utils_1.CID}/campaignBudgets/${-1}`,
                },
            ], { validate_only: true });
            expect(response.results).toEqual([]);
        }));
        it('should support deleting resources', () => __awaiter(this, void 0, void 0, function* () {
            const campaigns = yield customer_no_metrics.campaigns.list({
                limit: 3,
                constraints: [
                    {
                        'campaign.status': __1.enums.CampaignStatus.ENABLED,
                    },
                ],
            });
            const campaign_resource_names = campaigns.map(({ campaign }) => campaign.resource_name);
            const operations = campaign_resource_names.map(resource_name => {
                return {
                    _resource: 'Campaign',
                    _operation: 'delete',
                    resource_name,
                };
            });
            const response = yield customer_no_metrics.mutateResources(operations, {
                validate_only: true,
            });
            expect(response.results).toEqual([]);
        }));
        it('should throw an error when missing a resource_name in delete mode', () => __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                yield customer.mutateResources([{ _resource: 'Campaign', _operation: 'delete', id: 123 }]);
            }
            catch (err) {
                expect(err.message).toContain('Must specify "resource_name"');
            }
        }));
        it('should throw an error if the _operation type is invalid', () => __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                yield customer.mutateResources([{ _resource: 'Campaign', _operation: 'slice' }]);
            }
            catch (err) {
                expect(err.message).toContain('must be one of');
            }
        }));
        it('should throw an error when the _resource key is missing', () => __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                yield customer.mutateResources([{ name: 'wasd' }]);
            }
            catch (err) {
                expect(err.message).toContain('Missing "_resource"');
            }
        }));
        it('should throw an error if the resource type is invalid', () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield customer.mutateResources([
                    {
                        _resource: 'CampaignFakeResource',
                        resource_name: `customers/${test_utils_1.CID_WITH_METRICS}/campaignBudgets/-1`,
                        name: test_utils_1.getRandomName('budget'),
                        amount_micros: 3000000,
                        explicitly_shared: true,
                    },
                ]);
            }
            catch (err) {
                expect(err.message).toContain('does not exist');
            }
        }));
    });
});
