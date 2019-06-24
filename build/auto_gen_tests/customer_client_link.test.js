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
describe('CustomerClientLink', () => __awaiter(this, void 0, void 0, function* () {
    describe('reporting', () => __awaiter(this, void 0, void 0, function* () {
        it('can retrieve a list of CustomerClientLinks with all fields (if valid)', () => __awaiter(this, void 0, void 0, function* () {
            const customer_client_links = yield customer.customerClientLinks.list();
            expect(customer_client_links).toBeInstanceOf(Array);
            // @ts-ignore Ignore missing proto definitions for now
            if (customer_client_links.length > 0 && customer_client_links[0].customer_client_link.resource_name) {
                expect(customer_client_links[0].customer_client_link).toEqual(expect.objectContaining({
                    resource_name: expect.stringContaining(`customers/${test_utils_1.CID}/customerClientLinks`) || '',
                }));
                // @ts-ignore Ignore missing proto definitions for now
                const resource = customer_client_links[0].customer_client_link.resource_name;
                if (resource) {
                    const singleton = yield customer.customerClientLinks.get(resource);
                    expect(singleton).toBeInstanceOf(Object);
                    expect(singleton).toEqual(expect.objectContaining({
                        resource_name: expect.stringContaining(`customers/${test_utils_1.CID}/customerClientLinks`) || '',
                    }));
                }
            }
        }));
        it('throws an error when the request is invalid', () => __awaiter(this, void 0, void 0, function* () {
            yield expect(customer.customerClientLinks.list({
                limit: -10,
                constraints: ['FakeConstraint=INVALID'],
            })).rejects.toThrow('Unrecognized field');
        }));
    }));
}));
