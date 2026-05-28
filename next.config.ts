import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "export",
	basePath: "/arthurs-portfolio",
	assetPrefix: "/arthurs-portfolio/",
	images: {
		unoptimized: true,
	},
	webpack: (config, { dev, isServer }) => {
		// webpack polling so hot reload works inside Docker on Windows
		// only active during dev
		// ignored entirely by "next build"
		if (dev && !isServer) {
			config.watchOptions = { poll: 800, aggregateTimeout: 300 };
		}
		return config;
	},
};

export default nextConfig;
