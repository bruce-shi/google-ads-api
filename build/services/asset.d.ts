import { Asset } from 'google-ads-node/build/lib/resources';
import Service, { Mutation } from './service';
import { ServiceListOptions, ServiceCreateOptions } from '../types';
export default class AdGroupAdService extends Service {
    get(id: number | string): Promise<Asset>;
    list(options?: ServiceListOptions): Promise<Array<{
        asset: Asset;
    }>>;
    create(asset: Asset | Array<Asset>, options?: ServiceCreateOptions): Promise<Mutation>;
    update(asset: Asset | Array<Asset>, options?: ServiceCreateOptions): Promise<Mutation>;
    delete(id: number | string, options?: ServiceCreateOptions): Promise<Mutation>;
}
