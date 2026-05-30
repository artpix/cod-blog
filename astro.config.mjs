// astro.config.mjs
import {defineConfig} from "astro/config";
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import * as path from "node:path";
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

export default defineConfig({
    site: 'https://callofdragons.fun',
    output: 'server',
    adapter: node({
        mode: 'standalone',
    }),
    viewTransitions: true,
    integrations: [sitemap({
        filter: (page) =>
            page !== 'https://cms.callofdragons.fun/' &&
            page !== 'https://cms.callofdragons.online/',
    }), tailwind(), react()],
    i18n: {
        defaultLocale: "ru",
        locales: ["ru", "de", "en"],
        routing: {
            prefixDefaultLocale: false
        },
        fallback: {
            de: "de",
            en: "en"
        }
    },
    vite: {
        server: {
            proxy: {
                // всё, что начинается с /assets,
                // пересылать на Directus, который крутится локально
                '/assets': 'http://localhost:8055'
            }
        },
        resolve: {
            alias: {
                '@lib': path.resolve('./src/lib'),
            },
        },
    },
});