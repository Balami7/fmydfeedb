import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/FMYDHUB",
  /* config options here */
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
  staticPageGenerationTimeout: 1000,
};

export default nextConfig;
