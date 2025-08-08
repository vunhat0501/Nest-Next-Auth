import z from "zod";

//** {
// *   "errors": [],
// *   "properties": {
// *     "email": { "errors": [Array] },
// *     "password": { "errors": [Array] }
// *   }
// * } */

export const getFieldError = (error: z.ZodError) => {
  const treeified = z.treeifyError(error);
  const fieldErrors: Record<string, string[]> = {};

  if (
    typeof treeified === "object" &&
    treeified !== null &&
    "properties" in treeified &&
    typeof (treeified as any).properties === "object"
  ) {
    const properties = (treeified as any).properties;
    Object.keys(properties).forEach((key) => {
      const field = properties[key];
      if (field?.errors && field.errors.length > 0) {
        fieldErrors[key] = field.errors;
      }
    });
  }
  return fieldErrors;
};
