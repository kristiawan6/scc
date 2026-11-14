import { app } from "./app";
import { env } from "./env";

const server = Bun.serve({ port: env.PORT, fetch: app.fetch, maxRequestBodySize: (env.MAX_FILE_SIZE_MB + 1) * 1024 * 1024 });
console.log(`SCC API (${env.NODE_ENV}) listening on http://localhost:${server.port}`);
