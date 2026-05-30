import { client as directus } from './directus';
import { readItems } from "@directus/sdk";
import { postFields } from "./postFields.ts";
import { heroesTierListFields } from "./heroesTierListFields.ts";
import { pairingFields } from "@lib/pairingFields.ts";
import { artifactFields } from "@lib/artifactFields.ts";
import { menuFields } from "@lib/menuFields.ts";
import type {
    MenuTranslationCollection, PageTranslationCollection,
    TagTranslationCollection
} from "@lib/directus-collections";
import {tagFields} from "@lib/tagFields.ts";
import {pageFields} from "@lib/pageFields.ts";
import {heroFields} from "@lib/heroFields.ts";

type Lang = 'ru' | 'de' | 'en';
const DEFAULT_LOCALE: Lang = 'ru';

function normalizeLang(locale: string): string {
    return locale.split("-")[0]; // ru-RU => ru
}

function pickTranslation<T extends {
    slogan: string;
    body: any;
    description: string;
    name: string;
    languages_code: string }>(
    arr: T[] | undefined,
    locale: string,
    fallback = 'ru'
): T | undefined {
    if (!arr?.length) return undefined;
    const norm = (s: string) => s.split('-')[0];
    return (
        arr.find(t => norm(t.languages_code) === norm(locale)) ||
        arr.find(t => norm(t.languages_code) === norm(fallback)) ||
        arr[0]
    );
}

export async function getMenu() {
    const result = await directus.request(
        readItems('menu', {
            filter: { status: { _eq: 'published' } },
            fields: menuFields as any
        })
    );
    const menu = (result ?? []).flatMap((item) => {
        // @ts-ignore
        return (item.translations ?? []).map((t: MenuTranslationCollection) => {
            const lang = normalizeLang(t.languages_code);
            return {
                id: item.id,
                lang,
                position: item.position,
                parent_id: item.parent_id,
                name: t.name,
                slug: item.slug,
                path: item.path,
                title: t.title,
                new: item.is_new
            };
        });
    });
    return menu;
}

export async function getPosts(locale: Lang = DEFAULT_LOCALE) {
    const result = await directus.request(
        readItems('posts', {
            filter: { status: { _eq: 'published' } },
            sort: ['-date_created'],
            fields: postFields as any,
        })
    );

    const posts = (result ?? [])
        .map((post: any) => {
            const trs = post.translations ?? [];

            // 1) перевод поста
            const t =
                trs.find((x: any) => normalizeLang(x.languages_code) === locale) ??
                trs.find((x: any) => normalizeLang(x.languages_code) === DEFAULT_LOCALE) ??
                trs[0];
            if (!t) return null;

            // 2) локализация тегов
            const localizedTags =
                (post.tags ?? []).map((link: any) => {
                    const tag = link?.tags_id;
                    if (!tag) return null;

                    const tt = pickTranslation(tag.translations, locale, DEFAULT_LOCALE);
                    return {
                        id: link.id,
                        tags_id: {
                            id: tag.id,
                            slug: tag.slug,           // slug остаётся общий (по нему фильтруем)
                            status: tag.status,
                            color: tag.color,
                            name: tt?.name ?? '',     // локализованное имя
                        },
                    };
                }).filter(Boolean) || [];

            return {
                id: post.id,
                lang: normalizeLang(t.languages_code),
                title: t.title,
                description: t.description,
                body: t.body,
                slug: post.slug,
                tags: localizedTags, // теперь имена тегов уже на языке locale
                heroes: post.heroes,
                status: post.status,
                related_posts: post.related_posts,
                date_created: post.date_created,
                date_updated: post.date_updated,
                image: post.image ?? null,
            };
        })
        .filter(Boolean);

    return posts;
}

// Вернёт список языков, для которых есть перевод у поста с данным slug
export async function getPostLangBySlug(slug: string): Promise<Array<'ru'|'de'|'en'>> {
    const res = await directus.request(
        readItems('posts', {
            filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
            // нам хватит языков переводов
            fields: postFields as any,
            limit: 1,
        })
    );

    const item = Array.isArray(res) ? res[0] : null;
    if (!item?.translations) return [];

    const normalize = (s: string) => s.split('-')[0] as 'ru'|'de'|'en';
    const langs = Array.from(new Set(item.translations
        // @ts-ignore
        .map((t: any) => normalize(t.languages_code))
        .filter((l: any) => ['ru','de','en'].includes(l))
    ));
    return langs as Array<'ru'|'de'|'en'>;
}

export async function getPostsByHero(hero: string, locale: Lang = DEFAULT_LOCALE) {
    const result = await directus.request(
        readItems('posts', {
            filter: {
                status: { _eq: 'published' },
                heroes: {
                    heroes_id: {
                        slug: { _eq: hero }
                    }
                }
            },
            sort: ['-date_created'],
            fields: postFields as any
        })
    );

    const posts = (result ?? [])
        .map((post: any) => {
            const trs = post.translations ?? [];

            // 1) перевод поста
            const t =
                trs.find((x: any) => normalizeLang(x.languages_code) === locale) ??
                trs.find((x: any) => normalizeLang(x.languages_code) === DEFAULT_LOCALE) ??
                trs[0];
            if (!t) return null;

            return {
                id: post.id,
                lang: normalizeLang(t.languages_code),
                title: t.title,
                description: t.description,
                body: t.body,
                slug: post.slug,
                heroes: post.heroes,
                status: post.status,
                related_posts: post.related_posts,
                date_created: post.date_created,
                date_updated: post.date_updated,
                image: post.image ?? null,
            };
        })
        .filter(Boolean);

    return posts;
}

