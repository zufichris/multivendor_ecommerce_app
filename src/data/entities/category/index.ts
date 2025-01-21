import { z } from "zod";
import { ELanguageCode } from "../../../global/enums";


export const CategorySchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2).max(50),
    slug: z.string().min(2).max(50),
    description: z.string().max(500).optional(),
    image: z.string().url().optional(),
    icon: z.string().optional(),
    parentId: z.string().nullable().optional(),
    level: z.number().min(1).max(3),
    isActive: z.boolean().default(true),
    sortOrder: z.number().default(0),
    translations: z.record(z.nativeEnum(ELanguageCode.Enum), z.object({
        name: z.string(),
        description: z.string().optional(),
    })).optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type TCategory = z.infer<typeof CategorySchema>
let t: TCategory;