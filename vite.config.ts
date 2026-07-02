import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// 디자인 문서: taekyung-works-design-direction.md / -design-system.md / IMPLEMENTATION.md
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
