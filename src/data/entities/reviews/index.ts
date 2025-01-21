import { z } from "zod";

export const ReviewMediaSchema = z.object({
    id: z.string().uuid(),
    type: z.enum(["IMAGE", "VIDEO"]),
    url: z.string().url(),
    thumbnailUrl: z.string().url().optional(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).default("PENDING"),
    sortOrder: z.number().default(0),
    createdAt: z.date(),
});
export const ProductReviewSchema = z.object({
    id: z.string().uuid(),
    productId: z.string().uuid(),
    orderId: z.string().uuid().optional(),
    orderItemId: z.string().uuid().optional(),
    userId: z.string().uuid(),
    vendorId: z.string().uuid(),
    title: z.string().min(3).max(100),
    content: z.string().min(10).max(2000),
    // ratings: ProductRatingCriteriaSchema,
    verifiedPurchase: z.boolean().default(false),
    // status: ReviewStatusSchema.default("PENDING"),
    helpfulVotes: z.number().default(0),
    unhelpfulVotes: z.number().default(0),
    media: z.array(ReviewMediaSchema).optional(),
    vendorResponse: z.object({
        content: z.string().max(1000),
        respondedAt: z.date(),
        updatedAt: z.date().optional(),
    }).optional(),
    purchaseDate: z.date().optional(),
    reviewDate: z.date(),
    lastEditDate: z.date().optional(),
    reportCount: z.number().default(0),
    reports: z.array(z.object({
        userId: z.string().uuid(),
        reason: z.string(),
        details: z.string().optional(),
        createdAt: z.date(),
    })).optional(),

    metadata: z.record(z.string(), z.unknown()).optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const VendorReviewSchema = z.object({
    id: z.string().uuid(),
    vendorId: z.string().uuid(),
    userId: z.string().uuid(),
    orderId: z.string().uuid().optional(),
    title: z.string().min(3).max(100),
    content: z.string().min(10).max(2000),
    // ratings: VendorRatingCriteriaSchema,
    verifiedPurchase: z.boolean().default(false),
    // status: ReviewStatusSchema.default("PENDING"),
    helpfulVotes: z.number().default(0),
    unhelpfulVotes: z.number().default(0),

    // Vendor response
    vendorResponse: z.object({
        content: z.string().max(1000),
        respondedAt: z.date(),
        updatedAt: z.date().optional(),
    }).optional(),

    reportCount: z.number().default(0),
    reports: z.array(z.object({
        userId: z.string().uuid(),
        reason: z.string(),
        details: z.string().optional(),
        createdAt: z.date(),
    })).optional(),

    metadata: z.record(z.string(), z.unknown()).optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// Review Vote Schema
export const ReviewVoteSchema = z.object({
    id: z.string().uuid(),
    reviewId: z.string().uuid(),
    userId: z.string().uuid(),
    voteType: z.enum(["HELPFUL", "UNHELPFUL"]),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// Review Reply Schema
export const ReviewReplySchema = z.object({
    id: z.string().uuid(),
    reviewId: z.string().uuid(),
    userId: z.string().uuid(),
    content: z.string().min(1).max(1000),
    // status: ReviewStatusSchema.default("PENDING"),
    reportCount: z.number().default(0),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// Rating Summary Schema (for aggregated ratings)
export const RatingSummarySchema = z.object({
    entityId: z.string().uuid(), // Product or Vendor ID
    entityType: z.enum(["PRODUCT", "VENDOR"]),
    averageRating: z.number().min(0).max(5),
    totalReviews: z.number().min(0),
    ratingDistribution: z.object({
        five: z.number().min(0),
        four: z.number().min(0),
        three: z.number().min(0),
        two: z.number().min(0),
        one: z.number().min(0),
    }),
    // criteriaAverages: z.union([
    //   ProductRatingCriteriaSchema,
    //   VendorRatingCriteriaSchema
    // ]),
    verifiedPurchaseCount: z.number().min(0),
    lastUpdated: z.date(),
});