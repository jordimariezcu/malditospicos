/**
 * @astrojs/vercel@7.x hardcodes nodejs18.x which Vercel no longer accepts.
 * This script patches the generated .vc-config.json to use nodejs20.x.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const configPath = join(
  process.cwd(),
  '.vercel/output/functions/_render.func/.vc-config.json'
);

if (!existsSync(configPath)) {
  console.log('[fix-vercel-runtime] Config not found, skipping.');
  process.exit(0);
}

const config = JSON.parse(readFileSync(configPath, 'utf-8'));

if (config.runtime === 'nodejs18.x') {
  config.runtime = 'nodejs20.x';
  writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('[fix-vercel-runtime] Patched runtime: nodejs18.x → nodejs20.x');
} else {
  console.log(`[fix-vercel-runtime] Runtime already ${config.runtime}, no change needed.`);
}
