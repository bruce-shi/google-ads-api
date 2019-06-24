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
const customer = test_utils_1.newCustomerWithMetrics();
jest.setTimeout(30000);
describe('Query Limits', () => __awaiter(this, void 0, void 0, function* () {
    it('limits correctly, default page_size', () => __awaiter(this, void 0, void 0, function* () {
        const data = yield customer.report({
            entity: 'keyword_view',
            attributes: ['ad_group_criterion.criterion_id'],
            segments: ['segments.date'],
            metrics: ['metrics.impressions'],
            date_constant: 'LAST_7_DAYS',
            limit: 10,
        });
        expect(data).toHaveLength(10);
    }));
    it('limits correctly, page_size = limit', () => __awaiter(this, void 0, void 0, function* () {
        const data = yield customer.report({
            entity: 'keyword_view',
            attributes: ['ad_group_criterion.criterion_id'],
            segments: ['segments.date'],
            metrics: ['metrics.impressions'],
            date_constant: 'LAST_7_DAYS',
            limit: 10,
            page_size: 10,
        });
        expect(data).toHaveLength(10);
    }));
    it('limits correctly, page_size > limit', () => __awaiter(this, void 0, void 0, function* () {
        const data = yield customer.report({
            entity: 'keyword_view',
            attributes: ['ad_group_criterion.criterion_id'],
            segments: ['segments.date'],
            metrics: ['metrics.impressions'],
            date_constant: 'LAST_7_DAYS',
            limit: 10,
            page_size: 22,
        });
        expect(data).toHaveLength(10);
    }));
    it('limits correctly, page_size < limit', () => __awaiter(this, void 0, void 0, function* () {
        const data = yield customer.report({
            entity: 'keyword_view',
            attributes: ['ad_group_criterion.criterion_id'],
            segments: ['segments.date'],
            metrics: ['metrics.impressions'],
            date_constant: 'LAST_7_DAYS',
            limit: 10,
            page_size: 3,
        });
        expect(data).toHaveLength(10);
    }));
    it('limits correctly, page_size is multiple of limit', () => __awaiter(this, void 0, void 0, function* () {
        const data = yield customer.report({
            entity: 'keyword_view',
            attributes: ['ad_group_criterion.criterion_id'],
            segments: ['segments.date'],
            metrics: ['metrics.impressions'],
            date_constant: 'LAST_7_DAYS',
            limit: 10,
            page_size: 5,
        });
        expect(data).toHaveLength(10);
    }));
    it('limits correctly, limit is multiple of page_size', () => __awaiter(this, void 0, void 0, function* () {
        const data = yield customer.report({
            entity: 'keyword_view',
            attributes: ['ad_group_criterion.criterion_id'],
            segments: ['segments.date'],
            metrics: ['metrics.impressions'],
            date_constant: 'LAST_7_DAYS',
            limit: 10,
            page_size: 20,
        });
        expect(data).toHaveLength(10);
    }));
    it('iterates correctly when no limit is set', () => __awaiter(this, void 0, void 0, function* () {
        const data = yield customer.report({
            entity: 'customer',
            attributes: ['customer.id'],
            segments: ['segments.date'],
            metrics: ['metrics.impressions'],
            date_constant: 'LAST_30_DAYS',
            page_size: 13,
        });
        expect(data).toHaveLength(30);
    }));
}));
