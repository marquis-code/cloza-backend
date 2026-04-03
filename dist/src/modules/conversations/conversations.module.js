"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationsModule = void 0;
const common_1 = require("@nestjs/common");
const conversations_service_1 = require("./conversations.service");
const conversations_controller_1 = require("./conversations.controller");
const message_classifier_service_1 = require("./services/message-classifier.service");
const meta_provider_1 = require("./providers/meta.provider");
const fallback_provider_1 = require("./providers/fallback.provider");
const billing_engine_service_1 = require("./services/billing-engine.service");
const routing_service_1 = require("./services/routing.service");
const compliance_service_1 = require("./services/compliance.service");
const bullmq_1 = require("@nestjs/bullmq");
const followup_processor_1 = require("./processors/followup.processor");
let ConversationsModule = class ConversationsModule {
};
exports.ConversationsModule = ConversationsModule;
exports.ConversationsModule = ConversationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.registerQueue({
                name: 'message-followup',
            }),
        ],
        providers: [
            conversations_service_1.ConversationsService,
            message_classifier_service_1.MessageClassifierService,
            meta_provider_1.MetaProvider,
            fallback_provider_1.FallbackProvider,
            billing_engine_service_1.BillingEngineService,
            routing_service_1.RoutingService,
            compliance_service_1.ComplianceService,
            followup_processor_1.FollowUpProcessor,
        ],
        controllers: [conversations_controller_1.ConversationsController],
        exports: [
            conversations_service_1.ConversationsService,
            message_classifier_service_1.MessageClassifierService,
            billing_engine_service_1.BillingEngineService,
            routing_service_1.RoutingService,
            compliance_service_1.ComplianceService,
        ],
    })
], ConversationsModule);
//# sourceMappingURL=conversations.module.js.map