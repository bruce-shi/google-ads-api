"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = __importDefault(require("./service"));
/**
 * @constants
 */
const RESOURCE_URL_NAME = 'feedItems';
const MUTATE_METHOD = 'mutateFeedItems';
const MUTATE_REQUEST = 'MutateFeedItemsRequest';
const OPERATION_REQUEST = 'FeedItemOperation';
const GET_METHOD = 'getFeedItem';
const GET_REQUEST = 'GetFeedItemRequest';
const RESOURCE = 'FeedItem';
class FeedItemService extends service_1.default {
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.serviceGet({
                request: GET_REQUEST,
                resource: `${RESOURCE_URL_NAME}/${id}`,
                method: GET_METHOD,
                entity_id: id,
            });
        });
    }
    list(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getListResults('feed_item', options);
        });
    }
    create(feed_item, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.serviceCreate(Object.assign({ request: MUTATE_REQUEST, operation: OPERATION_REQUEST, mutate: MUTATE_METHOD, entity: [RESOURCE, feed_item] }, options));
        });
    }
    update(feed_item, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.serviceUpdate(Object.assign({ request: MUTATE_REQUEST, operation: OPERATION_REQUEST, mutate: MUTATE_METHOD, entity: [RESOURCE, feed_item] }, options));
        });
    }
    delete(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.serviceDelete(Object.assign({ request: MUTATE_REQUEST, operation: OPERATION_REQUEST, mutate: MUTATE_METHOD, resource: `${RESOURCE_URL_NAME}/${id}`, entity_id: id }, options));
        });
    }
}
exports.default = FeedItemService;
