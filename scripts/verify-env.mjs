import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

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
