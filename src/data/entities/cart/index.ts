import { z } from "zod";

export const CartStatusSchema = z.enum([
    "ACTIVE",
    "CHECKOUT_STARTED",
    "ABANDONED",
    "CONVERTED",
    "EXPIRED"
  ]);
  
  export const CartItemSchema = z.object({
    id: z.string().uuid(),
    cartId: z.string().uuid(),
    productId: z.string().uuid(),
    variantId: z.string().uuid().optional(),
    vendorId: z.string().uuid(),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
    originalPrice: z.number().min(0),
    discountedPrice: z.number().min(0).optional(),
    subtotal: z.number().min(0),
    totalDiscount: z.number().default(0),
    productName: z.string(),
    variantName: z.string().optional(),
    sku: z.string().optional(),
    image: z.string().url().optional(),
    appliedDiscounts: z.array(z.object({
      promotionId: z.string().uuid(),
      type: z.enum(["PERCENTAGE", "FIXED", "BOGO"]),
      value: z.number(),
      amount: z.number(),
    })).optional(),
    notes: z.string().optional(),
    giftWrapping: z.boolean().default(false),
    customizations: z.record(z.string(), z.string()).optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
  });

  export const ShoppingCartSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid().optional(),
    sessionId: z.string(),
    status: CartStatusSchema.default("ACTIVE"),
    items: z.array(CartItemSchema),
    currency: z.string().length(3),
    itemsCount: z.number().default(0),
    itemsSubtotal: z.number().default(0),
    taxAmount: z.number().default(0),
    shippingAmount: z.number().default(0),
    discountAmount: z.number().default(0),
    total: z.number().default(0),
    appliedDiscounts: z.array(z.object({
      promotionId: z.string().uuid(),
      code: z.string().optional(),
      type: z.enum(["PERCENTAGE", "FIXED", "FREE_SHIPPING"]),
      value: z.number(),
      amount: z.number(),
      description: z.string(),
    })).optional(),
    selectedShippingMethod: z.object({
      id: z.string().uuid(),
      name: z.string(),
      price: z.number(),
      estimatedDays: z.number().optional(),
      carrier: z.string().optional(),
    }).optional(),
    notes: z.string().optional(),
    giftMessage: z.string().optional(),
    isGift: z.boolean().default(false),
    checkoutStartedAt: z.date().optional(),
    lastActivityAt: z.date(),
    expiresAt: z.date().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
  });

  export const SavedForLaterSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    productId: z.string().uuid(),
    variantId: z.string().uuid().optional(),
    addedAt: z.date(),
    notes: z.string().optional(),
  });