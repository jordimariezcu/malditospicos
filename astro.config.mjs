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
  integrations: [mdx(), sitemap(), react(), keystatic()],
});
