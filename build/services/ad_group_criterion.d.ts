import { AdGroupCriterion } from 'google-ads-node/build/lib/resources';
import Service, { Mutation } from './service';
import { ServiceListOptions, ServiceCreateOptions } from '../types';
export default class AdGroupCriterionService extends Service {
    get(id: number | string): Promise<AdGroupCriterion>;
    list(options?: ServiceListOptions): Promise<Array<{
        ad_group_criterion: AdGroupCriterion;
    }>>;
    create(ad_group_criterion: AdGroupCriterion | Array<AdGroupCriterion>, options?: ServiceCreateOptions): Promise<Mutation>;
    update(ad_group_criterion: AdGroupCriterion | Array<AdGroupCriterion>, options?: ServiceCreateOptions): Promise<Mutation>;
    delete(id: number | string, options?: ServiceCreateOptions): Promise<Mutation>;
}
