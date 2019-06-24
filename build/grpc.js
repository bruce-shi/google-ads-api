"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const google_ads_node_1 = require("google-ads-node");
const token_1 = require("./token");
class GrpcClient {
    constructor(developer_token, client_id, client_secret, refresh_token, access_token, login_customer_id) {
        const options = {
            developer_token,
            client_id,
            client_secret,
            login_customer_id,
            parseResults: true,
        };
        if (access_token) {
            this.client = new google_ads_node_1.GoogleAdsClient(Object.assign({}, options, { access_token }));
        }
        else {
            this.client = new google_ads_node_1.GoogleAdsClient(Object.assign({}, options, { refresh_token,
                accessTokenGetter(clientId, clientSecret, refreshToken) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return token_1.getAccessToken({
                            client_id: clientId,
                            client_secret: clientSecret,
                            refresh_token: refreshToken,
                        });
                    });
                } }));
        }
    }
    searchWithRetry(throttler, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const service = this.client.getService('GoogleAdsService');
            // @ts-ignore
            const response = yield throttler.wrap(service.search).withOptions({
                expiration: 1000 * 60 * 5,
            }, 
            //@ts-ignore
            request);
            return response;
        });
    }
    searchIterator(throttler, request, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
                This next section serves to remedy the current odd
                behavior around limit/page_size of the API.
    
                At the moment, this is what happens:
    
                - If the page_size is higher than the limit:
                    - the limit is ignored
                    - the page_size is set to the limit
                    - SOLUTION: don't paginate
                - If the page_size is lower than the limit:
                    - the limit is ignored
                    - SOLUTION: stop paginating when limit is hit
    
                We're going to get in touch with Google about this.
            */
            let results = [];
            let response = yield this.searchWithRetry(throttler, request);
            results = results.concat(response.resultsList);
            const hasNextPage = (res) => res && res.nextPageToken;
            while (hasNextPage(response)) {
                const next_page_request = request.clone();
                next_page_request.setPageToken(response.nextPageToken);
                response = yield this.searchWithRetry(throttler, next_page_request);
                results = results.concat(response.resultsList);
                // If there is no limit, `limit` will be set to 0.
                if (limit && results.length >= limit) {
                    results = results.slice(0, limit);
                    break;
                }
            }
            return results;
        });
    }
    buildSearchRequest(customer_id, query, page_size, page_token) {
        const request = new google_ads_node_1.SearchGoogleAdsRequest();
        request.setCustomerId(customer_id);
        request.setQuery(query);
        if (page_size) {
            request.setPageSize(page_size);
        }
        if (page_token) {
            request.setPageToken(page_token);
        }
        const has_limit = query.toLowerCase().includes(' limit ');
        let limit = 0; // The default limit is 0, which means no limit.
        if (has_limit) {
            limit = +query
                .toLowerCase()
                .split(' limit ')[1]
                .trim();
        }
        return { request, limit };
    }
    getService(name) {
        return this.client.getService(name);
    }
    buildResource(resource, data) {
        return this.client.buildResource(resource, data);
    }
}
exports.default = GrpcClient;
