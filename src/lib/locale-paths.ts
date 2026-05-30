import { defaultLang, languages } from '../i18n/ui';

export function getNonDefaultLocalePaths() {
    return Object.keys(languages)
        .filter((locale) => locale !== defaultLang)
        .map((locale) => ({ params: { locale } }));
}
