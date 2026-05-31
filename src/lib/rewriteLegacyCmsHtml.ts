const LEGACY_CMS_HOSTS = ['cms.callofdragons.online', 'cms.callofdragons.fun', 'cod.artpix.cloud'];

/** Rewrites hard-coded CMS asset URLs in Directus HTML fields to local /assets paths. */
export function rewriteLegacyCmsHtml(html: string | undefined | null): string {
    if (html == null || html === '') {
        return '';
    }
    let result = html;
    for (const host of LEGACY_CMS_HOSTS) {
        result = result
            .replaceAll(`https://${host}/assets/`, '/assets/')
            .replaceAll(`http://${host}/assets/`, '/assets/');
    }
    return result;
}
