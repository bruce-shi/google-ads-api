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
const RESOURCE_URL_NAME = 'labels';
const MUTATE_METHOD = 'mutateLabels';
const MUTATE_REQUEST = 'MutateLabelsRequest';
const OPERATION_REQUEST = 'LabelOperation';
const GET_METHOD = 'getLabel';
const GET_REQUEST = 'GetLabelRequest';
const RESOURCE = 'Label';
class LabelService extends service_1.default {
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
            return this.getListResults('label', options);
        });
    }
    create(label, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.serviceCreate(Object.assign({ request: MUTATE_REQUEST, operation: OPERATION_REQUEST, mutate: MUTATE_METHOD, entity: [RESOURCE, label] }, options));
        });
    }
    update(label, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.serviceUpdate(Object.assign({ request: MUTATE_REQUEST, operation: OPERATION_REQUEST, mutate: MUTATE_METHOD, entity: [RESOURCE, label] }, options));
        });
    }
    delete(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.serviceDelete(Object.assign({ request: MUTATE_REQUEST, operation: OPERATION_REQUEST, mutate: MUTATE_METHOD, resource: `${RESOURCE_URL_NAME}/${id}`, entity_id: id }, options));
        });
    }
}
exports.default = LabelService;
