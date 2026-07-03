// About / 소개 섹션 데이터 — 인물 포지셔닝 + 일하는 원칙(의심·분리·책임·기록) + 이력·인정.
// 정체성: 모델이 아니라 시스템 전체를 의심하고 검증하며 끝까지 책임지는 AI/ML 엔지니어.

export interface Profile {
  name: string
  romanized: string
  role: string
  /** name 기준으로 split해 강조 대상 문구에 밑줄 */
  headline: string
  portrait: string
  email: string
  github: string
  githubHandle: string
}

export const PROFILE: Profile = {
  name: '박태근',
  romanized: 'Park Taegeun',
  role: 'AI · ML · Systems',
  headline: '모델이 아니라 시스템 전체를 검증하고 책임집니다.',
  portrait: '/images/portrait.png',
  email: 'taegeun1234@naver.com',
  github: 'https://github.com/park-taegeun',
  githubHandle: 'park-taegeun',
}

export interface Principle {
  /** 영문 키워드 — 디스플레이 강조용 */
  en: string
  title: string
  body: string
  /** body 안에서 굵게 강조할 핵심 문구 (컴포넌트에서 split) */
  highlight: string
}

export const PRINCIPLES: Principle[] = [
  {
    en: 'DOUBT',
    title: '잘 나온 결과를 먼저 의심한다',
    body: '좋아 보이는 지표일수록 그게 실제 개선인지 이상치에 가려진 착시인지부터 가릅니다. 통제된 조건에서 다시 재현해 본 뒤에 결론을 냅니다.',
    highlight: '통제된 조건에서 다시 재현해 본 뒤에 결론을 냅니다',
  },
  {
    en: 'ISOLATE',
    title: '원인을 단일 변수로 하나씩 분리한다',
    body: '문제를 뭉뚱그리지 않고 후보를 하나씩 통제하며 지워, 진짜 원인의 위치를 좁힙니다.',
    highlight: '진짜 원인의 위치를 좁힙니다',
  },
  {
    en: 'OWN THE PIPELINE',
    title: '모델이 아니라 시스템 전 구간을 책임진다',
    body: '한 단계라도 끊기면 결과 전체가 무의미해지므로, 모델 정확도가 아니라 데이터가 흐르는 전 구간을 설계하고 검증합니다.',
    highlight: '데이터가 흐르는 전 구간을 설계하고 검증합니다',
  },
  {
    en: 'RECORD',
    title: '실패와 철회까지 남긴다',
    body: '성공한 결과만이 아니라 틀렸던 판단과 스스로 철회한 과정까지 타임스탬프로 기록합니다.',
    highlight: '틀렸던 판단과 스스로 철회한 과정까지 타임스탬프로 기록합니다',
  },
]

export interface TimelineLink {
  label: string
  anchorId: string
  color: string
  /** 링크 꼬리말 — 기본 '에서 활용'. */
  suffix?: string
}

export interface TimelineItem {
  title: string
  org?: string
  period: string
  /** 인정/성과 배지 */
  award?: string
  /** 한 줄 의미 */
  note?: string
  /** 현재 진행 중인 활동 */
  ongoing?: boolean
  /** 관련 작업으로 연결 */
  link?: TimelineLink
}

export interface TimelineGroup {
  year: string
  items: TimelineItem[]
}

const SIGNAL = '#0E7C86'

const VOICE_LINK: TimelineLink = { label: '음성인식 환각 연구', anchorId: 'selected-voice', color: SIGNAL, suffix: '에서 보기' }
const EEG_LINK: TimelineLink = { label: 'EEG 감정인식', anchorId: 'selected-eeg', color: SIGNAL, suffix: '에서 보기' }
const THINGDONG_LINK: TimelineLink = { label: '소리 알림 시스템', anchorId: 'selected-thingdong', color: SIGNAL, suffix: '에서 보기' }
const PICKL_LINK: TimelineLink = { label: 'PICKL', anchorId: 'side', color: SIGNAL, suffix: '에서 보기' }

export const TIMELINE: TimelineGroup[] = [
  {
    year: '연구 · 프로젝트',
    items: [
      {
        title: '멀티모달 LLM 음성인식 환각 진단·개선',
        org: '정부 R&D 과제 · 학부연구생',
        period: '진행 중',
        ongoing: true,
        note: '짧은 발화 환각을 원인 단위로 진단하고 융합 통로 재학습으로 오디오 의존을 회복하는 중.',
        link: VOICE_LINK,
      },
      {
        title: 'EEG 기반 실시간 감정 인식 연구',
        org: '학부연구생',
        award: 'IEIE 발표',
        period: '2026',
        note: '라벨링 한계를 지표로 규명하고 비중첩 조건으로 재검증.',
        link: EEG_LINK,
      },
      {
        title: '청각장애인용 소리 알림 시스템',
        org: '졸업작품 · 1인 설계·구현',
        period: '진행 중 · 11월 전시',
        ongoing: true,
        note: '센서부터 알림까지 전 계층을 1인 설계·구현.',
        link: THINGDONG_LINK,
      },
      {
        title: '멋쟁이사자처럼 13기 중앙 해커톤 · PICKL',
        org: '프론트엔드',
        award: '247팀 중 상위 10%',
        period: '2025',
        note: '거리 표시 기능에서 팀 기준을 세워 조율.',
        link: PICKL_LINK,
      },
    ],
  },
  {
    year: '학업 · 자격',
    items: [
      {
        title: '전공 학업',
        period: '재학',
        note: '전체 4.17/4.5, 전공 4.21/4.5.',
      },
      {
        title: '자격증: 정보처리기사, SQLD',
        period: '취득',
      },
      {
        title: '어학: TOEIC 845',
        period: '취득',
      },
    ],
  },
]
