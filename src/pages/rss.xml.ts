import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const collections = ['gomas','maderas','palas','tecnica','guias','jugadores','materiales','recursos'] as const;
  const allPosts = (await Promise.all(
    collections.map(async (col) => {
      const posts = await getCollection(col);
      return posts.map(p => ({ ...p, collection: col }));
    })
  )).flat()
    .filter(p => !p.data.draft)
    .sort((a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime())
    .slice(0, 50);

  return rss({
    title: 'Malditos Picos',
    description: 'Todo sobre el tenis de mesa: gomas, maderas, palas y técnica.',
    site: context.site!,
    items: allPosts.map(post => ({
      title: post.data.title,
      pubDate: new Date(post.data.pubDate),
      description: post.data.description,
      link: `/${post.collection}/${post.slug}/`,
    })),
    customData: `<language>es</language>`,
  });
}
