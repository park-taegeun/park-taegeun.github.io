// 생각의 기록 (Velog @xorms) — 실측 로그.
// velog는 3개 시리즈로 운영: AI_LAB(음성·LLM 연구) / 졸업작품 기록 / AI 생태계 탐험 로그.
// 전체 나열 대신 각 시리즈에서 문제→판단→검증이 드러나는 대표글만 큐레이션하고,
// 하단 "전체 N편 보기"로 시리즈 전체 링크아웃(편수는 velog-series.json — velog-sync 워크플로가 매일 갱신).
// 카드 제목·설명은 velog 원문을 정제한 표현이며 수치·사실은 velog 실데이터만 사용(지어내기 금지).

import velogSeries from './velog-series.json'

const SERIES_COUNTS: Record<string, { count?: number }> = velogSeries.series
/** JSON 편수, 키가 없으면 fallback */
const seriesCount = (key: string, fallback: number) => `${SERIES_COUNTS[key]?.count ?? fallback}편`

export const VELOG_URL = 'https://velog.io/@xorms'

export const VELOG_PROFILE = {
  displayName: '박태근',
  handle: '@xorms',
  bio: '음성·LLM 실험, 졸업작품의 설계 판단, AI 도구 실험을 날짜와 함께 남깁니다.',
  tags: ['AI', 'LLM', '음성', '검증', '기록'],
}

export type WritingAxis = '음성·LLM 연구' | '졸업작품 띵동' | 'AI 도구 실험'

export const WRITING_AXES: WritingAxis[] = ['음성·LLM 연구', '졸업작품 띵동', 'AI 도구 실험']

/** 시리즈에서 선정한 대표글 카드 1개 */
export interface WritingPost {
  /** velog 실제 제목을 정제한 표시 제목 */
  title: string
  /** 발행일 YYYY.MM.DD (velog 실측) */
  date: string
  /** 실제 velog 글 URL */
  href: string
  /** 왜 이 글이 대표작인지 — 정제된 한 줄(velog 원문 기반, 수치 불변) */
  note: string
}

export interface WritingSeries {
  axis: WritingAxis
  name: string
  /** velog 시리즈 실제 편수(velog @xorms/series 기준) */
  count: string
  blurb: string
  /** 시리즈 전체 URL(velog @xorms/series 실측 slug) */
  href: string
  /** 선정 대표글(3~4편) */
  posts: WritingPost[]
}

