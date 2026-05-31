export type Locale = 'ru' | 'de' | 'en';

type SiteCopy = {
    lang: Locale;
    title: string;
    logo: string;
    subtitle: string;
    description: string;
    donation: string;
    error404: string;
    banner: string;
};

const base: SiteCopy = {
    lang: 'ru',
    title: 'Call of Dragons — фан-сайт',
    logo: 'Call of Dragons. Фан-сайт',
    subtitle: 'Гайды, новости, руководства',
    description:
        'Callofdragons.fun — это увлекательный фан-сайт, созданный с любовью к сообществу. Здесь вы найдете всё о Call of Dragons.',
    donation: 'поддержать проект',
    error404: 'Ошибка 404',
    banner:
        'Мы переехали! Это новый адрес сайта — добавьте callofdragons.netlify.app в закладки, чтобы не потерять нас.',
};

// RU — как дефолт (можно переопределить что-то относительно base)
const ru: SiteCopy = {
    ...base,
    lang: 'ru',
    title:
        'Лучшие руководства по игре Call of Dragons: гайды, советы, таланты героев и тактики от опытных игроков',
    logo: 'Call of Dragons. Фан-сайт',
    subtitle: 'Гайды, новости, руководства',
    description:
        'Callofdragons.fun — это увлекательный фан-сайт, созданный с любовью к сообществу. Здесь вы найдете все, что связано с игрой Call of Dragons от Farlight Games и LEGOU Games.',
    donation: 'поддержать проект',
    error404: 'Ошибка 404',
    banner:
        'Мы переехали! Это новый адрес сайта — добавьте callofdragons.netlify.app в закладки, чтобы не потерять нас.',
};

const de: SiteCopy = {
    ...base,
    lang: 'de',
    title: 'Die besten Spielanleitungen für Call of Dragons: Guides, Tipps, Heldentalente und Taktiken von erfahrenen Spielern',
    logo: 'Call of Dragons. Fanseite',
    subtitle: 'Guides, Nachrichten, Anleitungen',
    description:
        'Callofdragons.fun ist eine faszinierende Fanseite, die mit Liebe zur Community erstellt wurde. Hier finden Sie alles rund um das Spiel Call of Dragons von Farlight Games und Legou Games.',
    donation: 'поддержать проект',
    error404: '404 Not Found',
    banner:
        'Wir sind umgezogen! Das ist unsere neue Adresse — speichern Sie callofdragons.netlify.app als Lesezeichen, damit Sie uns nicht verlieren.',
};

const en: SiteCopy = {
    ...base,
    lang: 'en',
    title: 'The best game guides for Call of Dragons: guides, tips, hero talents, and tactics from experienced players',
    logo: 'Call of Dragons. Fansite',
    subtitle: 'Guides, news, strategies',
    description:
        'Callofdragons.fun is an engaging fan site created with love for the community. Here you will find everything related to the game Call of Dragons by Farlight Games and Legou Games.',
    donation: 'поддержать проект',
    error404: '404 Not Found',
    banner:
        "We've moved! This is our new address — bookmark callofdragons.netlify.app so you don't lose us.",
};

export const siteCopy: Record<Locale, SiteCopy> = { ru, de, en };

export function getSiteCopy(locale: string | undefined): SiteCopy {
    const l = (locale || 'ru') as Locale;
    return siteCopy[l] ?? siteCopy.ru; // фолбэк на RU
}