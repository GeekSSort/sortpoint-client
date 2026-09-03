import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Next 16 writes optimized images to `.next/cache/images` and evicts them
     * with an LRU keyed by size on disk. With no value configured it measures
     * free disk space once at startup and budgets HALF of it — on a machine
     * with 150 GB free that is a ~75 GB cache ceiling, and the size arithmetic
     * around it is what throws
     *
     *   LRUCache: calculateSize returned 0, but size must be > 0
     *
     * on every image write (vercel/next.js#89033 — an entry that measures 0
     * could never be evicted, so the cache refuses it). The images still
     * render; only the cache write fails, so it is noise rather than breakage,
     * but it is noise on every request. Not fixed in 16.3.4, whose changes are
     * testmode, TypeScript aliasing and Turbopack crossOrigin.
     *
     * 256 MB is a real ceiling for an app whose images are a logo, two avatars
     * and a handful of product shots. Set this to 0 to disable the disk cache
     * outright if the error survives.
     */
    maximumDiskCacheSize: 256_000_000,
  },
};

export default nextConfig;
