import { useState, useMemo } from "react";
import { useTranslations } from '../i18n/utils';

function isWithinThreeDaysOrToday(inputDate) {
    if (!inputDate) return false;
    const now = new Date();
    const input = new Date(inputDate);
    now.setHours(0,0,0,0);
    input.setHours(0,0,0,0);
    const diffDays = (now - input) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 3;
}

function hrefForPost(p) {
    // всегда от корня сайта
    return p.lang === 'ru' || p.lang === undefined
        ? `/blog/${p.slug}/`
        : `/${p.lang}/blog/${p.slug}/`;
}

function hrefForTag(lang, t) {
    // всегда от корня сайта
    return lang === 'ru' || lang === undefined
        ? `/tags/${t.slug}/`
        : `/${lang}/tags/${t.slug}/`;
}

export default function PostTagFilter({ posts, tags, locale = 'ru' }) {
    const [selectedSlug, setSelectedSlug] = useState("");
    const [onlyRecent, setOnlyRecent] = useState(false);
    const t = useTranslations(locale);

    // Уникальные теги по slug для кнопок (отображаем локализованное имя)
    const tagOptions = useMemo(() => {
        const bySlug = new Map(); // slug -> { slug, name }
        (tags || []).forEach(t => {
            if (!t?.slug) return;
            if (!bySlug.has(t.slug)) bySlug.set(t.slug, { slug: t.slug, name: t.name });
        });
        return Array.from(bySlug.values());
    }, [tags]);

    // Фильтрация постов: по slug + по "обновлено за 3 дня"
    const filteredPosts = useMemo(() => {
        const list = Array.isArray(posts) ? posts : [];

        // 1) группируем все варианты переводов одного поста по id
        const byId = new Map();
        for (const p of list) {
            if (!byId.has(p.id)) byId.set(p.id, []);
            byId.get(p.id).push(p);
        }

        // 2) выбираем лучший перевод для каждой группы
        const pickForLocale = (arr) =>
            arr.find((x) => x.lang === locale) ||
            arr.find((x) => x.lang === "ru") ||
            arr[0];

        const perLocale = Array.from(byId.values()).map(pickForLocale);

        // 3) применяем фильтры: тег + «обновлено за 3 дня»
        return perLocale.filter((post) => {
            const tagOk =
                !selectedSlug ||
                post.tags?.some(
                    (t) => t.tags_id?.status === "published" && t.tags_id?.slug === selectedSlug
                );

            const dateForCheck = post.date_updated || post.date_created;
            const recentOk = !onlyRecent || isWithinThreeDaysOrToday(dateForCheck);

            return tagOk && recentOk;
        });
    }, [posts, selectedSlug, onlyRecent, locale]);
    return (
        <div className="space-y-6">
            {/* Переключатель "Обновлённые за 3 дня" */}
            <div className="flex items-center justify-start gap-3">
                <span className="text-sm text-gray-700">{t('filter.3days')}</span>
                <label className="relative inline-block w-11 h-6">
                    <input
                        type="checkbox"
                        className="opacity-0 w-0 h-0 peer"
                        checked={onlyRecent}
                        onChange={(e) => setOnlyRecent(e.target.checked)}
                    />
                    <span className="absolute inset-0 cursor-pointer bg-gray-300 peer-checked:bg-[#d4220f] transition-colors rounded-full"></span>
                    <span className="absolute left-0.5 top-0.5 h-5 w-5 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-md"></span>
                </label>
            </div>

            {/* Кнопки тегов */}
            <div className="flex flex-wrap gap-2 mb-6 items-center">
                {tagOptions.map((opt) => (
                    <button
                        key={opt.slug}
                        className={`border px-3 py-1 rounded-sm text-sm ${
                            selectedSlug === opt.slug
                                ? "bg-[#d4220f] text-white"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-100"
                        }`}
                        onClick={() =>
                            setSelectedSlug(prev => (prev === opt.slug ? "" : opt.slug))
                        }
                    >
                        {opt.name}
                    </button>
                ))}

                {(selectedSlug || onlyRecent) && (
                    <button
                        onClick={() => {
                            setSelectedSlug("");
                            setOnlyRecent(false);
                        }}
                        className="border px-3 py-1 rounded text-sm bg-gray-100 hover:bg-gray-300 text-gray-700"
                    >
                        {t('filter.reset')}
                    </button>
                )}
            </div>

            {/* Посты */}
            <ul className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5">
                {filteredPosts.map((post) => (
                    <li key={post.id} className="card card-container bg-primary rounded-lg">
                        <article className="card-post">
                            <a href={hrefForPost(post)} className="card-link" >
                                <div className="card-thumbnail lg:min-h-48 md:max-h-28 sm:max-h-36">
                                    {post.image && (
                                        <img
                                            src={post.image_url}
                                            alt={post.title}
                                            className="lg:min-h-48 md:max-h-28 sm:max-h-36 min-w-full"
                                            loading="lazy"
                                        />
                                    )}
                                </div>
                                <div className="date">
                                    {new Date(post.date_created).toLocaleDateString(locale)}
                                    {isWithinThreeDaysOrToday(post.date_updated || post.date_created) && (
                                        <span
                                            title={`Пост обновлён ${new Date(
                                                post.date_updated || post.date_created
                                            ).toLocaleDateString(locale)}`}
                                            className="text-red-500 font-bold date-updated ml-2"
                                        >
                      {new Date(
                          post.date_updated || post.date_created
                      ).toLocaleDateString(locale)}
                    </span>
                                    )}
                                </div>
                                <h4 className="title">{post.title}</h4>
                            </a>
                            <ul className="post-tags">
                                {post.tags
                                    ?.filter((t) => t.tags_id?.status === "published")
                                    .map((t) => (
                                        <a
                                            key={t.id}
                                            className={`post-tag-item tag-item-${t.tags_id.color}`}
                                            href={hrefForTag(post.lang, t.tags_id)}
                                        >
                                            <span>#</span>
                                            {t.tags_id.name?.toLowerCase()}
                                        </a>
                                    ))}
                            </ul>
                        </article>
                    </li>
                ))}
            </ul>
        </div>
    );
}