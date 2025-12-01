export const obligatoryFieldsSchema = {
  IsSuccess: { type: "boolean" },
  ErrorMessage: {
    type: ["string", "null"],
  },
};

export const obligatoryRequredFields = ["IsSuccess", "ErrorMessage"];

export const errorSchema = {
  type: "object",
  properties: {
    ...obligatoryFieldsSchema,
    SchemaErrors: {
      type: "object",
    },
  },
  required: [...obligatoryRequredFields],
};
