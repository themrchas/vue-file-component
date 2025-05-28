/*import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        // Tell Vue to treat any tag starting with 'v-' as a custom element
        // This prevents Vue from trying to resolve them as normal Vue components
        isCustomElement: (tag) => tag.startsWith('v-') || tag.includes('-'), // Add tag.includes('-') for other custom elements if you have them
      },
    },
  })],
})
  */
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})