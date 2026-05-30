const LEGACY_CMS_HOST = 'cms.callofdragons.online';

const CMS_ORIGIN =
    (import.meta.env.PUBLIC_CMS_ORIGIN as string | undefined)?.replace(/\/$/, '') ??
    'https://cms.callofdragons.fun';

/** Rewrites hard-coded asset URLs from the old CMS host in Directus HTML fields. */
export function rewriteLegacyCmsHtml(html: string | undefined | null): string {
    if (html == null || html === '') {
        return '';
    }
    return html
        .replaceAll(`https://${LEGACY_CMS_HOST}`, CMS_ORIGIN)
        .replaceAll(`http://${LEGACY_CMS_HOST}`, CMS_ORIGIN);
}
