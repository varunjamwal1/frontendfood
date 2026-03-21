// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss(),
//   ],
//   optimizeDeps: {
//     include: ["recharts"],
//   },
//   build: {
//     modulePreload: {
//       // Prevents Vite from injecting '<link rel="modulepreload">' for lazy loaded chunks
//       resolveDependencies: () => [],
//     },
//   },
// });
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    include: ["recharts"],
  },
  build: {
    modulePreload: {
      // Prevents Vite from injecting '<link rel="modulepreload">' for lazy loaded chunks
      resolveDependencies: () => [],
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', 'react-hot-toast']
        }
      }
    }
  },
});