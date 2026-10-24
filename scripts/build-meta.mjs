// 빌드 후 실행: 상세 페이지별 링크 미리보기(Open Graph) HTML을 만든다.
// SPA라 미리보기 수집기는 JS를 실행하지 않으므로, dist/projects/<key>.html에 페이지별 제목·설명을 박아 둔다.
// GitHub Pages는 /projects/<key> 요청에 <key>.html을 내준다. 나머지 경로는 404.html(=index.html)이 받는다.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const DIST = join(ROOT, 'dist')
const SITE = 'https://park-taegeun.github.io'
const src = readFileSync(join(ROOT, 'src/data/projects.ts'), 'utf8')
const index = readFileSync(join(DIST, 'index.html'), 'utf8')

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const blocks = [...src.matchAll(/key: '([a-z-]+)',\n\s+tier:[\s\S]*?og: \{\s*title: '([^']+)',\s*description: '([^']+)',/g)]
if (blocks.length === 0) {
  console.error('build-meta: projects.ts에서 og 항목을 찾지 못했습니다')
  process.exit(1)
}
mkdirSync(join(DIST, 'projects'), { recursive: true })
for (const [, key, title, desc] of blocks) {
  const url = `${SITE}/projects/${key}`
  const html = index
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*"/, `$1${esc(desc)}"`)
    .replace(/(<meta property="og:title" content=")[^"]*"/, `$1${esc(title)}"`)
    .replace(/(<meta property="og:description" content=")[^"]*"/, `$1${esc(desc)}"`)
    .replace(/(<meta property="og:url" content=")[^"]*"/, `$1${url}"`)
    .replace(/(<meta name="twitter:title" content=")[^"]*"/, `$1${esc(title)}"`)
    .replace(/(<meta name="twitter:description" content=")[^"]*"/, `$1${esc(desc)}"`)
  writeFileSync(join(DIST, 'projects', `${key}.html`), html)
}
console.log(`build-meta: 상세 미리보기 ${blocks.length}개 (${blocks.map((b) => b[1]).join(', ')})`)
