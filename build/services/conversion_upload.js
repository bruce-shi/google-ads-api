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
class ConversionAdjustmentUploadService extends service_1.default {
    uploadCallConversion(conversion) {
        return __awaiter(this, void 0, void 0, function* () {
            const pb = this.buildResource('UploadCallConversionsRequest', conversion);
            const response = yield this.service.uploadConversionAdjustments(pb);
            const parsed = this.parseServiceResults(response);
            return parsed;
        });
    }
    uploadClickConversion(conversion) {
        return __awaiter(this, void 0, void 0, function* () {
            const pb = this.buildResource('UploadClickConversionsRequest', conversion);
            const response = yield this.service.uploadConversionAdjustments(pb);
            const parsed = this.parseServiceResults(response);
            return parsed;
        });
    }
}
exports.default = ConversionAdjustmentUploadService;
