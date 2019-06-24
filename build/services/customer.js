"use strict";
// manual_mode: This file has been manually modified and should not be touched by generate_services.js
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = __importStar(require("google-ads-node"));
const utils_1 = require("google-ads-node/build/lib/utils");
const service_1 = __importDefault(require("./service"));
class CustomerService extends service_1.default {
    constructor(cid, client, throttler, name, pre_report_hook, post_report_hook) {
        super(cid, client, throttler, name);
        this.pre_report_hook = pre_report_hook;
        this.post_report_hook = post_report_hook;
    }
    report(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.serviceReport(options, this.pre_report_hook, this.post_report_hook);
            return results;
        });
    }
    query(qry) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.serviceQuery(qry);
            return results;
        });
    }
    // TODO: Potentially add this at some point
    // public async listAccessibleCustomers(): Promise<any> {
    //     const request = new grpc.ListAccessibleCustomersRequest()
    //     const response = await this.service.listAccessibleCustomers(request)
    //     console.log(response)
    // }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getListResults('customer');
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.serviceGet({
                request: 'GetCustomerRequest',
                resource: `customers/${id}`,
                method: 'getCustomer',
                entity_id: id,
            });
        });
    }
    update(customer, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new grpc.MutateCustomerRequest();
            const operation = new grpc.CustomerOperation();
            const pb = this.buildResource('Customer', customer);
            operation.setUpdate(pb);
            const mask = utils_1.getFieldMask(customer);
            operation.setUpdateMask(mask);
            request.setCustomerId(this.cid);
            request.setOperation(operation);
            if (options && options.hasOwnProperty('validate_only')) {
                request.setValidateOnly(options.validate_only);
            }
            yield this.service.mutateCustomer(request);
        });
    }
    // TODO: Add support for this service method
    // public async create(customer: Customer)
    mutateResources(operations, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new grpc.MutateGoogleAdsRequest();
            request.setCustomerId(this.cid);
            if (options && options.hasOwnProperty('validate_only')) {
                request.setValidateOnly(options.validate_only);
            }
            if (options && options.hasOwnProperty('partial_failure')) {
                request.setPartialFailure(options.partial_failure);
            }
            const ops = [];
            for (const operation of operations) {
                if (!operation.hasOwnProperty('_resource')) {
                    throw new Error(`Missing "_resource" key on entity`);
                }
                const operation_resource_name = operation._resource;
                let operation_mode = operation._operation;
                delete operation._resource;
                delete operation._operation;
                /* Create the resource e.g. "CampaignBudget" */
                const pb = this.buildResource(operation_resource_name, operation);
                /* Create create|update operation of resource type e.g. "CampaignBudgetOperation" */
                // @ts-ignore Types are no use here
                const resource_operation = new grpc[`${operation_resource_name}Operation`]();
                if (!operation_mode) {
                    operation_mode = 'create';
                }
                if (operation_mode !== 'create' && operation_mode !== 'update' && operation_mode !== 'delete') {
                    throw new Error(`"_operation" field must be one of "create"|"update"|"delete"`);
                }
                if (operation_mode === 'create') {
                    resource_operation.setCreate(pb);
                }
                if (operation_mode === 'update') {
                    resource_operation.setUpdate(pb);
                    const update_mask = utils_1.getFieldMask(operation);
                    resource_operation.setUpdateMask(update_mask);
                }
                if (operation_mode === 'delete') {
                    // @ts-ignore Types are no use here
                    if (!pb.toObject().hasOwnProperty('resourceName') || !pb.toObject().resourceName) {
                        throw new Error(`Must specify "resource_name" to remove when using "delete"`);
                    }
                    // @ts-ignore Types are no use here
                    resource_operation.setRemove(pb.toObject().resourceName);
                }
                /* Add operation of resource type to global mutate operation e.g. "MutateOperation.setCampaignBudgetOperation" */
                const op = new grpc.MutateOperation();
                const operation_set_method = `set${operation_resource_name}Operation`;
                // @ts-ignore Types are no use here
                op[operation_set_method](resource_operation);
                /* Push operation to MutateOperationsList */
                ops.push(op);
            }
            request.setMutateOperationsList(ops);
            const response = yield this.globalMutate(request);
            return response;
        });
    }
}
exports.default = CustomerService;
