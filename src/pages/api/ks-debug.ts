export const prerender = false;
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const clientId = process.env.KEYSTATIC_GITHUB_CLIENT_ID ?? '';
  const clientSecret = process.env.KEYSTATIC_GITHUB_CLIENT_SECRET ?? '';
  const secret = process.env.KEYSTATIC_SECRET ?? '';
  const code = url.searchParams.get('code') || 'fake_' + Date.now();

  const tokenUrl = new URL('https://github.com/login/oauth/access_token');
  tokenUrl.searchParams.set('client_id', clientId);
  tokenUrl.searchParams.set('client_secret', clientSecret);
  tokenUrl.searchParams.set('code', code);

  let tokenData: unknown = null;
  try {
    const res = await fetch(tokenUrl, { method: 'POST', headers: { Accept: 'application/json' } });
    tokenData = await res.json();
  } catch (e) {
    tokenData = { error: String(e) };
  }

  return new Response(JSON.stringify({
    clientId_prefix: clientId.substring(0, 8),
    clientId_len: clientId.length,
    clientSecret_suffix: clientSecret.slice(-4),
    clientSecret_len: clientSecret.length,
    secret_set: secret.length > 0,
    github_response: tokenData,
  }, null, 2), { headers: { 'Content-Type': 'application/json' } });
};
