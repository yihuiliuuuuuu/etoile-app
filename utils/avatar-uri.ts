/** Same file path is reused for avatars — bump query so Image reloads after overwrite. */
export function withAvatarCacheBuster(uri: string): string {
  const base = uri.split('?')[0];
  return `${base}?v=${Date.now()}`;
}

export function stripUriQuery(uri: string): string {
  return uri.split('?')[0];
}
