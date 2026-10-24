// 사이트 문장 규칙 자동 검사(빌드 전에 실행). 규칙을 사람이 매번 점검하면 결국 새므로 빌드가 막는다.
// 검사: 긴 줄표, 금지 표현, 내부 용어, 학교명·개인 경로, 철회·정정된 수치, 조건 없는 결과 행,
//       없는 이미지 경로, 작은 글씨 명도 대비, 장식 전용 색의 본문 사용.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const SRC = join(ROOT, 'src')

const walk = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n)
    return statSync(p).isDirectory() ? walk(p) : [p]
  })

/** 주석을 지우되 줄 번호는 유지 */
function stripComments(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:'"`\\])\/\/.*$/gm, (m, pre) => pre + ' '.repeat(m.length - pre.length))
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, (m) => m.replace(/[^\n]/g, ' '))
}

const RULES = [
  { name: '긴 줄표(em/en dash)', re: /[—–―‒]/ },
  { name: '단정 종결', re: /(확인했습니다|배웠습니다|깨달았습니다)/ },
  { name: '과장·금지 표현', re: /(혼자 설계|혼자 구현|직접 구현|전 계층을 혼자|단독 설계|바이브 코딩|과 수석|전체 수석|5초 보장|15초 보장|옆집 차단|완벽 차단|정확도 향상|실서비스 수준|LangChain|규명|오디오와 상관없는 문장|사람이 목소리를 따랐)/ },
  { name: '내부 용어', re: /(층1|층2|\bplac(_cross)?\b|Masking|Congruent|audio-gap|ToneTracker|RMSNorm|embed_audio|audio_tower|\bnb\d+|\bp15\b|\bKL\b|presence 게이트|single writer)/ },
  { name: '학교명·개인 경로', re: /(서경|skuit|\/home\/xorms|Users\/xorms|주민등록)/ },
  { name: '철회·정정된 수치', re: /(\+2\.11|\+6\.57|0\.024|0\.128 → 0\.755|96\.30|70\.5%)/ },
  { name: '조건 없는 결과 행', re: /cond:\s*''/ },
  { name: '장식 전용 색을 글자에 사용(#8A93A3)', re: /text-text-faint/ },
]

const problems = []
const files = [...walk(SRC).filter((f) => /\.(tsx?|css)$/.test(f)), join(ROOT, 'index.html')]
for (const file of files) {
  const raw = readFileSync(file, 'utf8')
  const code = file.endsWith('.html') ? raw.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ' ')) : stripComments(raw)
  const lines = code.split('\n')
  lines.forEach((line, i) => {
    for (const r of RULES) {
      // 정규식 소스 안의 줄표 문자 클래스(제목 정리 함수)는 예외
      if (r.name.startsWith('긴 줄표') && /\\u2014/.test(line)) continue
      const m = line.match(r.re)
      if (m) problems.push(`${relative(ROOT, file)}:${i + 1}  [${r.name}] 「${m[0]}」  ${line.trim().slice(0, 90)}`)
    }
  })
  // 이미지 경로
  for (const m of raw.matchAll(/["'`](\/images\/[^"'`\s)]+)["'`]/g)) {
    if (!existsSync(join(ROOT, 'public', m[1]))) problems.push(`${relative(ROOT, file)}  [없는 이미지] ${m[1]}`)
  }
}

// 명도 대비: 작은 글씨에 쓰는 토큰은 배경 대비 4.5:1 이상
const css = readFileSync(join(SRC, 'index.css'), 'utf8')
const token = (name) => css.match(new RegExp(`--color-${name}:\\s*(#[0-9A-Fa-f]{6})`))?.[1]
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}
const PAIRS = [
  ...['text-sub', 'text-muted', 'navy', 'ink'].flatMap((fg) => ['base', 'panel', 'soft'].map((bg) => [fg, bg])),
  ['signal', 'base'],
  ['signal', 'panel'],
  ['signal-deep', 'signal-soft'],
]
for (const [fg, bg] of PAIRS) {
  const f = token(fg)
  const b = token(bg)
  if (!f || !b) {
    problems.push(`src/index.css  [명도 대비] 토큰 없음: ${fg} / ${bg}`)
    continue
  }
  const r = ratio(f, b)
  if (r < 4.5) problems.push(`src/index.css  [명도 대비] ${fg} on ${bg} = ${r.toFixed(2)}:1 (< 4.5)`)
}

if (problems.length) {
  console.error(`문장·자산 규칙 위반 ${problems.length}건:\n` + problems.map((p) => '  ' + p).join('\n'))
  process.exit(1)
}
console.log(`check-content: ${files.length}개 파일, 규칙 ${RULES.length + 2}종 통과`)
