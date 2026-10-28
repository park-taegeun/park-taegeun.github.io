import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// 디자인 문서: taekyung-works-design-direction.md / -design-system.md / IMPLEMENTATION.md
// 라이브러리는 따로 묶어 캐시가 오래 가게 하고(사이트 문장만 바뀌면 라이브러리는 다시 받지 않음),
// 상세 페이지는 App.tsx에서 lazy로 나눈다.
// 마무리 섹션의 「마지막 업데이트」 날짜(한국 시간). 배포할 때마다 새로 찍힌다.
const BUILD_DATE = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10).replace(/-/g, '.')

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: { __BUILD_DATE__: JSON.stringify(BUILD_DATE) },
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
