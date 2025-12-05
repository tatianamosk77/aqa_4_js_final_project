import { APIRequestContext, APIResponse, test } from '@playwright/test';
import { IRequestOptions, IResponse } from 'data/types/core.types';
import { BaseApiClient } from './baseApiClient';
import _ from 'lodash';
export class RequestApi extends BaseApiClient {
  constructor(private requestContext: APIRequestContext) {
    super();
  }

  private response: APIResponse | undefined;
  private testInfo = test.info;

  async send<T extends object | null>(options: IRequestOptions): Promise<IResponse<T>> {
    try {
      const url = options.baseURL + options.url;
      const fetchOptions = _.omit(options, ['baseURL', 'url']);

      await this.attachRequest(options);

      this.response = await this.requestContext.fetch(url, fetchOptions);

      if (this.response.status() >= 500)
        throw new Error('Request failed with status ' + this.response.status());
      const result = await this.transformResponse();

      await this.attachResponse(options, result);

      return result as IResponse<T>;
    } catch (err) {
      console.log((err as Error).message);
      throw err;
    }
  }

  protected async transformResponse() {
    let body: object | null = null;
    const contentType = this.response!.headers()['content-type'] || '';
    const status = this.response!.status();

    // For 204 No Content, always return null
    if (status === 204) {
      return {
        status,
        body: null,
        headers: this.response!.headers(),
      };
    }

    // Try to read response text first
    let responseText: string;
    try {
      responseText = await this.response!.text();
    } catch (error) {
      // If we can't read the response, return null
      return {
        status,
        body: null,
        headers: this.response!.headers(),
      };
    }

    // If response is empty, return null
    if (!responseText || responseText.trim() === '') {
      return {
        status,
        body: null,
        headers: this.response!.headers(),
      };
    }

    // Try to parse as JSON if content-type suggests JSON
    if (contentType.includes('application/json')) {
      try {
        const parsed = JSON.parse(responseText);
        // Ensure body is an object (not array, string, number, etc.)
        if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
          body = parsed;
        } else if (parsed === null) {
          body = null;
        } else {
          // If parsed value is not an object, return null
          body = null;
        }
      } catch (error) {
        // If JSON parsing fails, return null
        body = null;
      }
    } else {
      // For non-JSON responses, we can't return them as object, so return null
      body = null;
    }

    return {
      status,
      body,
      headers: this.response!.headers(),
    };
  }

  private async attachRequest(options: IRequestOptions) {
    await this.testInfo().attach(`Request ${options.method.toUpperCase()} ${options.url}`, {
      body: JSON.stringify(
        {
          headers: options.headers,
          body: options.data,
        },
        null,
        2
      ),
      contentType: 'application/json',
    });
  }

  private async attachResponse<T extends object | null>(
    options: IRequestOptions,
    response: IResponse<T>
  ) {
    await this.testInfo().attach(
      `Response ${response.status} ${options.method.toUpperCase()} ${options.url}`,
      {
        body: JSON.stringify(
          {
            headers: response.headers,
            body: response.body,
          },
          null,
          2
        ),
        contentType: 'application/json',
      }
    );
  }
}
