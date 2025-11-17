const path = require('path');
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: false,
  },
  webpack: (config, { isServer }) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
      
      // Alias React Native async-storage to a no-op web shim (MetaMask SDK optional dep)
      config.resolve.alias = {
        ...config.resolve.alias,
        '@react-native-async-storage/async-storage': path.resolve(
          __dirname,
          'src/shims/async-storage.ts'
        ),
      };
    }
    
    return config;
  },
};

module.exports = withNextIntl(nextConfig);
