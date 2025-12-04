import Ajv, { AnySchema } from "ajv";
import addFormats from "ajv-formats";
import { expect } from "@playwright/test";

const ajv = new Ajv({
  allErrors: true,
  strict: true,
});

addFormats(ajv);

export function validateJsonSchema(schema: Record<string, unknown>, body: unknown) {
  const validate = ajv.compile(schema as AnySchema);
  const isValid = validate(body);

  expect
    .soft(isValid, `Response body should match JSON schema. Errors: ${JSON.stringify(validate.errors, null, 2)}`)
    .toBe(true);

  if (!isValid) {
    console.error("Schema validation errors:", validate.errors);
  }
}
