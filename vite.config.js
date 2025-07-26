import { defineConfig } from "vite";

export default defineConfig({
	root: "./public",
	server: {
		port: 5173,
		proxy: {
			// Proxy API calls to the express server
			"/api": {
				target: "http://localhost:3001",
				changeOrigin: true,
			},
		},
	},
	build: {
		outDir: "../dist",
		emptyOutDir: true,
	},
});
