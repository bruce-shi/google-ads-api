import { SearchGoogleAdsRequest } from 'google-ads-node';
import Bottleneck from 'bottleneck';
interface BuildSearchRequestResponse {
    request: SearchGoogleAdsRequest;
    limit: number;
}
export default class GrpcClient {
    private client;
    constructor(developer_token: string, client_id: string, client_secret: string, refresh_token: string, access_token: string, login_customer_id?: string);
    searchWithRetry(throttler: Bottleneck, request: SearchGoogleAdsRequest): Promise<any>;
    searchIterator(throttler: Bottleneck, request: SearchGoogleAdsRequest, limit: number): Promise<Array<object>>;
    buildSearchRequest(customer_id: string, query: string, page_size?: number, page_token?: string): BuildSearchRequestResponse;
    getService(name: string): any;
    buildResource(resource: string, data: any): unknown;
}
export {};
