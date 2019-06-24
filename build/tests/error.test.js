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
const customer = test_utils_1.newCustomer();
jest.setTimeout(30000);
describe('Error', () => __awaiter(this, void 0, void 0, function* () {
    it('throws an error when an entity is invalid', () => __awaiter(this, void 0, void 0, function* () {
        yield expect(customer.report({
            // @ts-ignore
            entity: 'campayne',
            attributes: ['campaign.id'],
        })).rejects.toThrow('is not a valid resource name');
    }));
    it('throws an error when an attribute is invalid', () => __awaiter(this, void 0, void 0, function* () {
        yield expect(customer.report({
            entity: 'campaign',
            // @ts-ignore
            attributes: ['wasd'],
        })).rejects.toThrow('Unrecognized field');
    }));
    it('throws an error when performing an invalid query', () => __awaiter(this, void 0, void 0, function* () {
        yield expect(customer.query(`SELECT campaign.id FROM campaign WHERE segments.date DURING LAST_13_DAYS`)).rejects.toThrow('Invalid date literal');
    }));
    it('throws an error with additional grpc metadata', () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield customer.query(`
                SELECT campaign.id 
                FROM campaign 
                WHERE segments.date DURING LAST_13_DAYS
            `);
        }
        catch (err) {
            expect(err.code.queryError).toEqual(index_1.enums.QueryError.INVALID_VALUE_WITH_DURING_OPERATOR); // INVALID_ARGUMENT
            expect(err.request).toEqual({
                customerId: expect.any(String),
                query: expect.any(String),
                pageToken: '',
                pageSize: 10000,
                validateOnly: false,
            });
            expect(typeof err.request_id).toBe('string');
        }
    }));
    it('includes an enum error code in the error body', () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield customer.query(`campaign.id FROM campaign`);
        }
        catch (err) {
            expect(err.code.queryError).toEqual(index_1.enums.QueryError.EXPECTED_SELECT);
        }
        try {
            yield customer.query(`SELECT campaign_feed.feed FROM ad_group_criterion`);
        }
        catch (err) {
            expect(err.code.queryError).toEqual(index_1.enums.QueryError.PROHIBITED_RESOURCE_TYPE_IN_SELECT_CLAUSE);
        }
    }));
}));
