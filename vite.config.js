import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import obfuscator from "rollup-plugin-obfuscator";
import viteCompression from "vite-plugin-compression"; // Import plugin kompresi

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    // 1. KOMPRESI FILE (Biar ukuran file js/css jadi mini banget)
    viteCompression({
      algorithm: "brotliCompress", // Kompresi tingkat tinggi
      ext: ".br",
      threshold: 10240, // Hanya kompres file di atas 10kb
      deleteOriginFile: false, // File asli tetep ada buat backup
    }),

    // 2. OBFUSCATOR (Settingan 'Safe Mode' biar gak lemot di HP kentang)
    obfuscator({
      apply: "build",
      options: {
        compact: true,
        controlFlowFlattening: false, // MATIKAN (Berat)
        deadCodeInjection: false, // MATIKAN (Bikin file bengkak)
        debugProtection: false,
        disableConsoleOutput: true,
        identifierNamesGenerator: "hexadecimal",
        log: false,
        numbersToExpressions: false, // MATIKAN (Berat buat math)
        renameGlobals: false,
        rotateStringArray: true,
        selfDefending: false,
        shuffleStringArray: true,
        splitStrings: false, // MATIKAN (Bikin file bengkak parah)
        stringArray: true,
        stringArrayEncoding: [],
        stringArrayThreshold: 0.75,
        unicodeEscapeSequence: false,
      },
    }),
  ],

  // 3. BUILD OPTIMIZATION
  build: {
    target: "esnext", // Pakai fitur JS modern (file lebih kecil & cepet)
    minify: "esbuild", // Minifier paling ngebut saat ini
    cssCodeSplit: true, // CSS dipecah per halaman (gak load semua di awal)
    sourcemap: false, // Hapus peta kode di production (hemat size & lebih aman)
    chunkSizeWarningLimit: 1000, // Batas warning diperbesar dikit

    // 4. MANUAL CHUNKING (Memecah file vendor raksasa jadi kecil-kecil)
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Pisahin Core React
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router-dom")
            ) {
              return "vendor-react";
            }
            // Pisahin Supabase
            if (id.includes("@supabase")) {
              return "vendor-supabase";
            }
            // Pisahin GSAP (Animasi)
            if (id.includes("gsap")) {
              return "vendor-gsap";
            }
            // Sisanya masuk ke vendor umum
            return "vendor-utils";
          }
        },
      },
    },
  },
});
