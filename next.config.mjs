/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
    // },
    // images: {
    //   remotePatterns: [
    //     {
    //       protocol: "https",
    //       hostname: "randomuser.me",
    //       pathname: "/api/portraits/**",
    //     },
    //   ],
    // },    ///////////////////vercel deploy
  },
};

export default nextConfig;
