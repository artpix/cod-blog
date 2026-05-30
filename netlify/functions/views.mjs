import { createDirectus, rest, staticToken, readItems, createItem, updateItem } from '@directus/sdk';

const directus = createDirectus(process.env.DIRECTUS_URL)
    .with(staticToken(process.env.DIRECTUS_TOKEN))
    .with(rest());

export default async (req, context) => {
    const slug = context.params?.slug;
    if (!slug) {
        return new Response('Missing slug', { status: 400 });
    }

    try {
        const posts = await directus.request(
            readItems('posts', {
                filter: { slug: { _eq: slug } },
                fields: ['id'],
                limit: 1,
            })
        );

        const post = posts?.[0];
        if (!post) {
            return new Response('Post not found', { status: 404 });
        }

        const existingViews = await directus.request(
            readItems('views', {
                filter: { post_id: { _eq: post.id } },
                limit: 1,
            })
        );

        if (existingViews.length > 0) {
            const view = existingViews[0];
            const updated = await directus.request(
                updateItem('views', view.id, {
                    count: (view.count ?? 0) + 1,
                })
            );
            return Response.json({ success: true, views: updated.count });
        }

        await directus.request(
            createItem('views', {
                post_id: post.id,
                count: 1,
            })
        );
        return Response.json({ success: true, views: 1 });
    } catch (err) {
        console.error(err);
        return new Response('Error updating views', { status: 500 });
    }
};

export const config = {
    path: '/api/views/:slug',
};
