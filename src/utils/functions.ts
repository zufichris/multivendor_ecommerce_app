import mongoose from "mongoose";
import z, { string, unknown } from "zod";
import { IBaseRepository } from "../global/repository";

/**
 * Converts data to Array
 * @type TData the type of data you want to receive, Default is any.
 * @param data The data to convert.
 */
export function toArray<TData>(data: unknown) {
  return Array.isArray(data)
    ? data.map((item) => item as TData)
    : [data as TData];
}


/**
 * Validates data against a Zod schema
 * @param data - The data to be validated
 * @param zodSchema - The Zod schema to validate against
 * @returns An object indicating validation success, error message, and the validated data
 */
export function validateData<T>(
  data: unknown,
  zodSchema: z.ZodObject<any>
): | { data: T, success: true } | { error: string, success: false } {
  const validation = zodSchema.safeParse(data);

  if (validation.success) {
    return {
      success: true,
      data: validation.data as T,
    };
  } else {
    return {
      success: false,
      error: validation.error.errors
        .map((e) => `\n${e.path.join(".")}: ${e.message}`)
        .join("\n-"),
    };
  }
}





/**
 * Validates a Mongoose document before saving using the provided Zod schema.
 * @param mongooseSchema The Mongoose schema.
 * @param zodSchema The Zod schema for validation.
 * @param name The name of the model (used for custom error handling).
 */
export function validateBeforeSave(
  mongooseSchema: mongoose.Schema,
  zodSchema: z.ZodObject<any>,
  name: string
) {
  mongooseSchema.pre("save", function (this: mongoose.Document, next) {
    const parsed = zodSchema.safeParse(this.toObject());
    if (!parsed.success) {
      const errorMessages = parsed.error.errors.map((e) => `${e.path}: ${e.message}`).join(", ");
      const error = new Error(`Validation failed for ${name}: ${errorMessages}`);
      next(error);
    } else {
      next();
    }
  });
}

/**
 * 
 * @param repository The Repository
 * @param prefix  The Prefix of UnitId
 * @param entity  The Entity 
 * @returns   string or null
 */

export async function getUnitId<IRepository extends IBaseRepository<unknown, unknown>>(
  repository: IRepository,
  prefix: string,
  entity: string,
): Promise<string | null> {
  try {
    const count = await repository.count()
    if (!count) {
      return `${prefix}0001`;
    }

    const nextNumber = (count + 1).toString().padStart(4, '0');
    return `${prefix}${nextNumber}`;
  } catch (error) {
    throw new Error(`Error Getting for ${entity}`);
  }
}


export function getQueryMetaData({ page, filterCount, limit, totalCount }: {
  totalCount: number,
  page: number,
  limit: number,
  filterCount: number
}) {
  const skip = (page - 1) * limit
  const totalPages = Math.ceil(filterCount / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;
  const previousPage = hasPreviousPage ? page - 1 : undefined;
  const nextPage = hasNextPage ? page + 1 : undefined;
  const firstItemIndex = (page - 1) * skip + 1;
  const lastItemIndex = Math.min(page * skip, totalCount);
  // const sortField = 'createdAt';
  // const sortOrder = "asc";

  return ({
    totalPages,
    hasNextPage,
    hasPreviousPage,
    previousPage,
    nextPage,
    firstItemIndex,
    lastItemIndex,
    // sortField,
    // sortOrder,
    page,
    filterCount,
    limit,
    totalCount
  })
}