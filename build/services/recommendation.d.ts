import { Recommendation } from 'google-ads-node/build/lib/resources';
import Service from './service';
import { ServiceListOptions } from '../types';
export default class RecommendationService extends Service {
    get(id: number | string): Promise<Recommendation>;
    list(options?: ServiceListOptions): Promise<Array<{
        recommendation: Recommendation;
    }>>;
}
