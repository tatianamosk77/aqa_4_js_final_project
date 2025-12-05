import { expect } from '@playwright/test';
import { IResponse, IResponseFields } from 'data/types/core.types';
import { validateJsonSchema } from './validateSchema.utils';

export function validateResponse<T extends IResponseFields | null>(
  response: IResponse<T>,
  expected: {
    status: number;
    IsSuccess?: boolean;
    ErrorMessage?: string | null;
    schema?: unknown;
  }
) {
  expect
    .soft(response.status, `Status code should be ${expected.status}, got ${response.status}`)
    .toBe(expected.status);

  // For 204 No Content, body is expected to be null - skip body validation
  if (response.status === 204) {
    return;
  }

  // Check if body exists before accessing its properties
  if (response.body === null || response.body === undefined) {
    expect
      .soft(false, `Response body should not be null or undefined. Status: ${response.status}`)
      .toBe(true);
    return;
  }

  // Ensure body is an object (not array, string, number, etc.)
  if (typeof response.body !== 'object' || Array.isArray(response.body)) {
    expect
      .soft(
        false,
        `Response body should be an object, but got ${typeof response.body}. Status: ${response.status}, Body: ${JSON.stringify(response.body)}`
      )
      .toBe(true);
    return;
  }

  if (expected.IsSuccess !== undefined) {
    expect
      .soft(
        response.body.IsSuccess,
        `IsSuccess should be ${expected.IsSuccess}, but got ${response.body.IsSuccess}. Full body: ${JSON.stringify(response.body)}`
      )
      .toBe(expected.IsSuccess);
  }

  if (expected.ErrorMessage !== undefined) {
    expect
      .soft(
        response.body.ErrorMessage,
        `ErrorMessage should be ${expected.ErrorMessage}, but got ${response.body.ErrorMessage}. Full body: ${JSON.stringify(response.body)}`
      )
      .toBe(expected.ErrorMessage);
  }

  if (expected.schema) {
    validateJsonSchema(expected.schema as Record<string, unknown>, response.body);
  }
}