export const WRITING_SERIES: WritingSeries[] = [
  {
    axis: '음성·LLM 연구',
    name: 'AI_LAB',
    count: seriesCount('ai-lab', 80),
    blurb: '멀티모달 LLM 음성 연구의 실험 일지입니다. 환각 진단부터 어조 모듈 검증까지의 과정을 날짜별로 기록했습니다.',
    href: 'https://velog.io/@xorms/series/AILAB',
    posts: [
      {
        title: '한국어 ASR 환각 판정 지표와 baseline 진단',
        date: '2026.05.28',
        href: 'https://velog.io/@xorms/LAB-19',
        note: '환각을 판정할 지표부터 다시 정의하고 baseline을 진단했습니다.',
      },
      {
        title: '환각 억제 프롬프트와 예상 밖 결과',
        date: '2026.05.29',
        href: 'https://velog.io/@xorms/LAB-20',
        note: '환각을 줄이려고 넣은 프롬프트가 예상과 반대 결과를 낸 과정을 기록했습니다.',
      },
      {
        title: '오디오·텍스트 결합 통로 파인튜닝 검증',
        date: '2026.06.29',
        href: 'https://velog.io/@xorms/LAB-39',
        note: '오디오가 언어 모델로 들어가는 연결부만 따로 학습해 검증했습니다.',
      },
      {
        title: '발음 오인식 외부 ASR 진단',
        date: '2026.06.29',
        href: 'https://velog.io/@xorms/LAB-42.-%EB%B0%9C%EC%9D%8C-%EC%98%A4%EC%9D%B8%EC%8B%9D-%EC%99%B8%EB%B6%80-ASR-%EC%A7%84%EB%8B%A8',
        note: '연구 모델의 발음 오인식을 외부 모델(Whisper)과 비교해 진단했습니다.',
      },
    ],
  },
  {
    axis: '졸업작품 띵동',
    name: '졸업작품 기록',
    count: seriesCount('graduation', 62),
    blurb: '현관 소리 알림 시스템(띵동)의 개발 일지입니다. 설계 판단과 폐기한 방법까지 기록했습니다.',
    href: 'https://velog.io/@xorms/series/%EC%A1%B8%EC%97%85%EC%9E%91%ED%92%88-%EA%B8%B0%EB%A1%9D',
    posts: [
      {
        title: 'DTW·코사인 거리 유사도 알고리즘 확정',
        date: '2026.04.23',
        href: 'https://velog.io/@xorms/%EC%A1%B8%EC%97%85%EC%9E%91%ED%92%88-%EA%B8%B0%EB%A1%9D-11-5s9lgfpm',
        note: '여러 후보를 비교한 끝에 SP/DTW와 코사인 거리로 유사도 판정 방식을 정했습니다.',
      },
      {
        title: '802.1X 지원 폐기 결정',
        date: '2026.05.07',
        href: 'https://velog.io/@xorms/%EC%A1%B8%EC%97%85%EC%9E%91%ED%92%88-%EA%B8%B0%EB%A1%9D-25',
        note: '802.1X 지원 기능을 제외해 작업 시간과 코드 복잡도를 줄였습니다.',
      },
      {
        title: 'YAMNet 파인튜닝과 서빙 export 검증',
        date: '2026.07.01',
        href: 'https://velog.io/@xorms/%EC%A1%B8%EC%97%85%EC%9E%91%ED%92%88-%EA%B8%B0%EB%A1%9D-41',
        note: '공개 데이터로 소리 분류기를 처음 학습하고, 서버에서 쓸 형태로 내보낸 결과를 검증했습니다.',
      },
    ],
  },
  {
    axis: 'AI 도구 실험',
    name: 'AI 생태계 탐험 로그',
    count: seriesCount('ai-ecosystem', 15),
    blurb: 'AI 도구를 직접 연결해 써 보고 정리한 기록입니다. AI-Vault 구축편과 운영편도 이 시리즈에 있습니다.',
    href: 'https://velog.io/@xorms/series/AI-%EC%83%9D%ED%83%9C%EA%B3%84-%ED%83%90%ED%97%98-%EB%A1%9C%EA%B7%B8',
    posts: [
      {
        title: '카파시의 LLM Wiki를 Claude Code로 만들기(구축편)',
        date: '2026.10.18',
        href: 'https://velog.io/@xorms/%EC%B9%B4%ED%8C%8C%EC%8B%9C%EC%9D%98-LLM-Wiki%EB%A5%BC-Claude-Code%EB%A1%9C-%EC%A7%81%EC%A0%91-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0',
        note: 'AI-Vault 구축편입니다. 원본·위키·규칙서 세 층 구조를 만들고 공개·비공개 저장소를 나눈 과정을 담았습니다.',
      },
      {
        title: 'LLM Wiki 운영편: 자동화를 멈춘 이유',
        date: '2026.10.19',
        href: 'https://velog.io/@xorms/LLM-Wiki-%EC%9A%B4%EC%98%81%ED%8E%B8-%EC%9E%90%EB%8F%99%ED%99%94%EB%A5%BC-%EB%A9%88%EC%B6%98-%EC%9D%B4%EC%9C%A0%EC%99%80-%EC%8C%93%EC%9D%84%EC%88%98%EB%A1%9D-%EB%98%91%EB%98%91%ED%95%B4%EC%A7%84%EB%8B%A4%EB%A5%BC-%EC%88%AB%EC%9E%90%EB%A1%9C-%EC%A6%9D%EB%AA%85%ED%95%98%EA%B8%B0',
        note: '완전 자동화 계획을 철회한 이유와, 위키가 실제로 나아졌는지 고정 질문으로 측정한 과정입니다.',
      },
      {
        title: 'LLM Wiki 운영편 2: ‘부탁’을 ‘강제’로 바꾸는 운영',
        date: '2026.10.20',
        href: 'https://velog.io/@xorms/LLM-Wiki-%EC%9A%B4%EC%98%81%ED%8E%B8-2-%EC%A0%95%EA%B7%9C%EC%8B%9D%EC%9D%B4-%EB%86%93%EC%B9%9C-%EB%B9%84%EB%B0%80%EB%B2%88%ED%98%B8-%EC%88%AB%EC%9E%90%EB%8A%94-%EB%A7%9E%EB%8A%94%EB%8D%B0-%EB%82%A8%EC%9D%80-1%ED%8E%B8-%EB%B6%80%ED%83%81%EC%9D%84-%EA%B0%95%EC%A0%9C%EB%A1%9C-%EB%B0%94%EA%BE%B8%EB%8A%94-%EC%9A%B4%EC%98%81',
        note: '검사 규칙이 놓친 비밀번호와 처리되지 않은 1건을 찾고, 규칙을 차단 장치로 바꾼 기록입니다.',
      },
      {
        title: 'Claude Code Nested Agent',
        date: '2026.04.01',
        href: 'https://velog.io/@xorms/Claude-Code-Nested-Agent',
        note: '메인 에이전트가 서브에이전트를 병렬로 지휘하는 구조를 처음 실험했습니다.',
      },
    ],
  },
]

