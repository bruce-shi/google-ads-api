"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
exports.CID = process.env.GADS_CID;
exports.CID_WITH_METRICS = process.env.GADS_CID_WITH_METRICS;
exports.CUSTOMER_CLIENT_LINK = process.env.GADS_CUSTOMER_CLIENT_LINK;
exports.CAMPAIGN_ID = +process.env.GADS_CAMPAIGN_ID;
exports.BUDGET_ID = +process.env.GADS_BUDGET_ID;
exports.ADGROUP_ID = +process.env.GADS_ADGROUP_ID;
function newCustomer() {
    const client = new index_1.GoogleAdsApi({
        client_id: process.env.GADS_CLIENT_ID,
        client_secret: process.env.GADS_CLIENT_SECRET,
        developer_token: process.env.GADS_DEVELOPER_TOKEN,
    });
    return client.Customer({
        customer_account_id: process.env.GADS_CID,
        login_customer_id: process.env.GADS_LOGIN_CUSTOMER_ID,
        refresh_token: process.env.GADS_REFRESH_TOKEN,
    });
}
exports.newCustomer = newCustomer;
function newCustomerWithMetrics() {
    const client = new index_1.GoogleAdsApi({
        client_id: process.env.GADS_CLIENT_ID,
        client_secret: process.env.GADS_CLIENT_SECRET,
        developer_token: process.env.GADS_DEVELOPER_TOKEN,
    });
    return client.Customer({
        customer_account_id: process.env.GADS_CID_WITH_METRICS,
        login_customer_id: process.env.GADS_LOGIN_CUSTOMER_ID_WITH_METRICS,
        refresh_token: process.env.GADS_REFRESH_TOKEN_WITH_METRICS,
    });
}
exports.newCustomerWithMetrics = newCustomerWithMetrics;
function newMccCustomer() {
    const client = new index_1.GoogleAdsApi({
        client_id: process.env.GADS_CLIENT_ID,
        client_secret: process.env.GADS_CLIENT_SECRET,
        developer_token: process.env.GADS_DEVELOPER_TOKEN,
    });
    return client.Customer({
        customer_account_id: process.env.GADS_LOGIN_CUSTOMER_ID,
        login_customer_id: process.env.GADS_LOGIN_CUSTOMER_ID,
        refresh_token: process.env.GADS_REFRESH_TOKEN,
    });
}
exports.newMccCustomer = newMccCustomer;
function getRandomName(entity) {
    return `test-${entity}-${(Math.random() * 100000 + 1).toFixed(0)}`;
}
exports.getRandomName = getRandomName;
