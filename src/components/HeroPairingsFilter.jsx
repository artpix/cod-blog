import { useState, useMemo } from "react";
import { useTranslations } from '../i18n/utils';
import { getAssetURL } from '../lib/assets';

function hrefForPairing(p, lang) {
    // всегда от корня сайта
    return lang === 'ru' || lang === undefined
        ? `/hero-pairings/${p.slug}/`
        : `/${lang}/hero-pairings/${p.slug}/`;
}

export default function HeroPairingsFilter({ heroPairings, lang }) {
    const [hero, setHero] = useState("");
    const [tier, setTier] = useState("");
    const [tag, setTag] = useState("");

    const t = useTranslations(lang);

    const resetFilters = () => {
        setHero("");
        setTier("");
        setTag("");
    };

    const filtered = useMemo(() => {
        return heroPairings.filter((p) => {
            const heroMatch =
                hero === "" ||
                p.hero_1?.name === hero ||
                p.hero_2?.name === hero;
            const tierMatch = tier === "" || p.tier?.name === tier;
            const tagMatch =
                tag === "" ||
                (p.tags || []).some((t) => t.tags_id?.name === tag);
            return heroMatch && tierMatch && tagMatch;
        });
    }, [hero, tier, tag, heroPairings]);

    const heroes = [...new Set(heroPairings.flatMap(p => [p.hero_1?.name, p.hero_2?.name]).filter(Boolean))];
    const tiers = [...new Set(heroPairings.map(p => p.tier?.name).filter(Boolean))];
    const tags = [...new Set(heroPairings.flatMap(p => p.tags?.map(t => t.tags_id?.name) || []))];

    return (
        <div className="space-y-6">
            {/* Фильтры */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                <select value={hero} onChange={(e) => setHero(e.target.value)} className="border p-2 rounded text-sm">
                    <option value="">{t('pairingFilter.heroes')}</option>
                    {heroes.map((h) => (
                        <option key={h} value={h}>{h}</option>
                    ))}
                </select>

                <select value={tier} onChange={(e) => setTier(e.target.value)} className="border p-2 rounded text-sm">
                    <option value="">{t('pairingFilter.tier')}</option>
                    {tiers.map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>

                <select value={tag} onChange={(e) => setTag(e.target.value)} className="border p-2 rounded text-sm">
                    <option value="">{t('pairingFilter.tag')}</option>
                    {tags.map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>

                <button
                    onClick={resetFilters}
                    className="border px-3 py-2 rounded text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 w-full md:w-auto"
                >
                    {t('filter.reset')}
                </button>
            </div>

            {/* Карточки */}
            <ul className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filtered.map((pairing) => (
                    <li key={pairing.id} className="bg-white rounded-sm shadow-lg overflow-hidden transition hover:shadow-xl">
                        <a href={hrefForPairing(pairing, lang)} className="block p-4">
                            <div className="flex justify-center relative mb-4">
                                <img
                                    src={getAssetURL(pairing.hero_1.avatar)}
                                    alt={pairing.hero_1.name}
                                    className="rounded-lg z-10 relative w-20 h-20 object-cover"
                                />
                                <img
                                    src={getAssetURL(pairing.hero_2.avatar)}
                                    alt={pairing.hero_2.name}
                                    className="rounded-lg z-0 relative -ml-6 w-20 h-20 object-cover"
                                />
                            </div>
                            <div className="text-center">
                                <h4 className="text-base font-semibold text-gray-800 line-clamp-2">{pairing.title}</h4>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-400 mt-4 border-t pt-2">
                                <span className="text-xs font-semibold text-[#d4220f]">{pairing.tier?.name}</span>
                                <div className="flex text-yellow-400 text-sm">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i}>{(pairing.rating ?? 0) > i ? "★" : "☆"}</span>
                                    ))}
                                </div>
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}