import { expect } from "@playwright/test";
import { IResponse, IResponseFields } from "data/types/core.types";
import { validateJsonSchema } from "./validateSchema.utils";

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

  if (expected.IsSuccess !== undefined) {
    expect.soft(response.body!.IsSuccess, `IsSuccess should be ${expected.IsSuccess}`).toBe(expected.IsSuccess);
  }

  if (expected.ErrorMessage !== undefined) {
    expect
      .soft(response.body!.ErrorMessage, `ErrorMessage should be ${expected.ErrorMessage}`)
      .toBe(expected.ErrorMessage);
  }

  if (expected.schema) {
    validateJsonSchema(expected.schema as Record<string, unknown>, response.body!);
  }
}
