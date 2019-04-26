import { AdGroup, Customer } from 'google-ads-node/build/lib/resources'
import { AdGroupStatus, CampaignStatus } from 'google-ads-node/build/lib/enums'
import { enums } from '..'

import { newCustomerWithMetrics, newCustomer, CID, CID_WITH_METRICS, getRandomName, CAMPAIGN_ID } from '../test_utils'
const customer = newCustomerWithMetrics()
const customer_no_metrics = newCustomer()

describe('customer', () => {
    describe('report', () => {
        it('retrieves data for a specified entity (with metrics + constraints)', async () => {
            const ad_group = await customer.report({
                entity: 'ad_group',
                attributes: ['ad_group.id', 'ad_group.name', 'ad_group.campaign', 'ad_group.status'],
                metrics: ['metrics.cost_micros'],
                constraints: [
                    {
                        'ad_group.status': AdGroupStatus.ENABLED,
                    },
                ],
                limit: 5,
            })

            expect(ad_group).toBeInstanceOf(Array)
            expect(ad_group.length).toEqual(5)

            const a = ad_group[0].ad_group as AdGroup
            expect(a).toEqual(
                expect.objectContaining({
                    resource_name: expect.stringContaining(`customers/${CID_WITH_METRICS}/adGroups/`),
                    id: expect.any(Number),
                    name: expect.any(String),
                    campaign: expect.stringContaining(`customers/${CID_WITH_METRICS}/campaigns/`),
                    status: AdGroupStatus.ENABLED,
                })
            )

            expect(ad_group[0].metrics).toEqual(
                expect.objectContaining({
                    cost_micros: expect.any(Number),
                })
            )
        })

        it('retrieves data when using segments', async () => {
            const ad_group = await customer.report({
                entity: 'ad_group',
                attributes: ['ad_group.id', 'campaign.id'],
                segments: ['segments.device'],
                limit: 3,
            })

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
            })
        })

        it('supports using date constants', async () => {
            const [ad_group] = await customer.report({
                entity: 'ad_group',
                attributes: ['ad_group.id'],
                segments: ['segments.date'],
                date_constant: 'TODAY',
                limit: 1,
            })
            const expected_date = new Date().toJSON().slice(0, 10)
            expect(ad_group.segments.date).toEqual(expected_date)
        })

        it('supports custom date ranges', async () => {
            const ad_groups = await customer.report({
                entity: 'ad_group',
                attributes: ['ad_group.id'],
                segments: ['segments.date'],
                from_date: '2019-01-01',
                to_date: '2019-01-10',
                order_by: 'segments.date',
                sort_order: 'ASC',
            })
            expect(ad_groups[0].segments.date).toEqual('2019-01-01')
            expect(ad_groups[ad_groups.length - 1].segments.date).toEqual('2019-01-10')
        })

        it("retrieves no rows for entities that don't exist", async () => {
            const rows = await customer.report({
                entity: 'campaign',
                attributes: ['campaign.id'],
                constraints: [{ 'campaign.id': '0123456789' }],
            })
            expect(rows).toEqual([])
            expect(rows.length).toEqual(0)
        })

        it('retrieves no rows because all metrics are zero (when using segments)', async () => {
            const data = await customer_no_metrics.report({
                entity: 'ad_group',
                // @ts-ignore
                attributes: ['ad_group.id', 'campaign.id'],
                segments: ['segments.device'],
                limit: 10,
            })
            expect(data).toEqual([])
            expect(data.length).toEqual(0)
        })
    })

    describe('query', () => {
        it('can retrieve data via an awql string', async () => {
            const campaigns = await customer.query(`
                SELECT 
                    ad_group.id, 
                    ad_group.name,
                    campaign.id,
                    campaign.status
                FROM ad_group
                WHERE campaign.status = ENABLED
                LIMIT 5
            `)

            expect(campaigns.length).toEqual(5)
            expect(campaigns[0]).toEqual({
                ad_group: expect.objectContaining({
                    resource_name: expect.any(String),
                    id: expect.any(Number),
                    name: expect.any(String),
                }),
                campaign: expect.objectContaining({
                    resource_name: expect.any(String),
                    id: expect.any(Number),
                    status: CampaignStatus.ENABLED,
                }),
            })
        })
    })

    describe('list', () => {
        it('retrieves customers directly accessible by the user authenticating the call', async () => {
            const customers = await customer.list()
            expect(customers[0]).toEqual({
                customer: expect.objectContaining({
                    resource_name: expect.stringContaining(`customers/${CID_WITH_METRICS}`),
                    currency_code: expect.any(String),
                    time_zone: expect.any(String),
                }),
            })
        })
    })

    describe('get', () => {
        it('should retrieve a single customer via an id or resource name', async () => {
            const c = await customer.get(CID_WITH_METRICS)
            expect(c).toEqual(
                expect.objectContaining({
                    resource_name: `customers/${CID_WITH_METRICS}`,
                    id: expect.any(Number),
                    descriptive_name: expect.any(String),
                    currency_code: expect.any(String),
                })
            )
        })
    })

    describe('update', () => {
        it('should update specified fields of a customer', async done => {
            const c: Customer = {
                resource_name: `customers/${CID}`,
                descriptive_name: 'A new descriptive name',
            }
            await customer_no_metrics.update(c, {
                validate_only: true,
            })
            done()
        })
    })

    describe('mutate', () => {
        it('should be able to perform mutations with temporary resource ids', async () => {
            const response = await customer.globalCreate(
                [
                    {
                        _resource: 'CampaignBudget',
                        resource_name: `customers/${CID_WITH_METRICS}/campaignBudgets/-1`,
                        name: getRandomName('budget'),
                        amount_micros: 3000000,
                        explicitly_shared: true,
                    },
                    {
                        _resource: 'Campaign',
                        resource_name: `customers/${CID_WITH_METRICS}/campaigns/-2`,
                        campaign_budget: `customers/${CID_WITH_METRICS}/campaignBudgets/-1`,
                        name: getRandomName('campaign'),
                        advertising_channel_type: enums.AdvertisingChannelType.SEARCH,
                        status: enums.CampaignStatus.PAUSED,
                        manual_cpc: {
                            enhanced_cpc_enabled: true,
                        },
                    },
                    {
                        _resource: 'AdGroup',
                        resource_name: `customers/${CID_WITH_METRICS}/adGroups/-3`,
                        campaign: `customers/${CID_WITH_METRICS}/campaigns/-2`,
                        name: getRandomName('adgroup'),
                        status: enums.AdGroupStatus.PAUSED,
                    },
                    {
                        _resource: 'AdGroup',
                        resource_name: `customers/${CID_WITH_METRICS}/adGroups/-4`,
                        campaign: `customers/${CID_WITH_METRICS}/campaigns/-2`,
                        name: getRandomName('adgroup'),
                        status: enums.AdGroupStatus.PAUSED,
                    },
                ],
                {
                    validate_only: true,
                }
            )
            expect(response.results).toEqual([])
        })

        it('should be atomic by default', async () => {
            await expect(
                customer.globalCreate(
                    [
                        {
                            _resource: 'CampaignBudget',
                            resource_name: `customers/${CID_WITH_METRICS}/campaignBudgets/-1`,
                            name: getRandomName('budget'),
                            amount_micros: 3000000,
                            explicitly_shared: true,
                        },
                        {
                            _resource: 'Campaign',
                            resource_name: `customers/${CID_WITH_METRICS}/campaigns/-2`,
                            campaign_budget: `customers/${CID_WITH_METRICS}/campaignBudgets/123`,
                            name: getRandomName('campaign'),
                            advertising_channel_type: enums.AdvertisingChannelType.SEARCH,
                            status: enums.CampaignStatus.PAUSED,
                            manual_cpc: {
                                enhanced_cpc_enabled: true,
                            },
                        },
                    ],
                    { validate_only: true }
                )
            ).rejects.toThrow()
        })

        it('should support partial failures', async () => {
            const response = await customer_no_metrics.globalCreate(
                [
                    {
                        _resource: 'CampaignBudget',
                        resource_name: `customers/${CID}/campaignBudgets/-1`,
                        name: getRandomName('budget'),
                        amount_micros: 3000000,
                        explicitly_shared: true,
                    },
                    {
                        _resource: 'Campaign',
                        resource_name: `customers/${CID}/campaigns/-2`,
                        campaign_budget: `customers/${CID}/campaignBudgets/123`,
                        name: getRandomName('campaign'),
                        advertising_channel_type: enums.AdvertisingChannelType.SEARCH,
                        status: enums.CampaignStatus.PAUSED,
                        manual_cpc: {
                            enhanced_cpc_enabled: true,
                        },
                    },
                    {
                        _resource: 'AdGroup',
                        resource_name: `customers/${CID_WITH_METRICS}/adGroups/-3`,
                        campaign: `customers/${CID_WITH_METRICS}/campaigns/-2`,
                        name: getRandomName('adgroup'),
                        status: enums.AdGroupStatus.PAUSED,
                    },
                ],
                { partial_failure: true }
            )
            /* The first resource should exist, and the other two should fail to be created */
            expect(response.results).toEqual([expect.any(String), '', ''])
            expect(response.partial_failure_error).toBeDefined()
            expect(response.partial_failure_error.message).toContain('Multiple errors')
        })

        it('should support specifying the _operation type', async () => {
            const response = await customer_no_metrics.globalCreate(
                [
                    {
                        _resource: 'CampaignBudget',
                        _operation: 'create',
                        resource_name: `customers/${CID}/campaignBudgets/-1`,
                        name: getRandomName('budget'),
                        amount_micros: 3000000,
                        explicitly_shared: true,
                    },
                    {
                        _resource: 'Campaign',
                        _operation: 'update',
                        resource_name: `customers/${CID}/campaigns/${CAMPAIGN_ID}`,
                        campaign_budget: `customers/${CID}/campaignBudgets/${-1}`,
                    },
                ],
                { validate_only: true }
            )
            expect(response.results).toEqual([])
        })

        it('should throw an error if the _operation type is invalid', async () => {
            try {
                await customer.globalCreate([{ _resource: 'Campaign', _operation: 'slice' }])
            } catch (err) {
                expect(err.message).toContain('must be one of')
            }
        })

        it('should throw an error when the _resource key is missing', async () => {
            try {
                await customer.globalCreate([{ name: 'wasd' }])
            } catch (err) {
                expect(err.message).toContain('Missing "_resource"')
            }
        })

        it('should throw an error if the resource type is invalid', async () => {
            try {
                await customer.globalCreate([
                    {
                        _resource: 'CampaignFakeResource',
                        resource_name: `customers/${CID_WITH_METRICS}/campaignBudgets/-1`,
                        name: getRandomName('budget'),
                        amount_micros: 3000000,
                        explicitly_shared: true,
                    },
                ])
            } catch (err) {
                expect(err.message).toContain('does not exist')
            }
        })
    })
})
