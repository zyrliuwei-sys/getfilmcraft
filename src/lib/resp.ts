export function respData(data: any, init?: ResponseInit) {
  return respJson(0, 'ok', data ?? [], init);
}

export function respOk(init?: ResponseInit) {
  return respJson(0, 'ok', undefined, init);
}

export function respErr(message: string, init?: ResponseInit) {
  const status =
    init?.status ??
    (message === 'Unauthorized' ? 401 : message === 'Forbidden' ? 403 : 400);
  // Database/SDK errors can contain SQL parameters and credentials. Preserve
  // deliberate validation messages but never echo infrastructure diagnostics.
  const safeMessage =
    /(?:Failed query:|SQLITE_|D1_ERROR|ECONN|postgres:\/\/|mysql:\/\/|Bearer\s|stack trace)/i.test(
      message
    )
      ? 'Internal error'
      : message;
  return respJson(-1, safeMessage, undefined, { ...init, status });
}

export function respPage(items: any[], total: number) {
  return respJson(0, 'ok', { items, total });
}

export function respJson(
  code: number,
  message: string,
  data?: any,
  init?: ResponseInit
) {
  let json: Record<string, any> = {
    code: code,
    message: message,
  };
  if (data !== undefined) {
    json['data'] = data;
  }
  const headers = new Headers(init?.headers);
  // Responses can include API keys or account information. Never let a CDN
  // or browser cache the common API envelope.
  if (!headers.has('Cache-Control')) headers.set('Cache-Control', 'no-store');
  return Response.json(json, { ...init, headers });
}
