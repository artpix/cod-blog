import { readItems, createItem, updateItem } from '@directus/sdk';
import { client as directus } from '../../../lib/directus';

export async function GET({ params }) {
    const slug = params?.slug;
    if (!slug) {
        return new Response('Missing slug', { status: 400 });
    }

    try {
        // Получаем пост по slug
        const posts = await directus.request(
            readItems('posts', {
                filter: { slug: { _eq: slug } },
                fields: ['id'],
                limit: 1
            })
        );

        const post = posts?.[0];
        if (!post) {
            return new Response('Post not found', { status: 404 });
        }

        // Ищем существующую запись о просмотрах
        const existingViews = await directus.request(
            readItems('views', {
                filter: { post_id: { _eq: post.id } },
                limit: 1
            })
        );

        if (existingViews.length > 0) {
            const view = existingViews[0];
            const updated = await directus.request(
                updateItem('views', view.id, {
                    count: (view.count ?? 0) + 1
                })
            );
            return new Response(JSON.stringify({ success: true, views: updated.count }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            const created = await directus.request(
                createItem('views', {
                    post_id: post.id,
                    count: 1
                })
            );
            return new Response(JSON.stringify({ success: true, views: 1 }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    } catch (err) {
        console.error(err);
        return new Response('Error updating views', { status: 500 });
    }
}