import dotenv from 'dotenv';
dotenv.config();
/** @type {import('next').NextConfig} */

const apiUrl = process.env.NEXT_PUBLIC_FASTAPI_CONNECTION_URL;
const endpointUrl = process.env.NEXT_PUBLIC_ENDPOINT_URL;

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: apiUrl,
        pathname: `/api/*`,
      },
      {
        protocol: "https",
        hostname: endpointUrl,
        pathname: "/v1/**",
      },
    ],
  },
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
      {
        source: "/docs",
        destination: `${apiUrl}/docs`,
      },
      {
        source: "/openapi.json",
        destination: `${apiUrl}/openapi.json`,
      },
    ];
  },
};

export default nextConfig;
