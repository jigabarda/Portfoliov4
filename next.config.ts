// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "udemy-certificate.s3.amazonaws.com",
      "img-c.udemycdn.com",
      "cdn-icons-png.flaticon.com",
    ],
  },
};

module.exports = nextConfig;
