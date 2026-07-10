import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const siteUrl = context.site!.href.replace(/\/$/, '');
  const defaultImage = `${siteUrl}/og-default.png`;

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
    description: 'Análisis de gomas, maderas, palas y técnica de tenis de mesa en español.',
    site: context.site!,
    items: allPosts.map(post => {
      const imageUrl = post.data.image
        ? new URL(post.data.image, context.site!).href
        : defaultImage;
      return {
        title: post.data.title,
        pubDate: new Date(post.data.pubDate),
        description: post.data.description || post.data.title,
        link: `/${post.collection}/${post.slug}/`,
        // enclosure allows Discover and podcast apps to pick up the image
        enclosure: {
          url: imageUrl,
          length: 0,
          type: 'image/png',
        },
        // media:content for wider reader support
        customData: `
          <media:content
            url="${imageUrl}"
            medium="image"
            width="1200"
            height="630"
          />
          <author>malditospicos@gmail.com (Malditos Picos)</author>
          <category>${post.collection}</category>
        `.trim(),
      };
    }),
    customData: `
      <language>es</language>
      <copyright>Malditos Picos ${new Date().getFullYear()}</copyright>
      <managingEditor>malditospicos@gmail.com (Malditos Picos)</managingEditor>
      <image>
        <url>${defaultImage}</url>
        <title>Malditos Picos</title>
        <link>${siteUrl}</link>
      </image>
    `.trim(),
    xmlns: {
      media: 'http://search.yahoo.com/mrss/',
    },
  });
}
