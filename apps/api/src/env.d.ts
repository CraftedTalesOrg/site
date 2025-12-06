export type Bindings = {
  DB: D1Database;
  RATE_LIMIT_KV: KVNamespace;
  SWAGGER_ENABLED?: string;
  CORS_ORIGIN?: string;
  SESSION_COOKIE_NAME?: string;
  SESSION_SECRET?: string;
  API_VERSION_PREFIX?: string;
};

export type Env = {
  Bindings: Bindings;
};
