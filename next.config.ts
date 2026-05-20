import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  //basePath: "/FMYDHUB",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/", destination: "/FMYDHUB", basePath: false, permanent: false },
      { source: "/checkout", destination: "/FMYDHUB/checkout", basePath: false, permanent: false },
      { source: "/marketplace", destination: "/FMYDHUB/marketplace", basePath: false, permanent: false },
      { source: "/gallery", destination: "/FMYDHUB/gallery", basePath: false, permanent: false },
      { source: "/pre", destination: "/FMYDHUB/pre", basePath: false, permanent: false },
      { source: "/admin/:path*", destination: "/FMYDHUB/admin/:path*", basePath: false, permanent: false },
    ];
  },
};

export default nextConfig;
