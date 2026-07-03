// 생각의 기록 (Velog @xorms) — 실측 로그.
// velog는 3개 시리즈로 운영: AI_LAB(음성·LLM 연구) / 졸업작품 기록 / AI 생태계 탐험 로그.
// 전체 나열 대신 각 시리즈에서 문제→판단→검증이 드러나는 대표글만 큐레이션하고,
// 하단 "전체 N편 보기"로 시리즈 전체 링크아웃(편수는 velog @xorms/series 기준 실측).
// 카드 제목·설명은 velog 원문을 정제한 표현이며 수치·사실은 velog 실데이터만 사용(지어내기 금지).

export const VELOG_URL = 'https://velog.io/@xorms'

export const VELOG_PROFILE = {
  displayName: '박태근',
  handle: '@xorms',
  bio: '음성·LLM 실험 로그와 졸업작품 시스템 기록, AI 생태계 탐험을 타임스탬프로 남깁니다.',
  tags: ['AI', 'LLM', '음성', '검증', '기록'],
}

export type WritingAxis = '음성·LLM 연구' | '졸업작품 시스템' | 'AI 생태계 탐험'

export const WRITING_AXES: WritingAxis[] = ['음성·LLM 연구', '졸업작품 시스템', 'AI 생태계 탐험']

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
    count: '45편',
    blurb: '멀티모달 LLM의 음성인식 환각을 진단·재측정한 실험을 타임스탬프로 남긴 로그.',
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
        note: '환각을 줄이려던 프롬프트가 예상과 반대로 움직인 과정을 남겼습니다.',
      },
      {
        title: '오디오·텍스트 결합 통로 파인튜닝 검증',
        date: '2026.06.29',
        href: 'https://velog.io/@xorms/LAB-39',
        note: '오디오와 텍스트를 잇는 통로(embed_audio)만 따로 학습해 검증했습니다.',
      },
      {
        title: '발음 오인식 외부 ASR 진단',
        date: '2026.06.29',
        href: 'https://velog.io/@xorms/LAB-42.-%EB%B0%9C%EC%9D%8C-%EC%98%A4%EC%9D%B8%EC%8B%9D-%EC%99%B8%EB%B6%80-ASR-%EC%A7%84%EB%8B%A8',
        note: '자기 모델의 발음 오인식을 외부 모델 Whisper로 교차 진단했습니다.',
      },
    ],
  },
  {
    axis: '졸업작품 시스템',
    name: '졸업작품 기록',
    count: '41편',
    blurb: '센서부터 알림까지 전 계층을 잇는 소리 알림 시스템의 설계 판단과 폐기한 접근을 기록.',
    href: 'https://velog.io/@xorms/series/%EC%A1%B8%EC%97%85%EC%9E%91%ED%92%88-%EA%B8%B0%EB%A1%9D',
    posts: [
      {
        title: 'DTW·코사인 거리 유사도 알고리즘 확정',
        date: '2026.04.23',
        href: 'https://velog.io/@xorms/%EC%A1%B8%EC%97%85%EC%9E%91%ED%92%88-%EA%B8%B0%EB%A1%9D-11-5s9lgfpm',
        note: '여러 후보 끝에 SP/DTW와 코사인 거리로 유사도 판정을 확정했습니다.',
      },
      {
        title: '발주 전 검증을 시스템 4개 영역에 적용',
        date: '2026.04.30',
        href: 'https://velog.io/@xorms/%EC%A1%B8%EC%97%85%EC%9E%91%ED%92%88-%EA%B8%B0%EB%A1%9D-20',
        note: '부품 발주 전 검증을 4개 영역에 적용해 설계 3가지를 바꿨습니다.',
      },
      {
        title: '802.1X 지원 폐기 결정',
        date: '2026.05.07',
        href: 'https://velog.io/@xorms/%EC%A1%B8%EC%97%85%EC%9E%91%ED%92%88-%EA%B8%B0%EB%A1%9D-25',
        note: '802.1X 지원을 통째로 덜어내 작업 시간과 코드 복잡도를 줄였습니다.',
      },
      {
        title: 'YAMNet 파인튜닝과 서빙 export 검증',
        date: '2026.07.01',
        href: 'https://velog.io/@xorms/%EC%A1%B8%EC%97%85%EC%9E%91%ED%92%88-%EA%B8%B0%EB%A1%9D-41',
        note: '공개 데이터 예비 학습으로 정확도 88.7%까지 확인했고, 목표는 90%입니다.',
      },
    ],
  },
  {
    axis: 'AI 생태계 탐험',
    name: 'AI 생태계 탐험 로그',
    count: '14편',
    blurb: 'AI 도구·모델·생태계를 직접 조합·응용하며 관찰한 것을 정리한 탐험 기록.',
    href: 'https://velog.io/@xorms/series/AI-%EC%83%9D%ED%83%9C%EA%B3%84-%ED%83%90%ED%97%98-%EB%A1%9C%EA%B7%B8',
    posts: [
      {
        title: 'Context7 + GitHub MCP 콤보',
        date: '2026.03.27',
        href: 'https://velog.io/@xorms/Context7-GitHub-MCP-%EC%BD%A4%EB%B3%B4',
        note: '문서 참조(Context7)와 GitHub 워크플로를 하나의 흐름으로 묶었습니다.',
      },
      {
        title: '4-MCP 콤보 자동화 파이프라인',
        date: '2026.04.01',
        href: 'https://velog.io/@xorms/Memory-Playwright-Notion-GitHub-4-MCP-%EC%BD%A4%EB%B3%B4',
        note: 'velog 변화 감지부터 백업·기록까지 네 개 도구로 자동화했습니다.',
      },
      {
        title: 'Claude Code Nested Agent',
        date: '2026.04.01',
        href: 'https://velog.io/@xorms/Claude-Code-Nested-Agent',
        note: '메인 에이전트가 서브에이전트를 병렬로 지휘하는 구조를 구현했습니다.',
      },
    ],
  },
]
