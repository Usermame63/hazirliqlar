import withNextIntl from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true, // Bu sətir dil dəyişdirmə zamanı 404 xətasını qəti şəkildə aradan qaldırır!
};

export default withNextIntl(nextConfig);