import { execFileSync } from 'node:child_process';
import { defineConfig } from 'drizzle-kit';

import { loadEnvFiles } from './src/lib/env';

loadEnvFiles();

const provider = process.env.DATABASE_PROVIDER || 'sqlite';

const dialectMap: Record<string, 'sqlite' | 'postgresql' | 'mysql' | 'turso'> =
  {
    sqlite: 'sqlite',
    postgres: 'postgresql',
    postgresql: 'postgresql',
    mysql: 'mysql',
    turso: 'turso',
  };

const dialect = dialectMap[provider] || 'sqlite';

// Turso is a remote libsql database: it needs an auth token in addition to the
// libsql:// URL. Other dialects (sqlite/postgres/mysql) use the URL alone.
const dbCredentials =
  dialect === 'turso'
    ? {
        url: process.env.DATABASE_URL || 'file:data/local.db',
        authToken: process.env.DATABASE_AUTH_TOKEN,
      }
    : {
        url: process.env.DATABASE_URL || 'file:data/local.db',
      };

export default provider === 'd1'
  ? defineConfig({
      schema: './src/config/db/schema.ts',
      out: './drizzle',
      dialect: 'sqlite',
      driver: 'd1-http',
      // Wrangler owns migration history; schema pushes must preserve it.
      tablesFilter: ['!d1_migrations', '!_cf_*'],
      dbCredentials: {
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
        databaseId: process.env.D1_DATABASE_ID!,
        token:
          process.env.CLOUDFLARE_API_TOKEN ||
          execFileSync('wrangler', ['auth', 'token'], { encoding: 'utf8' })
            .trim()
            .split(/\s+/)
            .pop()!,
      },
    })
  : defineConfig({
      schema: './src/config/db/schema.ts',
      out: './drizzle',
      dialect,
      dbCredentials,
    });
