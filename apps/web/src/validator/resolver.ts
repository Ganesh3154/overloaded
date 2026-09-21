import type { ZodSchema } from "zod";
import type { FieldValues, Resolver } from "react-hook-form";

export function validate<T extends FieldValues>(
  schema: ZodSchema<T>,
): Resolver<T> {
  return (values) => {
    const result = schema.safeParse(values);
    if (result.success) {
      return { values: result.data, errors: {} };
    }
    const errors: Record<string, { type: string; message: string }> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join(".");
      if (path && !errors[path]) {
        errors[path] = { type: issue.code, message: issue.message };
      }
    }
    return { values: {}, errors: errors as FieldValues };
  };
}
