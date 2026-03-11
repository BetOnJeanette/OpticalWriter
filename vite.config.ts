import suidPlugin from "@suid/vite-plugin";
import { defineConfig } from "vite";
import { playwright } from "@vitest/browser-playwright"
import solid from "vite-plugin-solid";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
	plugins: [suidPlugin(), solid()],

	// Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
	//
	// 1. prevent Vite from obscuring rust errors
	clearScreen: false,
	// 2. tauri expects a fixed port, fail if that port is not available
	server: {
		port: 1420,
		strictPort: true,
		host: host || false,
		hmr: host
			? {
					protocol: "ws",
					host,
					port: 1421,
				}
			: undefined,
		watch: {
			// 3. tell Vite to ignore watching `src-tauri`
			ignored: ["**/src-tauri/**"],
		},
	},
    test: {
        browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
        },
    },  
    define: {
        // solid-testing-library relies on "process" which is not shimmed by default
        'process.env.STL_SKIP_AUTO_CLEANUP': 'false'
    },
}));
