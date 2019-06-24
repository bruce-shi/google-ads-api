"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const utils_1 = require("../utils");
test('getEnumString', () => {
    const status = index_1.getEnumString('CampaignStatus', index_1.enums.CampaignStatus.ENABLED);
    expect(status).toEqual('ENABLED');
    const type = index_1.getEnumString('AdvertisingChannelType', index_1.enums.AdvertisingChannelType.HOTEL);
    expect(type).toEqual('HOTEL');
    try {
        index_1.getEnumString('InvalidEnumName', 2);
    }
    catch (err) {
        expect(err.message).toContain('Could not find');
    }
    try {
        index_1.getEnumString('CampaignStatus', 66);
    }
    catch (err) {
        expect(err.message).toContain('Could not find value');
    }
});
describe('translateEnumValue', () => {
    it("should tranlate an enum value to it's key (string) value", () => {
        const inputs = [
            ['ad_group.status', index_1.enums.AdGroupStatus.PAUSED],
            ['campaign.status', index_1.enums.CampaignStatus.ENABLED],
            ['campaign.advertising_channel_type', index_1.enums.AdvertisingChannelType.SHOPPING],
        ];
        const outputs = inputs.map(([name, value]) => utils_1.translateEnumValue(name, value));
        expect(outputs).toEqual(['PAUSED', 'ENABLED', 'SHOPPING']);
    });
});
describe('snakeCaseGads', () => {
    it('should apply snakecase in the google way', () => {
        expect(utils_1.snakeCaseGads('headlinePart1')).toEqual('headline_part1');
        expect(utils_1.snakeCaseGads('adGroupAd')).toEqual('ad_group_ad');
    });
});
describe('addQuotesIfMissing', () => {
    it('should add quotes only when quotes are missing', () => {
        expect(utils_1.addQuotesIfMissing(true)).toEqual(`"true"`);
        expect(utils_1.addQuotesIfMissing('true')).toEqual(`"true"`);
        expect(utils_1.addQuotesIfMissing(`"true"`)).toEqual(`"true"`);
        expect(utils_1.addQuotesIfMissing('customer/133/campaign/456')).toEqual(`"customer/133/campaign/456"`);
        expect(utils_1.addQuotesIfMissing(`'customer/133/campaign/456'`)).toEqual(`'customer/133/campaign/456'`);
        expect(utils_1.addQuotesIfMissing(123)).toEqual(`"123"`);
        expect(utils_1.addQuotesIfMissing(`123`)).toEqual(`"123"`);
        expect(utils_1.addQuotesIfMissing(`"123"`)).toEqual(`"123"`);
    });
});
describe('verifyConstraintType', () => {
    it('should throw if a constraint value is not of a supported type', () => {
        expect(() => utils_1.verifyConstraintType('key', undefined)).toThrow();
        expect(() => utils_1.verifyConstraintType('key', null)).toThrow();
        expect(() => utils_1.verifyConstraintType('key', { hello: 'yes' })).toThrow();
        expect(() => utils_1.verifyConstraintType('key', [1, 'yes'])).toThrow();
    });
    it('should not throw if a constraint value is of a supported type', () => {
        expect(() => utils_1.verifyConstraintType('key', true)).not.toThrow();
        expect(() => utils_1.verifyConstraintType('key', 'hello')).not.toThrow();
        expect(() => utils_1.verifyConstraintType('key', 123.66)).not.toThrow();
    });
});
describe('buildReportQuery', () => {
    it('should translate enums in constraints to their key (string) value', () => {
        const options = {
            entity: 'ad_group',
            attributes: ['ad_group.name', 'campaign.name'],
            constraints: [
                { key: 'ad_group.status', op: '=', val: index_1.enums.AdGroupStatus.PAUSED },
                {
                    'campaign.advertising_channel_type': index_1.enums.AdvertisingChannelType.SEARCH,
                },
                {
                    key: 'metrics.clicks',
                    op: '>',
                    val: 10,
                },
                {
                    'campaign_budget.status': index_1.enums.BudgetStatus.ENABLED,
                },
            ],
        };
        const query = utils_1.buildReportQuery(options);
        expect(query).toEqual(`SELECT ad_group.name, campaign.name FROM ad_group WHERE ad_group.status = "PAUSED" AND campaign.advertising_channel_type = "SEARCH" AND campaign_budget.status = "ENABLED" AND metrics.clicks > "10"`);
    });
    it('should support constraints as objects', () => {
        const options = {
            entity: 'ad_group',
            attributes: ['ad_group.name'],
            constraints: {
                'ad_group.name': 'My AdGroup',
                'ad_group.status': index_1.enums.AdGroupStatus.PAUSED,
                'metrics.clicks': 0,
                'campaign.id': [123, 456],
            },
        };
        const query = utils_1.buildReportQuery(options);
        expect(query).toEqual(`SELECT ad_group.name FROM ad_group WHERE ad_group.name = "My AdGroup" AND ad_group.status = "PAUSED" AND campaign.id IN ("123","456") AND metrics.clicks = "0"`);
    });
    it(`should throw an error if "val" is undefined`, () => {
        const id = undefined;
        const options = {
            entity: 'campaign',
            attributes: ['campaign.id'],
            constraints: [{ key: 'campaign.id', op: '=', val: id }],
        };
        try {
            utils_1.buildReportQuery(options);
        }
        catch (err) {
            expect(err.message).toContain('cannot be undefined');
        }
    });
    it('should throw an error when incorrectly using key, op, val constraint fields', () => {
        const options = {
            entity: 'campaign',
            attributes: ['campaign.id'],
            constraints: [{ key: 'campaign.id', val: 2 }],
        };
        try {
            utils_1.buildReportQuery(options);
        }
        catch (err) {
            expect(err.message).toContain('must specify { key, op, val }');
        }
    });
});
