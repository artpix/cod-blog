import { useState, useEffect } from "react";
import { useTranslations } from '../i18n/utils';
import { getAssetURL } from '../lib/assets';

export default function ArtifactFilter({ artifacts, lang }) {
    const [filtered, setFiltered] = useState(artifacts);
    const [filters, setFilters] = useState({
        rarity: "",
        tier: "",
    });

    useEffect(() => {
        const result = artifacts.filter((artifact) => {
            const matchRarity = filters.rarity ? artifact.rarity.value === filters.rarity : true;
            const matchTier = filters.tier ? artifact.tier === filters.tier : true;
            return matchRarity && matchTier;
        });
        setFiltered(result);
    }, [filters]);

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const resetFilters = () => {
        setFilters({
            rarity: "",
            tier: "",
        });
    };

    // Уникальные значения для фильтров
    const rarities = [...new Set(artifacts.map(a => a.rarity).filter(Boolean))];
    const tiers = [...new Set(artifacts.map(a => a.tier).filter(Boolean))];
    const t = useTranslations(lang);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-end">
                <select name="rarity" onChange={handleChange} value={filters.rarity} className="border p-2 rounded text-sm">
                    <option value="">{t('filter.rarity')}</option>
                    <option value="legendary">{t('rarity.legendary')}</option>
                    <option value="epic">{t('rarity.epic')}</option>
                    <option value="elite">{t('rarity.elite')}</option>
                </select>

                <select name="tier" onChange={handleChange} value={filters.tier} className="border p-2 rounded text-sm">
                    <option value="">{t('filter.tier')}</option>
                    <option value="s+">S+</option>
                    <option value="s">S</option>
                    <option value="a">A</option>
                    <option value="b">B</option>
                    <option value="c">C</option>
                    <option value="d">D</option>
                </select>

                <button
                    onClick={resetFilters}
                    className="border px-3 py-2 rounded text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 w-full md:w-auto"
                >
                    {t('filter.reset')}
                </button>
            </div>

            <ul className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filtered.map((artifact) => (
                    <li key={artifact.id} className="bg-white rounded-sm shadow-lg overflow-hidden transition hover:shadow-xl">
                        <article className="article-card">
                            <div className="block p-4 text-center">
                                <img
                                    src={getAssetURL(artifact.image)}
                                    alt={artifact.name}
                                    className="h-[160px] object-cover mx-auto mb-2 rounded"
                                />
                                <h4 className="text-base font-semibold text-gray-800">{t(`artifact.${artifact.slug}`)}</h4>
                                <p className="text-sm text-gray-500 mt-1 article-card-rarity" title={artifact.rarity.value}>{t(`rarity.${artifact.rarity.value}`)}</p>
                            </div>
                        </article>
                    </li>
                ))}
            </ul>
        </div>
    );
}