export async function getPostsByTag(tag: string, locale: Lang = DEFAULT_LOCALE) {
    const result = await directus.request(
        readItems('posts', {
            filter: {
                status: { _eq: 'published' },
                tags: {
                    tags_id: {
                        slug: { _eq: tag }
                    }
                }
            },
            sort: ['-date_created'],
            fields: postFields as any,
        })
    );

    const posts = (result ?? [])
        .map((post: any) => {
            const trs = post.translations ?? [];

            // 1) перевод поста
            const t =
                trs.find((x: any) => normalizeLang(x.languages_code) === locale) ??
                trs.find((x: any) => normalizeLang(x.languages_code) === DEFAULT_LOCALE) ??
                trs[0];
            if (!t) return null;

            // 2) локализация тегов
            const localizedTags =
                (post.tags ?? []).map((link: any) => {
                    const tag = link?.tags_id;
                    if (!tag) return null;

                    const tt = pickTranslation(tag.translations, locale, DEFAULT_LOCALE);
                    return {
                        id: link.id,
                        tags_id: {
                            id: tag.id,
                            slug: tag.slug,           // slug остаётся общий (по нему фильтруем)
                            status: tag.status,
                            color: tag.color,
                            name: tt?.name ?? '',     // локализованное имя
                        },
                    };
                }).filter(Boolean) || [];

            return {
                id: post.id,
                lang: normalizeLang(t.languages_code),
                title: t.title,
                description: t.description,
                body: t.body,
                slug: post.slug,
                tags: localizedTags, // теперь имена тегов уже на языке locale
                heroes: post.heroes,
                status: post.status,
                related_posts: post.related_posts,
                date_created: post.date_created,
                date_updated: post.date_updated,
                image: post.image ?? null,
            };
        })
        .filter(Boolean);

    return posts;
}

export async function getHeroes(locale: Lang = DEFAULT_LOCALE) {
    const result = await directus.request(
        readItems('heroes', {
            filter: { status: { _eq: 'published' } },
            sort: ['-date_created'],
            fields: heroFields as any,
        })
    );

    return (result ?? [])
        .map((hero: any) => {
            const t = pickTranslation(hero.translations ?? [], locale, DEFAULT_LOCALE);
            if (!t) return null;
            return {
                id: hero.id,
                lang: normalizeLang(t.languages_code),
                name: t.name,
                slogan: t.slogan,
                description: t.description,  // если есть
                body: t.body,                // если есть
                slug: hero.slug,
                status: hero.status,
                date_created: hero.date_created,
                date_updated: hero.date_updated,
                image: hero.image ?? null,
                avatar: hero.avatar ?? null,
                faction: hero.faction ?? null,
                type: hero.type ?? null,
                tier_list: hero.tier_list ?? null,
                trees: hero.trees ?? null,
            };
        })
        .filter(Boolean);
}

export async function getTags() {
    const result = await directus.request(
        readItems('tags', {
            filter: { status: { _eq: 'published' } },
            fields: tagFields as any
        })
    );
    const tags = (result ?? []).flatMap((tag) => {
        // @ts-ignore
        return (tag.translations ?? []).map((t: TagTranslationCollection) => {
            const lang = normalizeLang(t.languages_code);
            return {
                id: tag.id,
                lang,
                slug: tag.slug,
                name: t.name,
                description: t.description,
                body: t.text
            };
        });
    });
    return tags;
}

export async function getPages() {
    const result = await directus.request(
        readItems('pages', {
            filter: { status: { _eq: 'published' } },
            fields: pageFields as any
        })
    );
    const pages = (result ?? []).flatMap((page) => {
        // @ts-ignore
        return (page.translations ?? []).map((t: PageTranslationCollection) => {
            const lang = normalizeLang(t.languages_code);
            return {
                lang,
                id: page.id,
                slug: page.slug,
                image: page.image,
                title: t.title,
                description: t.description,
                body: t.body,
                date_created: page.date_created,
                date_updated: page.date_updated,
            };
        });
    });
    return pages;
}

export async function  getHeroesTierList() {
    return await directus.request(
        readItems('heroes_tier_list', {
            fields: heroesTierListFields as any
        })
    );
}

export async function  getHeroPairings() {
    return await directus.request(
        readItems('hero_pairings', {
            filter: {
                status: { _eq: 'published' }
            },
            fields: pairingFields as any
        })
    );
}

export async function  getArtifacts() {
    return await directus.request(
        readItems('artifacts', {
            filter: {
                status: { _eq: 'published' }
            },
            fields: artifactFields as any
        })
    );
}