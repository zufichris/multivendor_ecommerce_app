import { z } from "zod";

export const PromotionTypeSchema = z.enum([
    "PERCENTAGE_DISCOUNT",
    "FIXED_AMOUNT_DISCOUNT",
    "BUY_X_GET_Y",
    "BUNDLE_DISCOUNT",
    "FREE_SHIPPING",
    "FIRST_TIME_PURCHASE",
    "FLASH_SALE",
    "SEASONAL_DISCOUNT",
    "CLEARANCE",
    "LOYALTY_REWARD",
    "REFERRAL_DISCOUNT",
    "BULK_DISCOUNT"
  ]);
  
  // Condition Types for Rules
  export const ConditionTypeSchema = z.enum([
    "MINIMUM_PURCHASE_AMOUNT",
    "MINIMUM_QUANTITY",
    "SPECIFIC_PRODUCTS",
    "SPECIFIC_CATEGORIES",
    "SPECIFIC_VENDORS",
    "CUSTOMER_GROUP",
    "PAYMENT_METHOD",
    "SHIPPING_LOCATION",
    "FIRST_ORDER",
    "REPEAT_CUSTOMER",
    "TIME_OF_DAY",
    "DAY_OF_WEEK",
    "MEMBERSHIP_LEVEL",
    "DEVICE_TYPE",
  ]);
  
  // Rule Schema
  export const PromotionRuleSchema = z.object({
    id: z.string().uuid(),
    type: ConditionTypeSchema,
    operator: z.enum(["EQUALS", "NOT_EQUALS", "GREATER_THAN", "LESS_THAN", "IN", "NOT_IN"]),
    value: z.union([
      z.string(),
      z.number(),
      z.array(z.string()),
      z.array(z.number()),
      z.boolean()
    ]),
    metadata: z.record(z.string(), z.unknown()).optional(),
  });
  
  // Promotion Schema
  export const PromotionSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2).max(100),
    description: z.string().max(1000).optional(),
    type: PromotionTypeSchema,
    code: z.string().min(3).max(20).optional(), // For coupon codes
    status: z.enum(["DRAFT", "ACTIVE", "INACTIVE", "EXPIRED", "SCHEDULED"]),
    // Discount Configuration
    discountConfig: z.object({
      type: PromotionTypeSchema,
      value: z.number(), // Percentage or fixed amount
      maxDiscount: z.number().optional(), // Maximum discount amount
      minPurchaseAmount: z.number().optional(),
      stackable: z.boolean().default(false), // Can be combined with other promotions
      priority: z.number().default(0), // For handling multiple applicable promotions
      
      // For BOGO/Bundle promotions
      buyQuantity: z.number().optional(),
      getQuantity: z.number().optional(),
      bundleProducts: z.array(z.string().uuid()).optional(),
    }),
  
    // Targeting
    applicableTo: z.object({
      products: z.array(z.string().uuid()).optional(),
      categories: z.array(z.string().uuid()).optional(),
      vendors: z.array(z.string().uuid()).optional(),
      customerGroups: z.array(z.string().uuid()).optional(),
      excludedProducts: z.array(z.string().uuid()).optional(),
      excludedCategories: z.array(z.string().uuid()).optional(),
      excludedVendors: z.array(z.string().uuid()).optional(),
    }),
  
    // Usage Limits
    usageLimits: z.object({
      totalLimit: z.number().optional(), // Total number of times this can be used
      perCustomerLimit: z.number().optional(), // Times each customer can use it
      perDayLimit: z.number().optional(),
      minimumOrderAmount: z.number().optional(),
      maximumOrderAmount: z.number().optional(),
      remainingUses: z.number().optional(),
    }),
  
    // Time Constraints
    timeConstraints: z.object({
      startDate: z.date(),
      endDate: z.date().optional(),
      startTime: z.string().optional(), // For time-of-day restrictions
      endTime: z.string().optional(),
      daysOfWeek: z.array(z.enum([
        "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY",
        "FRIDAY", "SATURDAY", "SUNDAY"
      ])).optional(),
      timezone: z.string().default("UTC"),
    }),
  
    // Additional Rules
    rules: z.array(PromotionRuleSchema),
  
    // For flash sales
    flashSale: z.object({
      startTime: z.date(),
      endTime: z.date(),
      initialQuantity: z.number(),
      remainingQuantity: z.number(),
      perCustomerLimit: z.number(),
    }).optional(),
  
    // Tracking
    usage: z.object({
      totalUses: z.number().default(0),
      totalDiscount: z.number().default(0),
      lastUsed: z.date().optional(),
    }),
  
    // Translations for multi-language support
    translations: z.record(z.string(), z.object({
      name: z.string(),
      description: z.string().optional(),
    })).optional(),
  
    metadata: z.record(z.string(), z.unknown()).optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    createdBy: z.string().uuid(),
    updatedBy: z.string().uuid().optional(),
  });
  
  // Promotion Usage Record Schema
  export const PromotionUsageSchema = z.object({
    id: z.string().uuid(),
    promotionId: z.string().uuid(),
    orderId: z.string().uuid(),
    userId: z.string().uuid(),
    code: z.string().optional(),
    discountAmount: z.number(),
    appliedAt: z.date(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  });
  
  // Cart Discount Schema (for calculating discounts during checkout)
  export const CartDiscountSchema = z.object({
    id: z.string().uuid(),
    cartId: z.string().uuid(),
    promotionId: z.string().uuid(),
    type: PromotionTypeSchema,
    code: z.string().optional(),
    description: z.string(),
    amount: z.number(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    appliedAt: z.date(),
  });