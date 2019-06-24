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
const test_utils_1 = require("../test_utils");
// import { newMccCustomer, newCustomer, CID_WITH_METRICS, CUSTOMER_CLIENT_LINK } from '../test_utils'
const customer = test_utils_1.newCustomer();
// const mcc_customer = newMccCustomer()
describe('AdGroupCriterion', () => __awaiter(this, void 0, void 0, function* () {
    describe('mutation', () => {
        // it('can update a client customer link', async () => {
        //     const link: CustomerClientLink = {
        //         resource_name: CUSTOMER_CLIENT_LINK,
        //         hidden: false,
        //     }
        //     const result = await mcc_customer.customerClientLinks.update(link)
        //     expect(result.results).toEqual(expect.arrayContaining([expect.stringContaining(CUSTOMER_CLIENT_LINK)]))
        // })
        it('can (almost) create a new client customer link', () => __awaiter(this, void 0, void 0, function* () {
            const link = {
                client_customer: `customers/${test_utils_1.CID_WITH_METRICS}`,
                status: enums_1.ManagerLinkStatus.PENDING,
            };
            // TODO: test this in a repeatable, successful way.
            yield expect(customer.customerClientLinks.create(link)).rejects.toThrow(`Authorization of the client failed.`);
        }));
        it('fails when using multiple operations on create()', () => __awaiter(this, void 0, void 0, function* () {
            const link = {
                client_customer: 'customers/77777777777',
                status: enums_1.ManagerLinkStatus.PENDING,
            };
            yield expect(customer.customerClientLinks.create([link, link], {
                validate_only: true,
            })).rejects.toThrow();
        }));
    });
}));
