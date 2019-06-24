"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bottleneck_1 = __importDefault(require("bottleneck"));
const crypto_1 = __importDefault(require("crypto"));
const lodash_1 = require("lodash");
const customer_1 = __importDefault(require("./customer"));
const grpc_1 = __importDefault(require("./grpc"));
const utils_1 = require("./utils");
class GoogleAdsApi {
    constructor(options) {
        this.options = options;
        const throttler_options = {
            minTime: 10,
            id: 'id' +
                crypto_1.default
                    .createHash('md5')
                    .update(this.options.developer_token)
                    .digest('hex'),
            /* Clustering options */
            datastore: this.options.redis_options ? 'redis' : 'local',
            clearDatastore: false,
            clientOptions: this.options.redis_options,
            timeout: 1000 * 60 * 10,
        };
        this.throttler = new bottleneck_1.default(throttler_options);
        this.throttler.on('error', err => {
            console.error('Could not connect to redis: ');
            console.error(err);
        });
    }
    Customer({ customer_account_id, refresh_token, login_customer_id, pre_report_hook, post_report_hook, }) {
        if (!customer_account_id || !refresh_token) {
            throw new Error('Must specify {customer_account_id, refresh_token}');
        }
        pre_report_hook = pre_report_hook || lodash_1.noop;
        post_report_hook = post_report_hook || lodash_1.noop;
        customer_account_id = utils_1.normaliseCustomerId(customer_account_id);
        login_customer_id = utils_1.normaliseCustomerId(login_customer_id);
        const client = new grpc_1.default(this.options.developer_token, this.options.client_id, this.options.client_secret, refresh_token, login_customer_id);
        return customer_1.default(customer_account_id, client, this.throttler, pre_report_hook, post_report_hook);
    }
}
exports.default = GoogleAdsApi;
