// next.config.js
module.exports = {
  env: {
    customKey: "my-value",
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  experimental: {
    esmExternals: false,
  },
  transpilePackages: ["@itheum/sdk-mx-data-nft", "@multiversx/sdk-dapp", "dotenv", "next", "openai", "react", "react-dom"],
};
