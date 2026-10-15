/** Raised by the client for a non-2xx response. Data-internal: remoteOutcome maps it. */
export class HttpStatusError extends Error {
  constructor(
    readonly status: number,
    readonly url: string,
  ) {
    super(`HTTP ${status} ${url}`);
    this.name = 'HttpStatusError';
  }
}

/** Raised by the client when its own timeout fires. Data-internal: remoteOutcome maps it. */
export class HttpTimeoutError extends Error {
  constructor(readonly url: string) {
    super(`timeout ${url}`);
    this.name = 'HttpTimeoutError';
  }
}

export type QueryParams = Readonly<Record<string, string | number | boolean | null | undefined>>;

export type HttpMethod = 'POST' | 'PUT' | 'DELETE';

/** Per-request headers; they win over the client's own (a user's token over the app's). */
export type Headers = Readonly<Record<string, string>>;

export type HttpClient = {
  /** Returns the parsed JSON body as unknown; the data source parses it. */
  readonly get: (
    path: string,
    query?: QueryParams,
    signal?: AbortSignal,
    headers?: Headers,
  ) => Promise<unknown>;
  /** A write: the body is sent as JSON, and the parsed response comes back as unknown. */
  readonly send: (
    method: HttpMethod,
    path: string,
    body?: unknown,
    query?: QueryParams,
    headers?: Headers,
  ) => Promise<unknown>;
};

const toQueryString = (query: QueryParams | undefined, defaults: QueryParams): string => {
  const entries = Object.entries({ ...defaults, ...query }).filter(
    (entry): entry is [string, string | number | boolean] =>
      entry[1] !== null && entry[1] !== undefined && entry[1] !== '',
  );
  if (entries.length === 0) return '';
  return `?${entries.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`).join('&')}`;
};

export const makeHttpClient = ({
  baseUrl,
  timeoutMs,
  headers = {},
  defaultQuery = {},
}: {
  baseUrl: string;
  timeoutMs: number;
  headers?: Readonly<Record<string, string>>;
  /** Sent with every request; a request's own query wins. */
  defaultQuery?: QueryParams;
}): HttpClient => {
  const request = async (
    method: 'GET' | HttpMethod,
    path: string,
    query: QueryParams | undefined,
    body: unknown,
    signal: AbortSignal | undefined,
    extraHeaders: Headers | undefined,
  ): Promise<unknown> => {
    const url = `${baseUrl}/${path}${toQueryString(query, defaultQuery)}`;
    const controller = new AbortController();
    const state = { timedOut: false };
    const timer = setTimeout(() => {
      state.timedOut = true;
      controller.abort();
    }, timeoutMs);
    const onAbort = () => {
      controller.abort();
    };
    signal?.addEventListener('abort', onAbort);
    try {
      const response = await fetch(url, {
        method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
          ...headers,
          ...extraHeaders,
        },
        body: body === undefined ? null : JSON.stringify(body),
        signal: controller.signal,
      });
      if (!response.ok) throw new HttpStatusError(response.status, url);
      const text = await response.text();
      return text === '' ? undefined : (JSON.parse(text) as unknown);
    } catch (error) {
      if (state.timedOut) throw new HttpTimeoutError(url);
      throw error;
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', onAbort);
    }
  };
  return {
    get: (path, query, signal, extraHeaders) => request('GET', path, query, undefined, signal, extraHeaders),
    send: (method, path, body, query, extraHeaders) =>
      request(method, path, query, body, undefined, extraHeaders),
  };
};