/** 시리즈별 최근 글(velog-sync가 매일 갱신). 없으면 표시하지 않는다. */
type SeriesMeta = { count?: number; lastPost?: string; latestTitle?: string; latestUrl?: string }
const SERIES_META: Record<string, SeriesMeta> = velogSeries.series
const SERIES_KEY: Record<string, string> = { AI_LAB: 'ai-lab', '졸업작품 기록': 'graduation', 'AI 생태계 탐험 로그': 'ai-ecosystem' }

/** velog 제목의 머리표([ LAB ] 89. / [[ … ]] / [ … ])를 떼고, 긴 줄표는 쌍점으로 바꾼다(사이트 문장 규칙). */
export function cleanVelogTitle(raw: string): string {
  let t = raw.trim()
  const wrapped = t.match(/^\[\[\s*(.*?)\s*\]\]$/)
  const lab = t.match(/^\[\s*LAB\s*\]\s*\d+\.\s*(.*)$/)
  const single = t.match(/^\[\s*(.*?)\s*\]$/)
  if (wrapped) t = wrapped[1]
  else if (lab) t = lab[1]
  else if (single) t = single[1]
  return t.replace(/\s*[\u2014\u2013\u2015\u2012]\s*/g, ': ')
}

export function latestPost(seriesName: string): { title: string; href: string; date: string } | null {
  const m = SERIES_META[SERIES_KEY[seriesName]]
  if (!m?.latestTitle || !m.latestUrl || !m.lastPost) return null
  return { title: cleanVelogTitle(m.latestTitle), href: m.latestUrl, date: m.lastPost.replace(/-/g, '.') }
}

/** 프로젝트별 당시 기록 — 상세 페이지의 결정·검증 블록과 같은 글을 가리킨다. */
export interface ProjectRecord {
  project: 'ddingdong' | 'voice' | 'aivault'
  label: string
  posts: { date: string; what: string; href: string }[]
}

