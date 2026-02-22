/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      'pino-pretty': false,
      encoding: false,
    };
    
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    
    // Ignore warnings for optional dependencies
    config.ignoreWarnings = [
      { module: /node_modules\/@react-native-async-storage/ },
      { module: /node_modules\/pino-pretty/ },
    ];
    
    return config;
  },
};

module.exports = nextConfig;
