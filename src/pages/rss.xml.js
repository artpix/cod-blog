import rss from '@astrojs/rss';
import {getPosts} from "@lib/api.js";
import {SITE_DESCRIPTION, SITE_TITLE} from "../consts.js";

export async function GET() {
    const posts = await getPosts();

    return rss({
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        site: 'https://codguides.com',
        items: posts.map(post => ({
            title: post.title,
            pubDate: post.date,
            link: `/blog/${post.slug}/`,
            description: post.description
        }))
    });
}