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
describe('AccountBudgetProposal', () => __awaiter(this, void 0, void 0, function* () {
    describe('reporting', () => __awaiter(this, void 0, void 0, function* () {
        it('can retrieve a list of AccountBudgetProposals with all fields (if valid)', () => __awaiter(this, void 0, void 0, function* () {
            const account_budget_proposals = yield customer.accountBudgetProposals.list();
            expect(account_budget_proposals).toBeInstanceOf(Array);
            // @ts-ignore Ignore missing proto definitions for now
            if (account_budget_proposals.length > 0 && account_budget_proposals[0].account_budget_proposal.resource_name) {
                expect(account_budget_proposals[0].account_budget_proposal).toEqual(expect.objectContaining({
                    resource_name: expect.stringContaining(`customers/${test_utils_1.CID}/accountBudgetProposals`) || '',
                }));
                // @ts-ignore Ignore missing proto definitions for now
                const resource = account_budget_proposals[0].account_budget_proposal.resource_name;
                if (resource) {
                    const singleton = yield customer.accountBudgetProposals.get(resource);
                    expect(singleton).toBeInstanceOf(Object);
                    expect(singleton).toEqual(expect.objectContaining({
                        resource_name: expect.stringContaining(`customers/${test_utils_1.CID}/accountBudgetProposals`) || '',
                    }));
                }
            }
        }));
        it('throws an error when the request is invalid', () => __awaiter(this, void 0, void 0, function* () {
            yield expect(customer.accountBudgetProposals.list({
                limit: -10,
                constraints: ['FakeConstraint=INVALID'],
            })).rejects.toThrow('Unrecognized field');
        }));
    }));
}));
