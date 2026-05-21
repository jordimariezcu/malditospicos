import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';
import keystatic from '@keystatic/astro';

export default defineConfig({
  site: 'https://www.malditospicos.com',
  trailingSlash: 'ignore',
  output: 'hybrid',
  adapter: vercel({ nodeVersion: '20' }),
  integrations: [
    mdx(),
    sitemap({
      serialize(item) {
        // Use updatedDate or pubDate from frontmatter if available via URL pattern
        // lastmod defaults to build time for pages without explicit dates
        item.lastmod = item.lastmod ?? new Date().toISOString();
        // Reduce changefreq noise — Google ignores it but it keeps the sitemap clean
        if (item.url.match(/\/(gomas|maderas|palas|tecnica|guias|jugadores|materiales|recursos)\/[^/]+\//)) {
          item.changefreq = 'monthly';
          item.priority = 0.8;
        } else if (item.url.match(/\/(gomas|maderas|palas|tecnica|guias|jugadores|materiales|recursos)\/$/)) {
          item.changefreq = 'weekly';
          item.priority = 0.9;
        } else {
          item.changefreq = 'monthly';
          item.priority = 0.7;
        }
        return item;
      },
    }),
    react(),
    keystatic(),
  ],
});
