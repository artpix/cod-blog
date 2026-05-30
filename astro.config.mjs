// astro.config.mjs
import {defineConfig} from "astro/config";
import tailwind from '@astrojs/tailwind';
import * as path from "node:path";
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

export default defineConfig({
    site: 'https://callofdragons.netlify.app',
    output: 'static',
    viewTransitions: true,
    integrations: [sitemap({
        filter: (page) =>
            page !== 'https://cms.callofdragons.fun/'
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
                '/assets': process.env.DIRECTUS_URL || 'https://cms.callofdragons.fun',
            },
        },
        resolve: {
            alias: {
                '@lib': path.resolve('./src/lib'),
            },
        },
    },
});