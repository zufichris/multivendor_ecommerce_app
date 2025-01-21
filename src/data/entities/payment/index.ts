import { z } from "zod";

export const PaymentProviderSchema = z.enum([
    "STRIPE",
    "PAYPAL",
    "SQUARE",
    "RAZORPAY",
    "CRYPTO",
    "BANK_TRANSFER",
    "CASH_ON_DELIVERY",
    "KLARNA",
    "AFFIRM",
    "APPLE_PAY",
    "GOOGLE_PAY",
    "ALIPAY",
    "WECHAT_PAY"
  ]);
  
  // Payment Method Types
  export const PaymentMethodTypeSchema = z.enum([
    "CREDIT_CARD",
    "DEBIT_CARD",
    "BANK_ACCOUNT",
    "DIGITAL_WALLET",
    "CRYPTO_WALLET",
    "BUY_NOW_PAY_LATER",
    "CASH_ON_DELIVERY",
    "BANK_TRANSFER"
  ]);
  
  // Payment Method Schema
  export const PaymentMethodSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    type: PaymentMethodTypeSchema,
    provider: PaymentProviderSchema,
    
    // Status
    isDefault: z.boolean().default(false),
    isActive: z.boolean().default(true),
    
    // Provider-specific data
    providerData: z.object({
      paymentMethodId: z.string(), // Provider's payment method ID
      customerId: z.string().optional(), // Provider's customer ID
      tokenId: z.string().optional(), // Tokenized payment method
    }),
    
    // Card Details (for card payments)
    card: z.object({
      brand: z.string(),
      last4: z.string(),
      expiryMonth: z.number(),
      expiryYear: z.number(),
      cardholderName: z.string(),
      fingerprint: z.string().optional(),
      country: z.string().optional(),
      funding: z.string().optional(), // credit/debit/prepaid
    }).optional(),
    
    // Bank Account Details (for bank transfers)
    bankAccount: z.object({
      bankName: z.string(),
      accountType: z.enum(["CHECKING", "SAVINGS"]),
      last4: z.string(),
      holderName: z.string(),
      routingNumber: z.string().optional(),
      country: z.string(),
    }).optional(),
    
    // Digital Wallet Details
    digitalWallet: z.object({
      walletType: z.enum(["APPLE_PAY", "GOOGLE_PAY", "PAYPAL", "ALIPAY", "WECHAT_PAY"]),
      email: z.string().email().optional(),
      phone: z.string().optional(),
    }).optional(),
    
    // Crypto Wallet Details
    cryptoWallet: z.object({
      currency: z.string(),
      address: z.string(),
      network: z.string(),
    }).optional(),
    
    // Billing Address
    billingAddress: z.object({
      firstName: z.string(),
      lastName: z.string(),
      addressLine1: z.string(),
      addressLine2: z.string().optional(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
      country: z.string(),
      phone: z.string().optional(),
    }),
    
    metadata: z.record(z.string(), z.unknown()).optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
  });
  
  
  // Payment Configuration Schema (for vendor/platform payment settings)
  export const PaymentConfigurationSchema = z.object({
    id: z.string().uuid(),
    vendorId: z.string().uuid().optional(), // Optional: null for platform-wide settings
    
    // Enabled Payment Methods
    enabledMethods: z.array(PaymentMethodTypeSchema),
    enabledProviders: z.array(PaymentProviderSchema),
    
    // Provider Configurations
    providerConfigs: z.record(z.string(), z.object({
      isEnabled: z.boolean(),
      apiKeys: z.object({
        publicKey: z.string().optional(),
        secretKeyHash: z.string().optional(),
      }).optional(),
      settings: z.record(z.string(), z.unknown()).optional(),
      supportedCurrencies: z.array(z.string()),
      minimumAmount: z.number().optional(),
      maximumAmount: z.number().optional(),
    })),
    
    // Processing Fees
    processingFees: z.array(z.object({
      provider: PaymentProviderSchema,
      type: z.enum(["PERCENTAGE", "FIXED", "BOTH"]),
      percentage: z.number().optional(),
      fixedAmount: z.number().optional(),
      currency: z.string(),
    })),
    
    // Security Settings
    security: z.object({
      requiresCvv: z.boolean().default(true),
      requires3dSecure: z.boolean().default(true),
      maximumAttempts: z.number().default(3),
      blockHighRiskCountries: z.boolean().default(true),
      highRiskCountries: z.array(z.string()).optional(),
    }),
    
    metadata: z.record(z.string(), z.unknown()).optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
  });