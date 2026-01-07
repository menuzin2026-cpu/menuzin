/**
 * Helper function to get image URL with R2 fallback
 * Prioritizes R2 URL, falls back to old media ID URL
 */
export function getImageUrl(r2Url?: string | null, mediaId?: string | null): string | null {
  if (r2Url) {
    return r2Url
  }
  if (mediaId) {
    return `/assets/${mediaId}`
  }
  return null
}

