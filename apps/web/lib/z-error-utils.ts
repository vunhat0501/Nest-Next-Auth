import z from "zod";

export const getFieldError = (error: z.ZodError) => {
  const treeified = z.treeifyError(error);
  const fieldErrors: Record<string, string[]> = {};
  // if ("properties" in treeified) {
  //   for (const key in treeified.properties) {
  //     const field = treeified.properties[key];
  //     if (field.errors && field.errors.length > 0) {
  //       fieldErrors[key] = field.errors;
  //     }
  //   }
  // }

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
