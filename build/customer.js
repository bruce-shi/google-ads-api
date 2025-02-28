"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Services */
const campaign_1 = __importDefault(require("./services/campaign"));
const campaign_budget_1 = __importDefault(require("./services/campaign_budget"));
const ad_group_1 = __importDefault(require("./services/ad_group"));
const account_budget_proposal_1 = __importDefault(require("./services/account_budget_proposal"));
const account_budget_1 = __importDefault(require("./services/account_budget"));
const ad_group_ad_label_1 = __importDefault(require("./services/ad_group_ad_label"));
const ad_group_ad_1 = __importDefault(require("./services/ad_group_ad"));
const ad_group_bid_modifier_1 = __importDefault(require("./services/ad_group_bid_modifier"));
const ad_group_criterion_label_1 = __importDefault(require("./services/ad_group_criterion_label"));
const ad_group_criterion_1 = __importDefault(require("./services/ad_group_criterion"));
const ad_group_extension_setting_1 = __importDefault(require("./services/ad_group_extension_setting"));
const ad_group_feed_1 = __importDefault(require("./services/ad_group_feed"));
const ad_group_label_1 = __importDefault(require("./services/ad_group_label"));
// TODO: Missing protos
// import AdParameterService from './services/ad_parameter'
const asset_1 = __importDefault(require("./services/asset"));
const bidding_strategy_1 = __importDefault(require("./services/bidding_strategy"));
const billing_setup_1 = __importDefault(require("./services/billing_setup"));
const campaign_bid_modifier_1 = __importDefault(require("./services/campaign_bid_modifier"));
const campaign_criterion_1 = __importDefault(require("./services/campaign_criterion"));
const campaign_extension_setting_1 = __importDefault(require("./services/campaign_extension_setting"));
const campaign_feed_1 = __importDefault(require("./services/campaign_feed"));
const campaign_label_1 = __importDefault(require("./services/campaign_label"));
const campaign_shared_set_1 = __importDefault(require("./services/campaign_shared_set"));
const carrier_constant_1 = __importDefault(require("./services/carrier_constant"));
const change_status_1 = __importDefault(require("./services/change_status"));
const conversion_action_1 = __importDefault(require("./services/conversion_action"));
const conversion_upload_1 = __importDefault(require("./services/conversion_upload"));
// import ConversionAdjustmentUploadService from './services/conversion_adjustment_upload'
const custom_interest_1 = __importDefault(require("./services/custom_interest"));
const customer_client_link_1 = __importDefault(require("./services/customer_client_link"));
const customer_client_1 = __importDefault(require("./services/customer_client"));
const customer_extension_setting_1 = __importDefault(require("./services/customer_extension_setting"));
const customer_feed_1 = __importDefault(require("./services/customer_feed"));
const customer_label_1 = __importDefault(require("./services/customer_label"));
const customer_manager_link_1 = __importDefault(require("./services/customer_manager_link"));
const customer_negative_criterion_1 = __importDefault(require("./services/customer_negative_criterion"));
const domain_category_1 = __importDefault(require("./services/domain_category"));
const extension_feed_item_1 = __importDefault(require("./services/extension_feed_item"));
const feed_item_1 = __importDefault(require("./services/feed_item"));
const feed_item_target_1 = __importDefault(require("./services/feed_item_target"));
const feed_mapping_1 = __importDefault(require("./services/feed_mapping"));
const feed_1 = __importDefault(require("./services/feed"));
const geo_target_constant_1 = __importDefault(require("./services/geo_target_constant"));
const keyword_plan_ad_group_1 = __importDefault(require("./services/keyword_plan_ad_group"));
const keyword_plan_campaign_1 = __importDefault(require("./services/keyword_plan_campaign"));
// TODO: Missing protos
// import KeywordPlanIdeaService from './services/keyword_plan_idea'
const keyword_plan_keyword_1 = __importDefault(require("./services/keyword_plan_keyword"));
const keyword_plan_negative_keyword_1 = __importDefault(require("./services/keyword_plan_negative_keyword"));
const keyword_plan_1 = __importDefault(require("./services/keyword_plan"));
const label_1 = __importDefault(require("./services/label"));
const language_constant_1 = __importDefault(require("./services/language_constant"));
const media_file_1 = __importDefault(require("./services/media_file"));
// TODO: Missing protos
// import MerchantCenterLinkService from './services/merchant_center_link'
const mobile_app_category_constant_1 = __importDefault(require("./services/mobile_app_category_constant"));
const mobile_device_constant_1 = __importDefault(require("./services/mobile_device_constant"));
const operating_system_version_constant_1 = __importDefault(require("./services/operating_system_version_constant"));
// TODO: Missing protos
// import PaymentsAccountService from './services/payments_account'
const product_bidding_category_constant_1 = __importDefault(require("./services/product_bidding_category_constant"));
const recommendation_1 = __importDefault(require("./services/recommendation"));
const remarketing_action_1 = __importDefault(require("./services/remarketing_action"));
const shared_criterion_1 = __importDefault(require("./services/shared_criterion"));
const shared_set_1 = __importDefault(require("./services/shared_set"));
const topic_constant_1 = __importDefault(require("./services/topic_constant"));
const user_interest_1 = __importDefault(require("./services/user_interest"));
const user_list_1 = __importDefault(require("./services/user_list"));
const video_1 = __importDefault(require("./services/video"));
const ad_group_simulation_1 = __importDefault(require("./services/ad_group_simulation"));
const ad_group_criterion_simulation_1 = __importDefault(require("./services/ad_group_criterion_simulation"));
const campaign_criterion_simulation_1 = __importDefault(require("./services/campaign_criterion_simulation"));
/* Customer */
const customer_1 = __importDefault(require("./services/customer"));
function Customer(cid, client, throttler, pre_report_hook, post_report_hook) {
    const cusService = new customer_1.default(cid, client, throttler, 'CustomerService', pre_report_hook, post_report_hook);
    return {
        /* Top level customer methods */
        report: options => cusService.report(options),
        query: qry => cusService.query(qry),
        list: () => cusService.list(),
        get: id => cusService.get(id),
        update: (customer, options) => cusService.update(customer, options),
        mutateResources: (operations, options) => cusService.mutateResources(operations, options),
        /* Services */
        campaigns: new campaign_1.default(cid, client, throttler, 'CampaignService'),
        campaignBudgets: new campaign_budget_1.default(cid, client, throttler, 'CampaignBudgetService'),
        adGroups: new ad_group_1.default(cid, client, throttler, 'AdGroupService'),
        accountBudgetProposals: new account_budget_proposal_1.default(cid, client, throttler, 'AccountBudgetProposalService'),
        accountBudgets: new account_budget_1.default(cid, client, throttler, 'AccountBudgetService'),
        adGroupAdLabels: new ad_group_ad_label_1.default(cid, client, throttler, 'AdGroupAdLabelService'),
        adGroupAds: new ad_group_ad_1.default(cid, client, throttler, 'AdGroupAdService'),
        adGroupBidModifiers: new ad_group_bid_modifier_1.default(cid, client, throttler, 'AdGroupBidModifierService'),
        adGroupCriterionLabels: new ad_group_criterion_label_1.default(cid, client, throttler, 'AdGroupCriterionLabelService'),
        adGroupCriteria: new ad_group_criterion_1.default(cid, client, throttler, 'AdGroupCriterionService'),
        adGroupExtensionSettings: new ad_group_extension_setting_1.default(cid, client, throttler, 'AdGroupExtensionSettingService'),
        adGroupFeeds: new ad_group_feed_1.default(cid, client, throttler, 'AdGroupFeedService'),
        adGroupLabels: new ad_group_label_1.default(cid, client, throttler, 'AdGroupLabelService'),
        assets: new asset_1.default(cid, client, throttler, 'AssetService'),
        biddingStrategies: new bidding_strategy_1.default(cid, client, throttler, 'BiddingStrategyService'),
        billingSetups: new billing_setup_1.default(cid, client, throttler, 'BillingSetupService'),
        campaignBidModifiers: new campaign_bid_modifier_1.default(cid, client, throttler, 'CampaignBidModifierService'),
        campaignCriteria: new campaign_criterion_1.default(cid, client, throttler, 'CampaignCriterionService'),
        campaignExtensionSettings: new campaign_extension_setting_1.default(cid, client, throttler, 'CampaignExtensionSettingService'),
        campaignFeeds: new campaign_feed_1.default(cid, client, throttler, 'CampaignFeedService'),
        campaignLabels: new campaign_label_1.default(cid, client, throttler, 'CampaignLabelService'),
        campaignSharedSets: new campaign_shared_set_1.default(cid, client, throttler, 'CampaignSharedSetService'),
        carrierConstants: new carrier_constant_1.default(cid, client, throttler, 'CarrierConstantService'),
        changeStatus: new change_status_1.default(cid, client, throttler, 'ChangeStatusService'),
        conversionActions: new conversion_action_1.default(cid, client, throttler, 'ConversionActionService'),
        conversionUploads: new conversion_upload_1.default(cid, client, throttler, 'ConversionUploadService'),
        // conversionAdjustmentUploads: new ConversionAdjustmentUploadService(
        //     cid,
        //     client,
        //     throttler,
        //     'ConversionAdjustmentUploadService'
        // ),
        customInterests: new custom_interest_1.default(cid, client, throttler, 'CustomInterestService'),
        customerClientLinks: new customer_client_link_1.default(cid, client, throttler, 'CustomerClientLinkService'),
        customerClients: new customer_client_1.default(cid, client, throttler, 'CustomerClientService'),
        customerExtensionSettings: new customer_extension_setting_1.default(cid, client, throttler, 'CustomerExtensionSettingService'),
        customerFeeds: new customer_feed_1.default(cid, client, throttler, 'CustomerFeedService'),
        customerLabels: new customer_label_1.default(cid, client, throttler, 'CustomerLabelService'),
        customerManagerLinks: new customer_manager_link_1.default(cid, client, throttler, 'CustomerManagerLinkService'),
        customerNegativeCriteria: new customer_negative_criterion_1.default(cid, client, throttler, 'CustomerNegativeCriterionService'),
        domainCategories: new domain_category_1.default(cid, client, throttler, 'DomainCategoryService'),
        extensionFeedItems: new extension_feed_item_1.default(cid, client, throttler, 'ExtensionFeedItemService'),
        feedItems: new feed_item_1.default(cid, client, throttler, 'FeedItemService'),
        feedItemTargets: new feed_item_target_1.default(cid, client, throttler, 'FeedItemTargetService'),
        feedMappings: new feed_mapping_1.default(cid, client, throttler, 'FeedMappingService'),
        feeds: new feed_1.default(cid, client, throttler, 'FeedService'),
        geoTargetConstants: new geo_target_constant_1.default(cid, client, throttler, 'GeoTargetConstantService'),
        keywordPlanAdGroups: new keyword_plan_ad_group_1.default(cid, client, throttler, 'KeywordPlanAdGroupService'),
        keywordPlanCampaigns: new keyword_plan_campaign_1.default(cid, client, throttler, 'KeywordPlanCampaignService'),
        // keywordPlanIdeas: new KeywordPlanIdeaService(cid, client, throttler, 'KeywordPlanIdeaService'),
        keywordPlanKeywords: new keyword_plan_keyword_1.default(cid, client, throttler, 'KeywordPlanKeywordService'),
        keywordPlanNegativeKeywords: new keyword_plan_negative_keyword_1.default(cid, client, throttler, 'KeywordPlanNegativeKeywordService'),
        keywordPlans: new keyword_plan_1.default(cid, client, throttler, 'KeywordPlanService'),
        labels: new label_1.default(cid, client, throttler, 'LabelService'),
        languageConstants: new language_constant_1.default(cid, client, throttler, 'LanguageConstantService'),
        mediaFiles: new media_file_1.default(cid, client, throttler, 'MediaFileService'),
        // merchantCenterLinks: new MerchantCenterLinkService(cid, client, throttler, 'MerchantCenterLinkService'),
        mobileAppCategoryConstants: new mobile_app_category_constant_1.default(cid, client, throttler, 'MobileAppCategoryConstantService'),
        mobileDeviceConstants: new mobile_device_constant_1.default(cid, client, throttler, 'MobileDeviceConstantService'),
        operatingSystemVersionConstants: new operating_system_version_constant_1.default(cid, client, throttler, 'OperatingSystemVersionConstantService'),
        // paymentsAccounts: new PaymentsAccountService(cid, client, throttler, 'PaymentsAccountService'),
        productBiddingCategoryConstants: new product_bidding_category_constant_1.default(cid, client, throttler, 'ProductBiddingCategoryConstantService'),
        recommendations: new recommendation_1.default(cid, client, throttler, 'RecommendationService'),
        remarketingActions: new remarketing_action_1.default(cid, client, throttler, 'RemarketingActionService'),
        sharedCriteria: new shared_criterion_1.default(cid, client, throttler, 'SharedCriterionService'),
        sharedSets: new shared_set_1.default(cid, client, throttler, 'SharedSetService'),
        topicConstants: new topic_constant_1.default(cid, client, throttler, 'TopicConstantService'),
        userInterests: new user_interest_1.default(cid, client, throttler, 'UserInterestService'),
        userLists: new user_list_1.default(cid, client, throttler, 'UserListService'),
        videos: new video_1.default(cid, client, throttler, 'VideoService'),
        adGroupSimulations: new ad_group_simulation_1.default(cid, client, throttler, 'AdGroupSimulationService'),
        adGroupCriterionSimulations: new ad_group_criterion_simulation_1.default(cid, client, throttler, 'AdGroupCriterionSimulationService'),
        campaignCriterionSimulations: new campaign_criterion_simulation_1.default(cid, client, throttler, 'CampaignCriterionSimulationService'),
    };
}
exports.default = Customer;
