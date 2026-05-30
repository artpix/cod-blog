const CMS_URL = (
    import.meta.env.PUBLIC_DIRECTUS_URL ??
    import.meta.env.DIRECTUS_URL ??
    ''
).replace(/\/$/, '');

export function getAssetURL(id: string | null | undefined) {
    if (!id) return '';
    return `${CMS_URL}/assets/${id}`;
}
