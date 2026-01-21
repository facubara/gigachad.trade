/**
 * Simple in-memory cache for API responses.
 * Stores last known value for graceful degradation.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      // Expired, but don't delete - keep for fallback
      return null;
    }

    return entry.value;
  }

  /**
   * Get the last known value even if expired.
   * Used for graceful degradation when external APIs fail.
   */
  getStale<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    return entry?.value ?? null;
  }

  set<T>(key: string, value: T, ttlMs: number): void {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }
}

// Singleton instance
export const memoryCache = new MemoryCache();
