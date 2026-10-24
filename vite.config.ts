import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// 디자인 문서: taekyung-works-design-direction.md / -design-system.md / IMPLEMENTATION.md
// 라이브러리는 따로 묶어 캐시가 오래 가게 하고(사이트 문장만 바뀌면 라이브러리는 다시 받지 않음),
// 상세 페이지는 App.tsx에서 lazy로 나눈다.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        advancedChunks: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/ },
            { name: 'motion', test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/ },
            { name: 'gsap', test: /node_modules[\\/](gsap|lenis)[\\/]/ },
          ],
        },
      },
    },
  },
})
