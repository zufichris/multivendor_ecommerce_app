import { z } from "zod";
import { ECurrency, ELanguageCode } from "../../../global/enums";
const PricesSchema = z.record(z.nativeEnum(ECurrency.Enum), z.object({
    amount: z.number().min(0),
    compareAtPrice: z.number().min(0).optional(),
    costPrice: z.number().min(0).optional(),
    wholesalePrice: z.number().min(0).optional(),
}));

const VariantSchema = z.object({
    id: z.string().uuid(),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    prices: PricesSchema,
    inventory: z.number().min(0),
    attributes: z.record(z.string(), z.string()),
});

export const ProductSchema = z.object({
    id: z.string().uuid(),
    vendorId: z.string().uuid(),
    name: z.string().min(2).max(200),
    slug: z.string().min(2).max(200),
    description: z.string(),
    shortDescription: z.string().max(300).optional(),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    defaultPrice: z.number().min(0),
    defaultCurrency: z.nativeEnum(ECurrency.Enum),
    prices: PricesSchema,
    categories: z.array(z.string().uuid()),
    tags: z.array(z.string()).optional(),
    brand: z.string().optional(),
    images: z.array(z.object({
        id: z.string().uuid(),
        url: z.string().url(),
        alt: z.string().optional(),
        sortOrder: z.number().default(0),
    })),
    variants: z.array(VariantSchema).optional(),
    attributes: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional(),
    status: z.enum(["DRAFT", "ACTIVE", "INACTIVE", "ARCHIVED"]),
    inventory: z.object({
        quantity: z.number().min(0),
        lowStockThreshold: z.number().min(0).optional(),
        trackInventory: z.boolean().default(true),
        allowBackOrder: z.boolean().default(false),
    }),
    seo: z.object({
        title: z.string().max(60).optional(),
        description: z.string().max(160).optional(),
        keywords: z.array(z.string()).optional(),
    }).optional(),
    translations: z.record(z.nativeEnum(ELanguageCode.Enum), z.object({
        name: z.string(),
        description: z.string(),
        shortDescription: z.string().optional(),
    })).optional(),
    rating: z.number().min(0).max(5).default(0),
    reviewCount: z.number().default(0),
    salesCount: z.number().default(0),
    isPromoted: z.boolean().default(false),
    promotions: z.array(z.string().uuid()).optional(),
    weight: z.number().min(0).optional(),
    dimensions: z.object({
        length: z.number().min(0),
        width: z.number().min(0),
        height: z.number().min(0),
        unit: z.enum(["CM", "INCH"]),
    }).optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type TProduct = z.infer<typeof ProductSchema>;
export type TPrice = z.infer<typeof PricesSchema>;
export type TVariant = z.infer<typeof VariantSchema>;
