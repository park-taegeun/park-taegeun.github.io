// velog @xorms 시리즈 편수 → src/data/velog-series.json 동기화 (GitHub Actions 예약 실행).
// 어떤 실패든 기존 파일을 그대로 두고 exit 0 — 스테일이 빈값보다 낫다.
// 쿼리는 v2.velog.io/graphql 실호출로 검증: userSeriesList·posts_count는 없고 seriesList + series_posts 길이로 센다.
import { readFileSync, writeFileSync } from 'node:fs'

const FILE = new URL('../src/data/velog-series.json', import.meta.url)
const QUERY = `query SeriesList($username: String) {
  seriesList(username: $username) { name series_posts { post { released_at } } }
}`

const keep = (why) => {
  console.log(`keep existing velog-series.json: ${why}`)
  process.exit(0)
}

let list
try {
  const res = await fetch('https://v2.velog.io/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0 (portfolio-sync)' },
    body: JSON.stringify({
      operationName: 'SeriesList',
      variables: { username: 'xorms' },
      query: QUERY,
    }),
    signal: AbortSignal.timeout(20000),
  })
  if (res.status !== 200) keep(`HTTP ${res.status}`)
  list = (await res.json())?.data?.seriesList
} catch (e) {
  keep(e.message)
}
if (!Array.isArray(list) || list.length === 0) keep('empty series list')

const data = JSON.parse(readFileSync(FILE, 'utf8'))
const byName = new Map(list.map((s) => [s.name?.trim(), s]))
let matched = 0
for (const entry of Object.values(data.series)) {
  const s = byName.get(entry.name)
  if (!s || !Array.isArray(s.series_posts) || s.series_posts.length === 0) continue
  entry.count = s.series_posts.length
  const last = s.series_posts
    .map((p) => p.post?.released_at)
    .filter(Boolean)
    .sort()
    .at(-1)
  if (last) entry.lastPost = last.slice(0, 10)
  matched++
}
for (const name of byName.keys()) {
  if (!Object.values(data.series).some((e) => e.name === name))
    console.log(`ignore unmapped series: ${name}`)
}
if (matched === 0) keep('no series matched')

// 최근 글 제목·주소(사이트 LOG 섹션의 「최근 글」). 별도 쿼리로 받아, 실패해도 편수 갱신은 그대로 둔다.
const LATEST_QUERY = `query SeriesLatest($username: String) {
  seriesList(username: $username) { name series_posts { post { title url_slug released_at } } }
}`
try {
  const res = await fetch('https://v2.velog.io/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0 (portfolio-sync)' },
    body: JSON.stringify({ operationName: 'SeriesLatest', variables: { username: 'xorms' }, query: LATEST_QUERY }),
    signal: AbortSignal.timeout(20000),
  })
  const latestList = res.status === 200 ? (await res.json())?.data?.seriesList : null
  if (Array.isArray(latestList)) {
    const latestByName = new Map(latestList.map((s) => [s.name?.trim(), s]))
    for (const entry of Object.values(data.series)) {
      const posts = (latestByName.get(entry.name)?.series_posts ?? [])
        .map((p) => p.post)
        .filter((p) => p?.released_at && p?.title && p?.url_slug)
        .sort((a, b) => a.released_at.localeCompare(b.released_at))
      const last = posts.at(-1)
      if (!last) continue
      entry.latestTitle = last.title
      entry.latestUrl = `https://velog.io/@xorms/${encodeURIComponent(last.url_slug)}`
    }
  } else console.log('latest posts: skipped (no data)')
} catch (e) {
  console.log(`latest posts: skipped (${e.message})`)
}

data.updatedAt = new Date().toISOString().replace(/\.\d+Z$/, 'Z')
writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n')
console.log(
  Object.values(data.series)
    .map((e) => `${e.name}: ${e.count}`)
    .join(' / '),
)
