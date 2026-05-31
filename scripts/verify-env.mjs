import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const CMS_URL = 'https://cod.artpix.cloud';
const DEPRECATED_CMS_HOSTS = new Set(['cms.callofdragons.fun', 'cms.callofdragons.online']);

function loadDotEnv() {
    const envPath = resolve(process.cwd(), '.env');
    if (!existsSync(envPath)) return;

    for (const line of readFileSync(envPath, 'utf8').split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const separator = trimmed.indexOf('=');
        if (separator === -1) continue;
        const key = trimmed.slice(0, separator).trim();
        const value = trimmed.slice(separator + 1).trim();
        if (!process.env[key]) {
            process.env[key] = value;
        }
    }
}

function cmsHost(url) {
    try {
        return new URL(url).hostname;
    } catch {
        return null;
    }
}

loadDotEnv();

const required = ['DIRECTUS_URL', 'DIRECTUS_TOKEN'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
    console.error('\nBuild failed: missing environment variables:\n');
    for (const key of missing) {
        console.error(`  - ${key}`);
    }
    console.error('\nAdd them in Netlify → Site configuration → Environment variables, then redeploy.\n');
    process.exit(1);
}

const directusHost = cmsHost(process.env.DIRECTUS_URL);
if (!directusHost) {
    console.error('\nBuild failed: DIRECTUS_URL is not a valid URL.\n');
    process.exit(1);
}

if (DEPRECATED_CMS_HOSTS.has(directusHost)) {
    console.error('\nBuild failed: DIRECTUS_URL points to a deprecated CMS host.\n');
    console.error(`  Current:  ${process.env.DIRECTUS_URL}`);
    console.error(`  Expected: ${CMS_URL}`);
    console.error('\nUpdate Netlify → Site configuration → Environment variables:');
    console.error(`  DIRECTUS_URL = ${CMS_URL}`);
    console.error('  Remove PUBLIC_DIRECTUS_URL if it is still set.\n');
    process.exit(1);
}

if (process.env.PUBLIC_DIRECTUS_URL) {
    console.warn('\nWarning: PUBLIC_DIRECTUS_URL is set but no longer used. You can remove it from Netlify.\n');
}
