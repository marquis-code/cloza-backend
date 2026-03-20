export type Plan = {
    id: string;
    name: string;
    priceMonthly: number;
    priceYearly: number;
    limits: {
        socialAccounts: number;
        quickReplies: number;
        paymentLinks: number;
        scheduledPosts: number;
        teamMembers: number;
    };
    features: string[];
    features_slugs?: string[];
};
export declare const PLANS: Plan[];
