import { Customer } from 'google-ads-node/build/lib/resources';
import GrpcClient from '../grpc';
import Bottleneck from 'bottleneck';
import Service, { Mutation } from './service';
import { ReportOptions, ServiceCreateOptions, PreReportHook, PostReportHook, MutateResourceOperation } from '../types';
export declare type ReportResponse = Promise<Array<any>>;
export declare type QueryResponse = Promise<Array<any>>;
export declare type ListResponse = Promise<Array<{
    customer: Customer;
}>>;
export declare type GetResponse = Promise<Customer>;
export declare type UpdateResponse = Promise<void>;
export declare type MutateResourcesResponse = Promise<Mutation>;
export default class CustomerService extends Service {
    private post_report_hook;
    private pre_report_hook;
    constructor(cid: string, client: GrpcClient, throttler: Bottleneck, name: string, pre_report_hook: PreReportHook, post_report_hook: PostReportHook);
    report(options: ReportOptions): ReportResponse;
    query(qry: string): QueryResponse;
    list(): ListResponse;
    get(id: number | string): GetResponse;
    update(customer: Customer, options?: ServiceCreateOptions): UpdateResponse;
    mutateResources(operations: Array<MutateResourceOperation>, options?: ServiceCreateOptions): MutateResourcesResponse;
}
