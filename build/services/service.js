"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = __importStar(require("google-ads-node"));
const fields = __importStar(require("google-ads-node/build/lib/fields"));
const utils_1 = require("google-ads-node/build/lib/utils");
const utils_2 = require("../utils");
const error_1 = require("../error");
class Service {
    constructor(cid, client, throttler, name) {
        this.cid = cid;
        this.client = client;
        this.throttler = throttler;
        // This is the child specific service, e.g. "CampaignService"
        this.service = client.getService(name);
    }
    serviceGet(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new grpc[options.request]();
            const id_is_resource_name = typeof options.entity_id === 'string' &&
                (options.entity_id.startsWith('customers/') || options.entity_id.toLowerCase().includes('constant'));
            if (id_is_resource_name) {
                request.setResourceName(options.entity_id);
            }
            else {
                request.setResourceName(this.buildResourceName(options.resource));
            }
            return this.serviceCall(options.method, request);
        });
    }
    serviceUpdate(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new grpc[options.request]();
            const operationType = grpc[options.operation];
            const operations = [];
            // If the user passed in only one entity, convert it to an array of length 1
            if (!Array.isArray(options.entity[1])) {
                options.entity[1] = [options.entity[1]];
            }
            for (const entity of options.entity[1]) {
                const operation = new operationType();
                const pb = this.buildResource(options.entity[0], entity);
                operation.setUpdate(pb);
                const mask = utils_1.getFieldMask(entity);
                operation.setUpdateMask(mask);
                operations.push(operation);
            }
            return this.mutate(request, operations, options);
        });
    }
    serviceDelete(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new grpc[options.request]();
            const operation = new grpc[options.operation]();
            if (typeof options.entity_id === 'string' && options.entity_id.startsWith('customers/')) {
                operation.setRemove(options.entity_id);
            }
            else {
                operation.setRemove(this.buildResourceName(options.resource));
            }
            return this.mutate(request, [operation], options);
        });
    }
    serviceCreate(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new grpc[options.request]();
            const operationType = grpc[options.operation];
            const operations = [];
            // If the user passed in only one entity, convert it to an array of length 1
            if (!Array.isArray(options.entity[1])) {
                options.entity[1] = [options.entity[1]];
            }
            for (const entity of options.entity[1]) {
                const operation = new operationType();
                const pb = this.buildResource(options.entity[0], entity);
                operation.setCreate(pb);
                operations.push(operation);
            }
            return this.mutate(request, operations, options);
        });
    }
    mutate(request, operations, options) {
        return __awaiter(this, void 0, void 0, function* () {
            request.setCustomerId(this.cid);
            if (!request.setOperationsList) {
                if (operations.length > 1) {
                    throw new Error(`This method only accepts one operation, but ${operations.length} were passed in.`);
                }
                request.setOperation(operations[0]);
            }
            else {
                request.setOperationsList(operations);
            }
            if (options.hasOwnProperty('validate_only')) {
                if (!request.setValidateOnly) {
                    throw new Error(`This method does not support the validate_only option.`);
                }
                request.setValidateOnly(options.validate_only);
            }
            if (options.hasOwnProperty('partial_failure')) {
                if (!request.setPartialFailure) {
                    throw new Error(`This method does not support the partial_failure option.`);
                }
                request.setPartialFailure(options.partial_failure);
            }
            const response = yield this.serviceCall(options.mutate, request);
            const is_single_result = response.hasOwnProperty(`result`);
            return {
                request: request.toObject(),
                partial_failure_error: response.partial_failure_error,
                // Always return results as an array for consistency
                results: is_single_result
                    ? [response.result.resource_name]
                    : response.results_list.map((r) => r.resourceName),
            };
        });
    }
    globalMutate(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const service = this.client.getService('GoogleAdsService');
            try {
                const response = yield service.mutate(request);
                const parsed_results = this.parseServiceResults([response])[0];
                return {
                    request: request.toObject(),
                    partial_failure_error: parsed_results.partial_failure_error,
                    results: parsed_results.mutate_operation_responses.map((r) => {
                        // @ts-ignore Object.values not recognised
                        const { resource_name } = Object.values(r)[0];
                        return resource_name;
                    }),
                };
            }
            catch (err) {
                throw new error_1.GrpcError(err, request);
            }
        });
    }
    buildResourceName(resource) {
        if (resource.startsWith('customers/')) {
            return resource;
        }
        return `customers/${this.cid}/${resource}`;
    }
    serviceCall(call, request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.service[call](request);
                const parsed_results = this.parseServiceResults([response]);
                /*
                    Since get returns an object, we always return the first item.
                    This should only ever be one item here, and it should exist.
                */
                return parsed_results[0];
            }
            catch (err) {
                throw new error_1.GrpcError(err, request);
            }
        });
    }
    getListResults(resource, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.buildListQuery(resource, options);
            const results = yield this.getSearchData(query);
            return this.parseServiceResults(results);
        });
    }
    buildResource(resource, data) {
        const pb = this.client.buildResource(resource, data);
        return pb;
    }
    /* Base report method used in global customer instance */
    serviceReport(options, pre_report_hook, post_report_hook) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.buildCustomerReportQuery(options);
            const hook_result = yield pre_report_hook({
                cid: this.cid,
                query,
            });
            if (hook_result) {
                return hook_result;
            }
            const results = yield this.getSearchData(query, options.page_size);
            const parsed_results = this.parseServiceResults(results);
            yield post_report_hook({
                cid: this.cid,
                query,
                result: parsed_results,
                report_config: options,
            });
            return parsed_results;
        });
    }
    /* Base query method used in global customer instance */
    serviceQuery(qry) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.getSearchData(qry);
            return this.parseServiceResults(results);
        });
    }
    parseServiceResults(results) {
        const formatted = utils_2.formatQueryResults(results);
        return utils_2.parseResult(formatted);
    }
    getSearchData(query, page_size = 10000) {
        return __awaiter(this, void 0, void 0, function* () {
            const { request, limit } = this.client.buildSearchRequest(this.cid, query, page_size);
            try {
                if (limit && page_size && page_size >= limit) {
                    const response = yield this.client.searchWithRetry(this.throttler, request);
                    if (response && response.hasOwnProperty('resultsList')) {
                        return response.resultsList;
                    }
                    return [];
                }
                const response = yield this.client.searchIterator(this.throttler, request, limit);
                return response;
            }
            catch (err) {
                throw new error_1.GrpcError(err, request);
            }
        });
    }
    buildListQuery(resource, options) {
        if (!fields.hasOwnProperty(resource)) {
            throw new Error(`Resource "${resource}" not found in google-ads-node compiled resources (fields.ts).`);
        }
        const resource_fields = fields[resource];
        const config = {
            attributes: resource_fields,
            constraints: options && options.constraints ? options.constraints : [],
            limit: options && options.limit ? options.limit : undefined,
            entity: resource,
        };
        const query = utils_2.buildReportQuery(config);
        return query;
    }
    buildCustomerReportQuery(options) {
        const query = utils_2.buildReportQuery(options);
        return query;
    }
}
exports.default = Service;
