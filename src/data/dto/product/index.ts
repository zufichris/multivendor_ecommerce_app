import { z } from "zod"
import { ProductSchema } from "../../entity/product";

export const CreateProductSchema = ProductSchema.pick({
    vendorId: true,
    name: true,
    slug: true,
    description: true,
    shortDescription: true,
    sku: true,
    barcode: true,
    defaultPrice: true,
    defaultCurrency: true,
    prices: true,
    categories: true,
    tags: true,
    brand: true,
    mainImage: true,
    images: true,
    variants: true,
    attributes: true,
    status: true,
    inventory: true,
    seo: true,
    translations: true,
    rating: true,
    reviewCount: true,
    salesCount: true,
    promotions: true,
    weight: true,
    dimensions: true,
    isPromoted: true,
    isFeatured: true,
    isNewProduct: true,
    isBestSeller: true,
    isLimitedEdition: true,
})

export const UpdateProductSchema = ProductSchema.pick({
    vendorId: true,
    name: true,
    slug: true,
    description: true,
    shortDescription: true,
    sku: true,
    barcode: true,
    defaultPrice: true,
    defaultCurrency: true,
    prices: true,
    categories: true,
    tags: true,
    brand: true,
    mainImage: true,
    images: true,
    variants: true,
    attributes: true,
    status: true,
    inventory: true,
    seo: true,
    translations: true,
    rating: true,
    reviewCount: true,
    salesCount: true,
    promotions: true,
    weight: true,
    dimensions: true,
    isPromoted: true,
    isFeatured: true,
    isNewProduct: true,
    isBestSeller: true,
    isLimitedEdition: true,
}).partial();

export type CreateProductDTO = z.infer<typeof CreateProductSchema>
export type UpdateProductDTO = z.infer<typeof UpdateProductSchema>