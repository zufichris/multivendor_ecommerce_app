import mongoose from "mongoose";
import z, { string, unknown } from "zod";

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
