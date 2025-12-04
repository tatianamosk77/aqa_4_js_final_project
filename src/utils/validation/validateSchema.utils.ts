import { expect } from '@playwright/test';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

export function validateJsonSchema(body: object, schema: object) {
  const ajv = new Ajv();
  addFormats(ajv);
  const validate = ajv.compile(schema);

addFormats(ajv);

export function validateJsonSchema(schema: Record<string, unknown>, body: unknown) {
  const validate = ajv.compile(schema as AnySchema);
  const isValid = validate(body);

  expect
    .soft(isValid, `Response body should match JSON schema. Errors: ${JSON.stringify(validate.errors, null, 2)}`)
    .toBe(true);

  if (isValid) {
    console.log('Data is valid according to the schema.');
  } else {
    console.log('Data is not valid according to the schema.');
    console.log(validate.errors);
  }
}
