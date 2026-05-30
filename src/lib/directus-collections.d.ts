import type { ID } from '@directus/sdk';

export type MenuCollection = {
    id: ID;
    parent_id: number;
    position: number;
    name: string;
    slug: string;
    path: string;
    is_new: boolean;
    status: 'published' | 'draft' | 'archived';
    translations: MenuTranslationCollection[];
}

export type MenuTranslationCollection = {
    id: ID;
    name: string;
    title: string;
    languages_code: string;
}

export type PostCollection = {
    id: ID;
    title: string;
    slug: string;
    image: {id};
    tags: {
        tags_id: TagCollection[];
    }[];
    heroes: {
        heroes_id: HeroCollection[];
    }[];
    author?: number;
    source?: string;
    description: string;
    body?: string;
    status: 'published' | 'draft' | 'archived';
    date_created: Date;
    date_updated: Date;
    related_posts: {
        posts_id: PostCollection[]
    }[];
    translations: PostTranslationCollection[];
};

export type PostTranslationCollection = {
    id: ID;
    languages_code: string;
    title: string;
    description: string;
    body?: string;
}

export type HeroCollection = {
    id: ID;
    name: string;
    slogan: string;
    slug: string;
    trees: {
        talent_trees_id: TalentTreesCollection[ID];
    }[];
    type: {
        id: ID;
        name: string;
        value: string;
    };
    faction: {
        id: ID;
        name: string;
        value: string;
        emblem: {id};
    };
    race: {
        id: ID;
        name: string;
        value: string;
    };
    tier_list: {
        id: ID;
        position: number;
        name: string;
        description: string;
    };
    avatar: {id};
    description: string;
    body?: string;
    status: 'published' | 'draft' | 'archived';
    date_created: Date;
    date_updated: Date;
    translations: HeroTranslationCollection[];
};

export type HeroTranslationCollection = {
    id: ID;
    languages_code: string;
    name: string;
    slogan: string;
    title?: string;
    description: string;
    body?: string;
}

export type PageCollection = {
    id: ID;
    title: string;
    slug: string;
    image: {id};
    description: string;
    body?: string;
    status: 'published' | 'draft' | 'archived';
    date_created: Date;
    date_updated: Date;
    translations: PageTranslationCollection[];
};

export type PageTranslationCollection = {
    id: ID;
    languages_code: string;
    title: string;
    description: string;
    body?: string;
}

export type TagCollection = {
    id: ID;
    //name: string;
    slug: string;
    //description?: string;
    //body?: string;
    translations: TagTranslationCollection[];
    status: 'published' | 'draft' | 'archived';
    date_created: Date;
    date_updated: Date;
};

export type TagTranslationCollection = {
    id: ID;
    name: string;
    description: string;
    text: string;
    languages_code: string;
}

export type RaceCollection = {
    id: ID;
    name: string;
    value: string;
}

export type TypeCollection = {
    id: ID;
    name: string;
    value: string;
}

export type FactionCollection = {
    id: ID;
    name: string;
    value: string;
    emblem: {id};
}

export type TalentTreesCollection = {
    id: ID;
    position: number;
    name: string;
    value: string;
}

export type HeroesTierListCollection = {
    id: ID;
    position: number;
    name: string;
    description: string;
    tier_list: {
        id: HeroCollection[ID];
        name: string
    }[];
}

export type RarityCollection = {
    id: ID;
    name: string;
    value: string;
}

export type ArtifactCollection = {
    id: ID;
    name: string;
    slug: string;
    rarity: {
        rarity_id: RarityCollection[];
    };
    tier: string;
    image: {ID};
    icon: {ID};
    status: 'published' | 'draft' | 'archived';
}

export type FilesPairingCollection = {
    id: ID;
    name: string;
    slug: string;
}

/** hero_pairings as returned with pairingFields (flattened M2O heroes, not nested heroes_id[]) */
export type HeroPairingPageData = {
    title: string;
    description: string;
    body: string;
    hero_1: Pick<HeroCollection, 'name' | 'avatar'>;
    hero_2: Pick<HeroCollection, 'name' | 'avatar'>;
    screenshots?: {
        directus_files_id: string;
    }[];
    date_created: Date;
    date_updated?: Date | null;
};

export type PairingCollection = {
    id: ID;
    title: string;
    slug: string;
    description: string;
    body: string;
    screenshots: {
        screenshot_id: FilesPairingCollection[];
    };
    hero_1: {
        heroes_id: HeroCollection[];
    };
    hero_2: {
        heroes_id: HeroCollection[];
    }
    tags: {
        tags_id: TagCollection[];
    }[];
    tier: {
        tier_id: HeroesTierListCollection[];
    };
    artifact: {
        artifact_id: ArtifactsCollection[];
    };
    rating: number;
    status: 'published' | 'draft' | 'archived';
    date_created: Date;
    date_updated: Date;
}

export type  ViewsCollection = {
    id: ID;
    post_id: number;
    count: number;
}

export type DirectusCollections = {
    menu: MenuCollection[];
    menu_translations: MenuTranslationCollection[];
    posts: PostCollection[];
    posts_translations: PageTranslationCollection[];
    tags: TagCollection[];
    tags_translations: TagTranslationCollection[];
    heroes: HeroCollection[];
    heroes_translations: HeroTranslationCollection[];
    pages: PageCollection[];
    pages_translations: PageTranslationCollection[];
    races: RaceCollection[];
    types: TypeCollection[];
    factions: FactionCollection[];
    talent_trees: TalentTreesCollection[];
    heroes_tier_list: HeroesTierListCollection[];
    hero_pairings: PairingCollection[];
    artifacts: ArtifactCollection[];
    files_pairing: FilesPairingCollection[];
    rarities: RarityCollection[];
    views: ViewsCollection[];
};