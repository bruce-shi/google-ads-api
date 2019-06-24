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
const lodash_1 = require("lodash");
const test_utils_1 = require("../test_utils");
const enums_1 = require("google-ads-node/build/lib/enums");
describe('Reporting', () => __awaiter(this, void 0, void 0, function* () {
    const customer = test_utils_1.newCustomerWithMetrics();
    it('retrieves API attributes', () => __awaiter(this, void 0, void 0, function* () {
        const data = yield customer.report({
            entity: 'ad_group',
            attributes: ['ad_group.id', 'ad_group.name', 'campaign.id'],
            order_by: 'ad_group.id',
            sort_order: 'DESC',
        });
        expect(data).toBeInstanceOf(Array);
        expect(data[0]).toEqual({
            campaign: {
                resource_name: expect.any(String),
                id: expect.any(Number),
            },
            ad_group: {
                resource_name: expect.any(String),
                id: expect.any(Number),
                name: expect.any(String),
            },
        });
    }));
    it('retrieves metrics', () => __awaiter(this, void 0, void 0, function* () {
        const data = yield customer.report({
            entity: 'ad_group',
            attributes: ['ad_group.id', 'campaign.id'],
            metrics: ['metrics.clicks', 'metrics.conversions', 'metrics.cost_micros'],
            order_by: 'id',
        });
        expect(data).toBeInstanceOf(Array);
        expect(data[0]).toEqual({
            campaign: {
                resource_name: expect.any(String),
                id: expect.any(Number),
            },
            ad_group: {
                resource_name: expect.any(String),
                id: expect.any(Number),
            },
            metrics: {
                clicks: expect.any(Number),
                conversions: expect.any(Number),
                cost_micros: expect.any(Number),
            },
        });
    }));
    it('retrieves segments', () => __awaiter(this, void 0, void 0, function* () {
        const data = yield customer.report({
            entity: 'ad_group',
            attributes: ['ad_group.id', 'campaign.id'],
            segments: ['segments.device'],
            limit: 10,
        });
        expect(data[0]).toEqual({
            campaign: {
                resource_name: expect.any(String),
                id: expect.any(Number),
            },
            ad_group: {
                resource_name: expect.any(String),
                id: expect.any(Number),
            },
            segments: {
                device: expect.any(Number),
            },
        });
        expect(data.length).toBeLessThanOrEqual(10);
    }));
    it('supports date constants', () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(12);
        const data = yield customer.report({
            entity: 'ad_group',
            attributes: ['ad_group.id'],
            segments: ['segments.date'],
            date_constant: 'TODAY',
            limit: 10,
        });
        const expected_date = new Date().toJSON().slice(0, 10);
        expect(data).toBeInstanceOf(Array);
        expect(data[0]).toEqual({
            ad_group: {
                resource_name: expect.any(String),
                id: expect.any(Number),
            },
            segments: {
                date: expect.any(String),
            },
        });
        for (const row of data) {
            expect(row.segments.date).toEqual(expected_date);
        }
    }));
    it('supports custom date ranges', () => __awaiter(this, void 0, void 0, function* () {
        const data = yield customer.report({
            entity: 'ad_group',
            attributes: ['ad_group.id'],
            segments: ['segments.date'],
            from_date: '2019-01-01',
            to_date: '2019-01-10',
        });
        expect(data).toBeInstanceOf(Array);
        const ordered_dates = lodash_1.orderBy(data, r => r.segments.date);
        expect(ordered_dates[0].segments.date).toEqual('2019-01-01');
        expect(ordered_dates[ordered_dates.length - 1].segments.date).toEqual('2019-01-10');
    }));
    it('supports constraints as an array of strings', () => __awaiter(this, void 0, void 0, function* () {
        const data = yield customer.report({
            entity: 'ad_group',
            attributes: ['ad_group.id', 'ad_group.status'],
            constraints: ['ad_group.status = ENABLED'],
            limit: 2,
        });
        expect(data).toBeInstanceOf(Array);
        expect(data[0]).toEqual({
            ad_group: {
                resource_name: expect.any(String),
                id: expect.any(Number),
                status: 2,
            },
        });
        expect(data[1].ad_group.status).toEqual(enums_1.AdGroupStatus.ENABLED);
    }));
    it('supports constraints as an array of shorthands', () => __awaiter(this, void 0, void 0, function* () {
        const data = yield customer.report({
            entity: 'ad_group',
            attributes: ['ad_group.id', 'ad_group.status'],
            constraints: [{ 'ad_group.status': 'ENABLED' }],
            limit: 2,
        });
        expect(data).toBeInstanceOf(Array);
        expect(data[0]).toEqual({
            ad_group: {
                resource_name: expect.any(String),
                id: expect.any(Number),
                status: enums_1.AdGroupStatus.ENABLED,
            },
        });
        expect(data[1]).toEqual({
            ad_group: {
                resource_name: expect.any(String),
                id: expect.any(Number),
                status: enums_1.AdGroupStatus.ENABLED,
            },
        });
    }));
    it('supports constraints as an array of objects', () => __awaiter(this, void 0, void 0, function* () {
        const data = yield customer.report({
            entity: 'ad_group',
            attributes: ['ad_group.id', 'ad_group.status'],
            constraints: [
                {
                    key: 'ad_group.status',
                    op: '=',
                    val: 'ENABLED',
                },
            ],
            limit: 2,
        });
        expect(data).toBeInstanceOf(Array);
        expect(data[0]).toEqual({
            ad_group: {
                resource_name: expect.any(String),
                id: expect.any(Number),
                status: enums_1.AdGroupStatus.ENABLED,
            },
        });
        expect(data[1]).toEqual({
            ad_group: {
                resource_name: expect.any(String),
                id: expect.any(Number),
                status: enums_1.AdGroupStatus.ENABLED,
            },
        });
    }));
    it('supports using enums as constraints', () => __awaiter(this, void 0, void 0, function* () {
        const rows = yield customer.report({
            entity: 'ad_group_ad',
            attributes: ['ad_group.id', 'ad_group.status'],
            constraints: [
                { 'ad_group.status': enums_1.AdGroupStatus.ENABLED },
                { 'ad_group_ad.ad.type': [enums_1.AdType.TEXT_AD, enums_1.AdType.EXPANDED_TEXT_AD] },
            ],
            limit: 1,
        });
        expect(rows[0].ad_group.status).toEqual(enums_1.AdGroupStatus.ENABLED);
    }));
    it("retrieves no rows for entities that don't exist", () => __awaiter(this, void 0, void 0, function* () {
        const row = yield customer.report({
            entity: 'campaign',
            attributes: ['campaign.id'],
            constraints: [{ 'campaign.id': '0123456789' }],
        });
        expect(row.length).toEqual(0);
    }));
}));
describe('Reporting (zero metric rows)', () => __awaiter(this, void 0, void 0, function* () {
    const customer = test_utils_1.newCustomer();
    it('retrieves no rows because all metrics are zero', () => __awaiter(this, void 0, void 0, function* () {
        const data = yield customer.report({
            entity: 'ad_group',
            attributes: ['ad_group.id', 'campaign.id'],
            segments: ['segments.device'],
            limit: 10,
        });
        expect(data).toEqual([]);
        expect(data.length).toEqual(0);
    }));
}));
