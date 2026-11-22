import path from 'node:path';
import { loadEnvConfig } from '@next/env';

/*
 * Loads the repository-root .env into process.env for the server runtime. Next reads only
 * frontend/.env*, and its config loader runs in a different process from the route handlers,
 * so it cannot be relied on here. Import this module first: anything that reads process.env
 * at module load (see registry.ts) must run after it. Real environment variables win.
 */
loadEnvConfig(path.resolve(process.cwd(), '..'));
