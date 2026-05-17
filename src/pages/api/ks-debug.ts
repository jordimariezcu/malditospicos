export const prerender = false;
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const clientId = process.env.KEYSTATIC_GITHUB_CLIENT_ID ?? '';
  const clientSecret = process.env.KEYSTATIC_GITHUB_CLIENT_SECRET ?? '';
  const secret = process.env.KEYSTATIC_SECRET ?? '';

  // Use real code if GitHub redirected here (as oauth callback), otherwise use fake
  const code = url.searchParams.get('code') || ('fake_debug_code_' + Date.now());
  const isRealCode = !!url.searchParams.get('code');

  const tokenUrl = new URL('https://github.com/login/oauth/access_token');
  tokenUrl.searchParams.set('client_id', clientId);
  tokenUrl.searchParams.set('client_secret', clientSecret);
  tokenUrl.searchParams.set('code', code);

  let tokenStatus = 0;
  let tokenData: unknown = null;
  try {
    const res = await fetch(tokenUrl, { method: 'POST', headers: { Accept: 'application/json' } });
    tokenStatus = res.status;
    tokenData = await res.json();
  } catch (e) {
    tokenData = { fetchError: String(e) };
  }

  return new Response(JSON.stringify({
    clientId_prefix: clientId.substring(0, 8),
    clientId_len: clientId.length,
    clientSecret_suffix: clientSecret.slice(-8),
    clientSecret_len: clientSecret.length,
    secret_set: secret.length > 0,
    code_type: isRealCode ? 'REAL' : 'FAKE',
    token_http_status: tokenStatus,
    full_github_response: tokenData,
  }, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
};
