import { z } from "zod";

export const ShippingZoneSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    countries: z.array(z.string()), // ISO country codes
    states: z.array(z.string()).optional(), // State/province codes
    postcodes: z.array(z.string()).optional(),
    priority: z.number().default(0),
    isActive: z.boolean().default(true),
  });
  
  // Shipping Method Schema
  export const ShippingMethodSchema = z.object({
    id: z.string().uuid(),
    zoneId: z.string().uuid(),
    name: z.string(),
    description: z.string().optional(),
    carrier: z.string().optional(),
    
    // Pricing
    baseCost: z.number().min(0),
    freeShippingThreshold: z.number().optional(),
    
    // Calculation Method
    calculationType: z.enum([
      "FLAT_RATE",
      "WEIGHT_BASED",
      "PRICE_BASED",
      "QUANTITY_BASED",
      "DIMENSION_BASED"
    ]),
    
    // Rate Configuration
    rateConfig: z.object({
      baseRate: z.number(),
      incrementalRate: z.number().optional(),
      incrementalUnit: z.number().optional(), // e.g., per kg, per item
      minimumRate: z.number().optional(),
      maximumRate: z.number().optional(),
    }),
    
    // Restrictions
    restrictions: z.object({
      minimumOrderAmount: z.number().optional(),
      maximumOrderAmount: z.number().optional(),
      minimumWeight: z.number().optional(),
      maximumWeight: z.number().optional(),
      excludedCategories: z.array(z.string().uuid()).optional(),
      excludedProducts: z.array(z.string().uuid()).optional(),
      allowedPaymentMethods: z.array(z.string()).optional(),
    }).optional(),
    
    // Handling Time
    estimatedDays: z.number(),
    handlingTime: z.number().optional(),
    
    isActive: z.boolean().default(true),
    metadata: z.record(z.string(), z.unknown()).optional(),
  });
  
  // Tax Zone Schema
  export const TaxZoneSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    countries: z.array(z.string()), // ISO country codes
    states: z.array(z.string()).optional(),
    postcodes: z.array(z.string()).optional(),
    priority: z.number().default(0),
    isActive: z.boolean().default(true),
  });
  
  // Tax Rate Schema
  export const TaxRateSchema = z.object({
    id: z.string().uuid(),
    zoneId: z.string().uuid(),
    name: z.string(),
    rate: z.number().min(0),
    priority: z.number().default(0),
    
    // Tax Configuration
    type: z.enum(["STANDARD", "REDUCED", "ZERO", "COMPOUND"]),
    isCompound: z.boolean().default(false),
    
    // Application Rules
    appliesTo: z.object({
      allProducts: z.boolean().default(true),
      specificCategories: z.array(z.string().uuid()).optional(),
      specificProducts: z.array(z.string().uuid()).optional(),
    }),
    
    // Exemptions
    exemptions: z.object({
      customerTypes: z.array(z.string()).optional(),
      productTypes: z.array(z.string()).optional(),
    }).optional(),
    
    // Digital Goods
    digitalGoodsRate: z.number().optional(),
    
    metadata: z.record(z.string(), z.unknown()).optional(),
    isActive: z.boolean().default(true),
  });
  
  // Tax Category Schema
  export const TaxCategorySchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().optional(),
    defaultRate: z.number(),
    rules: z.array(z.object({
      zoneId: z.string().uuid(),
      rate: z.number(),
    })),
  });
  
  // Shipping Calculator Config
  export const ShippingCalculatorConfigSchema = z.object({
    id: z.string().uuid(),
    vendorId: z.string().uuid().optional(),
    name: z.string(),
    
    // Weight Handling
    weightUnit: z.enum(["KG", "LB"]),
    dimensionUnit: z.enum(["CM", "INCH"]),
    
    // Rate Tables
    rateTables: z.array(z.object({
      condition: z.object({
        type: z.enum(["WEIGHT", "PRICE", "QUANTITY", "DIMENSION"]),
        min: z.number(),
        max: z.number().optional(),
      }),
      rate: z.number(),
    })),
    
    // Special Handling
    handlingFee: z.number().optional(),
    freeShippingThreshold: z.number().optional(),
    
    isActive: z.boolean().default(true),
  });