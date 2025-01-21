import { z } from "zod";

export const ProductRatingCriteriaSchema = z.object({
    quality: z.number().min(1).max(5),
    valueForMoney: z.number().min(1).max(5),
    accuracy: z.number().min(1).max(5),
    overallRating: z.number().min(1).max(5),
});

export const VendorRatingCriteriaSchema = z.object({
    communication: z.number().min(1).max(5),
    shipping: z.number().min(1).max(5),
    service: z.number().min(1).max(5),
    overallRating: z.number().min(1).max(5),
});
