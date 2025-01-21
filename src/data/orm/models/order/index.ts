import { z } from "zod";

export const OrderStatusSchema = z.enum([
    "DRAFT",
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "COMPLETED",
    "CANCELED",
    "REFUNDED",
    "ON_HOLD",
    "DISPUTED"
]);

export const OrderItemSchema = z.object({
    id: z.string(),
    orderId: z.string().uuid(),
    productId: z.string().uuid(),
    vendorId: z.string().uuid(),
    variantId: z.string().uuid().optional(),
    sku: z.string().optional(),
    name: z.string(),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
    subtotal: z.number().min(0),
    discount: z.number().min(0).default(0),
    tax: z.number().min(0).default(0),
    total: z.number().min(0),
    weight: z.number().min(0).optional(),
    options: z.array(z.object({
        name: z.string(),
        value: z.string(),
    })).optional(),
    // fulfillmentStatus: FulfillmentStatusSchema.default("PENDING"),
    trackingNumber: z.string().optional(),
    trackingUrl: z.string().url().optional(),
    returnStatus: z.enum(["NONE", "REQUESTED", "APPROVED", "REJECTED", "COMPLETED"]).default("NONE"),
    returnReason: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export const OrderAddressSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    company: z.string().optional(),
    address1: z.string(),
    address2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
    phone: z.string(),
    email: z.string().email(),
    isDefault: z.boolean().default(false),
});

export const OrderSchema = z.object({
    id: z.string().uuid(),
    orderNumber: z.string().min(1),
    userId: z.string().uuid(),
    status: OrderStatusSchema.default("PENDING"),
    // paymentStatus: PaymentStatusSchema.default("PENDING"),
    // fulfillmentStatus: FulfillmentStatusSchema.default("PENDING"),
    currency: z.string().length(3), // ISO currency code
    subtotal: z.number().min(0),
    shippingTotal: z.number().min(0),
    taxTotal: z.number().min(0),
    discountTotal: z.number().min(0),
    total: z.number().min(0),
    itemCount: z.number().min(1),

    // Address Information
    shippingAddress: OrderAddressSchema,
    billingAddress: OrderAddressSchema,

    // Items in the order
    items: z.array(OrderItemSchema),

    // Shipping Information
    shippingMethod: z.object({
        id: z.string().uuid(),
        name: z.string(),
        carrier: z.string(),
        estimatedDays: z.number().optional(),
        trackingNumber: z.string().optional(),
        trackingUrl: z.string().url().optional(),
    }),

    // Payment Information
    paymentMethod: z.object({
        id: z.string().uuid(),
        type: z.enum(["CREDIT_CARD", "PAYPAL", "BANK_TRANSFER", "CRYPTO", "OTHER"]),
        provider: z.string(),
        lastFour: z.string().optional(),
        expiryMonth: z.number().optional(),
        expiryYear: z.number().optional(),
        cardholderName: z.string().optional(),
    }),

    // Transaction Information
    transactions: z.array(z.object({
        id: z.string().uuid(),
        type: z.enum(["PAYMENT", "REFUND", "CHARGEBACK"]),
        status: z.enum(["PENDING", "SUCCESS", "FAILED"]),
        amount: z.number().min(0),
        currency: z.string().length(3),
        paymentMethod: z.string(),
        transactionId: z.string(),
        transactionDate: z.date(),
        metadata: z.record(z.string(), z.unknown()).optional(),
    })),

    // Vendor-specific information
    vendorOrders: z.array(z.object({
        vendorId: z.string().uuid(),
        subtotal: z.number().min(0),
        shipping: z.number().min(0),
        tax: z.number().min(0),
        total: z.number().min(0),
        commission: z.number().min(0),
        status: OrderStatusSchema,
        // fulfillmentStatus: FulfillmentStatusSchema,
        // paymentStatus: PaymentStatusSchema,
    })),

    // Discounts applied
    discounts: z.array(z.object({
        id: z.string().uuid(),
        code: z.string().optional(),
        type: z.enum(["PERCENTAGE", "FIXED", "FREE_SHIPPING"]),
        amount: z.number().min(0),
        description: z.string().optional(),
    })).optional(),

    // Notes and Tags
    customerNotes: z.string().optional(),
    adminNotes: z.string().optional(),
    tags: z.array(z.string()).optional(),

    // Dates
    placedAt: z.date(),
    processedAt: z.date().optional(),
    canceledAt: z.date().optional(),
    refundedAt: z.date().optional(),
    estimatedDeliveryDate: z.date().optional(),
    deliveredAt: z.date().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export type Order = z.infer<typeof OrderSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type OrderAddress = z.infer<typeof OrderAddressSchema>;
