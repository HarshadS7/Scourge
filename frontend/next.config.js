/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      'pino-pretty': false,
      encoding: false,
      '@react-native-async-storage/async-storage': false,
    };
    
    if (!isServer) {
      config.externals.push('pino-pretty', 'lokijs', 'encoding', '@react-native-async-storage/async-storage');
    }
    
    // Ignore warnings for optional dependencies
    config.ignoreWarnings = [
      /node_modules\/@react-native-async-storage/,
      /node_modules\/pino-pretty/,
      /Can't resolve '@react-native-async-storage\/async-storage'/,
    ];
    
    return config;
  },
};

module.exports = nextConfig;
