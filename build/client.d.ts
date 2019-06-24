import { CustomerInstance } from './customer';
import { PreReportHook, PostReportHook } from './types';
interface ClientOptions {
    readonly client_id: string;
    readonly client_secret: string;
    readonly developer_token: string;
    readonly redis_options?: any;
}
interface CustomerAuth {
    customer_account_id?: string;
    refresh_token?: string;
    login_customer_id?: string;
}
interface CustomerOptions extends CustomerAuth {
    pre_report_hook?: PreReportHook;
    post_report_hook?: PostReportHook;
}
export default class GoogleAdsApi {
    private readonly options;
    private throttler;
    constructor(options: ClientOptions);
    Customer({ customer_account_id, refresh_token, login_customer_id, pre_report_hook, post_report_hook, }: CustomerOptions): CustomerInstance;
}
export {};
