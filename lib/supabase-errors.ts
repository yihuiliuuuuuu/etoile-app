/** PostgREST error when a table was never created (schema.sql not run). */
export function isSchemaMissingError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const e = error as { code?: string; message?: string };
  return (
    e.code === 'PGRST205' ||
    (typeof e.message === 'string' && e.message.includes('Could not find the table'))
  );
}

export function isAvatarsBucketMissingError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const e = error as { message?: string };
  return typeof e.message === 'string' && e.message.includes('Bucket not found');
}
