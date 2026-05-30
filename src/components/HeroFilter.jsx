import { useState, useEffect } from "react";
import { useTranslations } from '../i18n/utils';

function hrefForPost(h) {
    // всегда от корня сайта
    return h.lang === 'ru'
        ? `/heroes/${h.slug}/`
        : `/${h.lang}/heroes/${h.slug}/`;
}

export default function HeroFilter({ heroes, lang }) {
    const [filtered, setFiltered] = useState(heroes);
    const [filters, setFilters] = useState({
        type: "",
        faction: "",
        tier: "",
        tree: "",
    });

    useEffect(() => {
        const result = heroes.filter((hero) => {
            const matchType = filters.type ? hero.type?.value === filters.type : true;
            const matchFaction = filters.faction ? hero.faction?.value === filters.faction : true;
            const matchTier = filters.tier ? hero.tier_list?.name === filters.tier : true;
            const matchTree = filters.tree
                ? hero.trees?.some(t => t.talent_trees_id?.value === filters.tree)
                : true;

            return matchType && matchFaction && matchTier && matchTree;
        });
        setFiltered(result);
    }, [filters]);

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const resetFilters = () => {
        setFilters({
            type: "",
            faction: "",
            tier: "",
            tree: "",
        });
    };
    const t = useTranslations(lang);
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
                <select name="type" onChange={handleChange} value={filters.type} className="border p-2 rounded text-sm">
                    <option value="">{t('rarity.placeholder')}</option>
                    <option value="legendary">{t('rarity.legendary')}</option>
                    <option value="epic">{t('rarity.epic')}</option>
                    <option value="elite">{t('rarity.elite')}</option>
                </select>

                <select name="faction" onChange={handleChange} value={filters.faction} className="border p-2 rounded text-sm">
                    <option value="">{t('faction.placeholder')}</option>
                    <option value="league-of-order">{t('faction.league-of-order')}</option>
                    <option value="springwardens">{t('faction.springwardens')}</option>
                    <option value="wilderburg">{t('faction.wilderburg')}</option>
                </select>

                <select name="tier" onChange={handleChange} value={filters.tier} className="border p-2 rounded text-sm">
                    <option value="">{t('tier.placeholder')}</option>
                    <option value="S+">S+</option>
                    <option value="S">S</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                </select>

                <select name="tree" onChange={handleChange} value={filters.tree} className="border p-2 rounded text-sm">
                    <option value="">{t('class.placeholder')}</option>
                    <option value="infantry">{t('class.infantry')}</option>
                    <option value="magic">{t('class.magic')}</option>
                    <option value="marksman">{t('class.marksman')}</option>
                </select>

                <button
                    onClick={resetFilters}
                    className="border px-3 py-2 rounded text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 w-full md:w-auto"
                >
                    {t('filter.reset')}
                </button>
            </div>

            <ul className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 articles">
                {filtered.map((hero) => (
                    <li key={hero.id} className="bg-white rounded-sm shadow-lg overflow-hidden transition hover:shadow-xl relative">
                        <article className="article-card">
                            <span
                                style={{
                                    position: "absolute",
                                    width: "24px",
                                    height: "24px",
                                    backgroundImage: `url(${hero.faction_url})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    left: "15px",
                                    top: "15px",
                                }}
                            ></span>
                            <a href={hrefForPost(hero)} className="block p-4">
                                <div className="flex justify-center mb-4">
                                    <img
                                        src={hero.avatar_url}
                                        alt={hero.name}
                                        width="80"
                                        height="80"
                                        className="rounded-lg"
                                    />
                                </div>
                                <div className="text-center article-card-heading">
                                    <h4 className="text-base font-semibold text-gray-800">{hero.name}</h4>
                                    <p className="text-sm text-gray-500 mt-1 article-card-rarity" title={hero.type?.value}>{t(`rarity.${hero.type?.value}`)}</p>
                                </div>
                            </a>
                        </article>
                    </li>
                ))}
            </ul>
        </div>
    );
}