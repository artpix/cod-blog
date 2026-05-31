const ASSET_PREFIX = '/assets';

export function getAssetURL(id: string | null | undefined) {
    if (!id) return '';
    const assetId = String(id)
        .replace(/^https?:\/\/[^/]+\/assets\//, '')
        .replace(/^\/assets\//, '');
    return `${ASSET_PREFIX}/${assetId}`;
}
