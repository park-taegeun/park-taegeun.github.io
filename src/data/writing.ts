// 생각의 기록 (Velog @xorms) — 실측 로그. 실제 글 제목·URL·썸네일은 확정 데이터가 없어 지어내지 않는다.
// velog는 3개 시리즈 구조로 운영: 졸업작품 기록 / AI_LAB(음성연구 실험 타임스탬프) / AI 생태계 탐험.
// 실제 글 목록은 사용자가 확정 후 채운다(현재는 시리즈 링크아웃만 렌더).

export const VELOG_URL = 'https://velog.io/@xorms'

export const VELOG_PROFILE = {
  displayName: '박태근',
  handle: '@xorms',
  bio: '음성·LLM 실험 로그와 졸업작품 시스템 기록, AI 생태계 탐험을 타임스탬프로 남깁니다.',
  tags: ['AI', 'LLM', '음성', '검증', '기록'],
}

export type WritingAxis = '음성·LLM 연구' | '졸업작품 시스템' | 'AI 생태계 탐험'

export const WRITING_AXES: WritingAxis[] = ['음성·LLM 연구', '졸업작품 시스템', 'AI 생태계 탐험']

export interface WritingSeries {
  axis: WritingAxis
  name: string
  /** 대략적 편수 — velog 시리즈 규모 */
  count: string
  blurb: string
  href: string
}

// href는 확정 시리즈 slug를 모르므로 프로필로 링크아웃(지어내기 금지).
export const WRITING_SERIES: WritingSeries[] = [
  {
    axis: '음성·LLM 연구',
    name: 'AI_LAB',
    count: '약 44편',
    blurb: '멀티모달 LLM 음성인식 환각을 진단·재측정한 실험을 타임스탬프로 남긴 로그.',
    href: VELOG_URL,
  },
  {
    axis: '졸업작품 시스템',
    name: '졸업작품 기록',
    count: '약 38편',
    blurb: '센서부터 알림까지 전 계층을 잇는 소리 알림 시스템의 설계 판단과 폐기한 접근을 기록.',
    href: VELOG_URL,
  },
  {
    axis: 'AI 생태계 탐험',
    name: 'AI 생태계 탐험',
    count: '약 14편',
    blurb: 'AI 도구·모델·생태계를 직접 써 보며 관찰한 것을 정리한 탐험 기록.',
    href: VELOG_URL,
  },
]