const V = 'https://velog.io/@xorms'
export const PROJECT_RECORDS: ProjectRecord[] = [
  {
    project: 'voice',
    label: '멀티모달 LLM 음성 연구',
    posts: [
      { date: '2026.06.23', what: '길이를 맞추자 나빠진 학습 방식을 철회한 날', href: `${V}/LAB-37.-%ED%8C%8C%EC%9D%B8%ED%8A%9C%EB%8B%9D-%EA%B2%B0%EB%A1%A0` },
      { date: '2026.06.29', what: '연결부만 학습한 모델의 평가와 검증', href: `${V}/LAB-39` },
      { date: '2026.10.06', what: '학습 1회 결과를 시드 3개로 재측정한 기록', href: `${V}/LAB-80.-%ED%95%99%EC%8A%B5%EC%9D%84-%EB%8B%A4%EC%8B%9C-%ED%95%98%EB%A9%B4-%EA%B0%99%EC%9D%80-%EC%88%AB%EC%9E%90%EA%B0%80-%EB%82%98%EC%98%A4%EB%8A%94%EA%B0%80` },
    ],
  },
  {
    project: 'ddingdong',
    label: '띵동',
    posts: [
      { date: '2026.04.23', what: '소리 유사도 판정 방식을 고른 기록', href: `${V}/%EC%A1%B8%EC%97%85%EC%9E%91%ED%92%88-%EA%B8%B0%EB%A1%9D-11-5s9lgfpm` },
      { date: '2026.05.08', what: '802.1X 지원 기능을 제외한 결정', href: `${V}/%EC%A1%B8%EC%97%85%EC%9E%91%ED%92%88-%EA%B8%B0%EB%A1%9D-25` },
      { date: '2026.07.01', what: '소리 분류기 첫 학습과 서빙 검증', href: `${V}/%EC%A1%B8%EC%97%85%EC%9E%91%ED%92%88-%EA%B8%B0%EB%A1%9D-41` },
    ],
  },
  {
    project: 'aivault',
    label: 'AI-Vault',
    posts: [
      { date: '2026.10.18', what: '구축편: 세 층 구조와 저장소 분리', href: `${V}/%EC%B9%B4%ED%8C%8C%EC%8B%9C%EC%9D%98-LLM-Wiki%EB%A5%BC-Claude-Code%EB%A1%9C-%EC%A7%81%EC%A0%91-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0` },
      { date: '2026.10.19', what: '운영편: 자동화를 멈춘 이유', href: `${V}/LLM-Wiki-%EC%9A%B4%EC%98%81%ED%8E%B8-%EC%9E%90%EB%8F%99%ED%99%94%EB%A5%BC-%EB%A9%88%EC%B6%98-%EC%9D%B4%EC%9C%A0%EC%99%80-%EC%8C%93%EC%9D%84%EC%88%98%EB%A1%9D-%EB%98%91%EB%98%91%ED%95%B4%EC%A7%84%EB%8B%A4%EB%A5%BC-%EC%88%AB%EC%9E%90%EB%A1%9C-%EC%A6%9D%EB%AA%85%ED%95%98%EA%B8%B0` },
      { date: '2026.10.20', what: '운영편 2: 놓친 비밀번호와 처리되지 않은 1건', href: `${V}/LLM-Wiki-%EC%9A%B4%EC%98%81%ED%8E%B8-2-%EC%A0%95%EA%B7%9C%EC%8B%9D%EC%9D%B4-%EB%86%93%EC%B9%9C-%EB%B9%84%EB%B0%80%EB%B2%88%ED%98%B8-%EC%88%AB%EC%9E%90%EB%8A%94-%EB%A7%9E%EB%8A%94%EB%8D%B0-%EB%82%A8%EC%9D%80-1%ED%8E%B8-%EB%B6%80%ED%83%81%EC%9D%84-%EA%B0%95%EC%A0%9C%EB%A1%9C-%EB%B0%94%EA%BE%B8%EB%8A%94-%EC%9A%B4%EC%98%81` },
    ],
  },
]
