import { KeywordPlan } from 'google-ads-node/build/lib/resources';
import Service, { Mutation } from './service';
import { ServiceListOptions, ServiceCreateOptions } from '../types';
export default class KeywordPlanService extends Service {
    get(id: number | string): Promise<KeywordPlan>;
    list(options?: ServiceListOptions): Promise<Array<{
        keyword_plan: KeywordPlan;
    }>>;
    create(keyword_plan: KeywordPlan | Array<KeywordPlan>, options?: ServiceCreateOptions): Promise<Mutation>;
    update(keyword_plan: KeywordPlan | Array<KeywordPlan>, options?: ServiceCreateOptions): Promise<Mutation>;
    delete(id: number | string, options?: ServiceCreateOptions): Promise<Mutation>;
}
