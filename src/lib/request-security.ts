/** Cookie-authenticated API mutations must originate from this site. */
export function isCrossOriginMutation(request: Request): boolean {
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) return false;
  const path = new URL(request.url).pathname.replace(/^\/zh(?=\/)/, '');
  if (!path.startsWith('/api/')) return false;
  // Payment providers authenticate with webhook signatures, not browser cookies.
  if (path.startsWith('/api/payment/notify/')) return false;
  const origin = request.headers.get('origin');
  if (origin) return origin !== new URL(request.url).origin;
  return request.headers.get('sec-fetch-site') === 'cross-site';
}
