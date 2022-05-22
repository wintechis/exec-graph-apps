import { HttpClient, RequestOptions } from './http-client';
import { HttpError } from './http-error';

/**
 * Creates a timeout controller for the fetch() API
 *
 * @param time Timeout in Seconds
 */
function Timeout(time: number): AbortController {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), time * 1000);
  return controller;
}

/**
 * Implementation of the HttpClient using the browsers fetch() function.
 */
export class FetchHttpClient implements HttpClient {
  /**
   * @inheritdoc
   */
  public fetch(
    method: string,
    endpoint: string,
    opts: RequestOptions
  ): Promise<Response> {
    const init: RequestInit = {
      method,
      headers: opts.headers || [],
      signal: Timeout(opts.timeout || 60).signal,
    };

    return fetch(endpoint, init).then((res: Response) => {
      if (res.status >= 300) {
        throw new HttpError(res.status, res.statusText, {body: res.text()});
      }
      return res;
    }).catch((e) => {
      throw new HttpError(0, e.message, {innerException: e});
    });
  }
}
