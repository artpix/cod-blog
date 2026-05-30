import { createDirectus, rest, staticToken, type DirectusClient, type RestClient } from '@directus/sdk';
import type { DirectusCollections } from './directus-collections';

export function getAssetURL(id: any) {
    if (!id) return '';
    return `/assets/${id}`;
}

const API_URL = import.meta.env.DIRECTUS_URL;
const API_TOKEN = import.meta.env.DIRECTUS_TOKEN;

if (!API_URL || !API_TOKEN) {
    throw new Error('Missing DIRECTUS_URL or DIRECTUS_TOKEN in environment variables');
}

async function getClient() {
    const directus: DirectusClient<DirectusCollections> & RestClient<DirectusCollections> =
        createDirectus<DirectusCollections>(API_URL)
            .with(staticToken(API_TOKEN))
            .with(rest());
    return directus;
}

const client = await getClient();

export { client };