/**
 * Supported HTTP Methods
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
}

/**
 * Various standard configuration options for HTTP requests
 */
export interface RequestOptions {
  headers?: { [name: string]: string };
  body?: string;
  timeout?: number;
}

/**
 * Creates an abstraction of the actual HTTP interface.
 *
 * Its responsibility is to make http calls and provide a
 * simplified response and establish a timeout.
 *
 * Potential implementations can use the fetch() API or a libary like axios.
 * Since we only do very simple requests, this abstraction allows for better
 * test mocking and easy-to-use access to the fetch API which leads to smaller
 * bundle sizes compared to axios.
 */
export interface HttpClient {
  /**
   * Make a HTTP request
   *
   * @param method The HTTP Method to use
   * @param endpoint The URL
   * @param opts further request options
   */
  fetch(
    method: HttpMethod,
    endpoint: string,
    opts: RequestOptions
  ): Promise<Response>;
}
