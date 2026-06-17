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
        filter: (page) => {
            try {
                const { pathname } = new URL(page);
                return !/\/privacy-policy\/?$/.test(pathname);
            } catch {
                return true;
            }
        },
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
                '/assets': {
                    target: process.env.DIRECTUS_URL || 'https://cod.artpix.dev',
                    changeOrigin: true,
                },
            },
        },
        resolve: {
            alias: {
                '@lib': path.resolve('./src/lib'),
            },
        },
    },
});