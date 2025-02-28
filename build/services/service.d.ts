import Bottleneck from 'bottleneck';
import * as grpc from 'google-ads-node';
import GrpcClient from '../grpc';
import { ServiceListOptions, ServiceCreateOptions } from '../types';
import { ReportOptions, PreReportHook, PostReportHook } from '../types';
interface GetOptions {
    request: string;
    resource: string;
    method: string;
    entity_id: string | number;
}
interface MutateOptions extends ServiceCreateOptions {
    /**
     * The request name (type) e.g. "MutateCampaignsRequest"
     * This can be found in the Google Ads RPC documentation
     */
    request: string;
    /**
     * The operation name (type) e.g. "MutateCampaignsOperation"
     * This can be found in the Google Ads RPC documentation
     */
    operation: string;
    /**
     * The method name for the mutate operation
     * This can be found in the Google Ads RPC documentation
     */
    mutate: string;
    /**
     * This is a tuple
     * The string corresponds to the entity name e.g. "Campaign"
     * The rest is a single or array of objects that will be converted
     */
    entity: [string, object | Array<object>];
}
interface DelMutateOptions extends ServiceCreateOptions {
    request: string;
    operation: string;
    mutate: string;
    resource: string;
    entity_id: string | number;
}
export interface Mutation {
    request: object;
    partial_failure_error: any;
    results: string[];
}
export default class Service {
    protected cid: string;
    protected client: GrpcClient;
    protected service: any;
    private throttler;
    constructor(cid: string, client: GrpcClient, throttler: Bottleneck, name: string);
    protected serviceGet(options: GetOptions): Promise<unknown>;
    protected serviceUpdate(options: MutateOptions): Promise<Mutation>;
    protected serviceDelete(options: DelMutateOptions): Promise<Mutation>;
    protected serviceCreate(options: MutateOptions): Promise<Mutation>;
    private mutate;
    protected globalMutate(request: grpc.MutateGoogleAdsRequest): Promise<Mutation>;
    protected buildResourceName(resource: string): string;
    protected serviceCall(call: string, request: any): Promise<any>;
    protected getListResults(resource: string, options?: ServiceListOptions): Promise<any>;
    protected buildResource(resource: string, data: any): unknown;
    protected serviceReport(options: ReportOptions, pre_report_hook: PreReportHook, post_report_hook: PostReportHook): Promise<any>;
    protected serviceQuery(qry: string): Promise<any>;
    protected parseServiceResults(results: Array<any>): any[];
    private getSearchData;
    private buildListQuery;
    private buildCustomerReportQuery;
}
export {};
