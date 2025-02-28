import { BillingSetup } from 'google-ads-node/build/lib/resources';
import Service, { Mutation } from './service';
import { ServiceListOptions, ServiceCreateOptions } from '../types';
export default class BillingSetupService extends Service {
    get(id: number | string): Promise<BillingSetup>;
    list(options?: ServiceListOptions): Promise<Array<{
        billing_setup: BillingSetup;
    }>>;
    create(billing_setup: BillingSetup | Array<BillingSetup>, options?: ServiceCreateOptions): Promise<Mutation>;
    update(billing_setup: BillingSetup | Array<BillingSetup>, options?: ServiceCreateOptions): Promise<Mutation>;
    delete(id: number | string, options?: ServiceCreateOptions): Promise<Mutation>;
}
