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
describe('CampaignBudget', () => __awaiter(this, void 0, void 0, function* () {
    describe('reporting', () => __awaiter(this, void 0, void 0, function* () {
        it('can retrieve a list of CampaignBudgets with all fields (if valid)', () => __awaiter(this, void 0, void 0, function* () {
            const campaign_budgets = yield customer.campaignBudgets.list();
            expect(campaign_budgets).toBeInstanceOf(Array);
            if (campaign_budgets.length > 0 && campaign_budgets[0].campaign_budget.resource_name) {
                expect(campaign_budgets[0].campaign_budget).toEqual(expect.objectContaining({
                    resource_name: expect.stringContaining(`customers/${test_utils_1.CID}/campaignBudgets`) || '',
                }));
                const resource = campaign_budgets[0].campaign_budget.resource_name;
                if (resource) {
                    const singleton = yield customer.campaignBudgets.get(resource);
                    expect(singleton).toBeInstanceOf(Object);
                    expect(singleton).toEqual(expect.objectContaining({
                        resource_name: expect.stringContaining(`customers/${test_utils_1.CID}/campaignBudgets`) || '',
                    }));
                }
            }
        }));
        it('throws an error when the request is invalid', () => __awaiter(this, void 0, void 0, function* () {
            yield expect(customer.campaignBudgets.list({
                limit: -10,
                constraints: ['FakeConstraint=INVALID'],
            })).rejects.toThrow('Unrecognized field');
        }));
    }));
    describe('mutation', () => {
        let new_budget_resource_name = '';
        it('can create a new budget', () => __awaiter(this, void 0, void 0, function* () {
            const budget = {
                name: test_utils_1.getRandomName('budget'),
                amount_micros: 30000000,
                explicitly_shared: true,
            };
            const { results } = yield customer.campaignBudgets.create(budget);
            new_budget_resource_name = results[0];
            expect(results[0]).toContain(`customers/${test_utils_1.CID}/campaignBudgets/`);
        }));
        it('supports multiple operations when using create', () => __awaiter(this, void 0, void 0, function* () {
            const { results } = yield customer.campaignBudgets.create([
                {
                    name: test_utils_1.getRandomName('budget-1'),
                    amount_micros: 30000000,
                },
                {
                    name: test_utils_1.getRandomName('budget-2'),
                    amount_micros: 30000000,
                },
            ], {
                validate_only: true,
            });
            /* Result is empty because we're using validate only */
            expect(results).toEqual([]);
        }));
        it('supports multiple operations when using update', () => __awaiter(this, void 0, void 0, function* () {
            const { results } = yield customer.campaignBudgets.create([
                {
                    name: test_utils_1.getRandomName('budget-1'),
                    amount_micros: 30000000,
                },
                {
                    name: test_utils_1.getRandomName('budget-2'),
                    amount_micros: 30000000,
                },
            ], {
                validate_only: true,
            });
            /* Result is empty because we're using validate only */
            expect(results).toEqual([]);
        }));
        it('supports partial failures for multiple operations', () => __awaiter(this, void 0, void 0, function* () {
            const response = yield customer.campaignBudgets.create([
                {
                    name: test_utils_1.getRandomName('budget-1'),
                    amount_micros: 30000000,
                },
                {
                    name: test_utils_1.getRandomName('budget-2'),
                    amount_micros: -1,
                },
            ], {
                partial_failure: true,
                validate_only: true,
            });
            expect(response.partial_failure_error).toBeDefined();
            expect(response.results).toEqual([]);
        }));
        it('can update a budget', () => __awaiter(this, void 0, void 0, function* () {
            const updated_budget = {
                resource_name: new_budget_resource_name,
                amount_micros: 20000000,
            };
            const { results } = yield customer.campaignBudgets.update(updated_budget);
            const updated_budget_resource = results[0];
            expect(updated_budget_resource).toEqual(new_budget_resource_name);
        }));
        it('can delete a budget', (done) => __awaiter(this, void 0, void 0, function* () {
            yield customer.campaignBudgets.delete(new_budget_resource_name);
            done();
        }));
    });
}));
