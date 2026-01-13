import type { NextConfig } from "next";

// GitHub Pages veya alt dizin dağıtımı için taban yolunu env'den alıyoruz.
// Örn: repo adın "mitoloji-oyunu" ise NEXT_PUBLIC_BASE_PATH="/mitoloji-oyunu"
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
