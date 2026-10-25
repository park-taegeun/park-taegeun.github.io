// About 데이터. 원천 문서 05의 「사이트 문장」만 옮긴다.
// 정체성 축: AI 시스템을 끝까지 검증하고 운영하는 엔지니어.
import type { ProjectKey } from './projects'

export interface Profile {
  name: string
  romanized: string
  role: string
  /** Hero와 About이 같은 문장을 쓴다(정체성 문장 하나) */
  headline: string
  /** 헤드라인 안에서 밑줄로 강조할 구절 */
  headlineEmphasis: string
  intro: string[]
  portrait: string
  email: string
  github: string
  githubHandle: string
  /** 이력서 PDF. 비어 있으면 연락처에서 숨긴다(PDF 단계에서 채움). */
  resumePdf?: string
}

export const PROFILE: Profile = {
  name: '박태근',
  romanized: 'Park Taegeun',
  role: 'AI 엔지니어 · LLM 평가와 운영',
  headline: 'AI가 만든 결과를 끝까지 검증하고, 운영하면서 고칩니다.',
  headlineEmphasis: '끝까지 검증하고',
  intro: [
    '정부 R&D 과제에서 멀티모달 LLM의 음성 실험을 맡아, 발화 길이와 시드를 바꿔 결과를 다시 측정하고 틀린 결론은 철회했습니다.',
    '졸업작품과 개인 위키 프로젝트에서는 구현을 AI 코딩 에이전트에 맡기고, 저는 작업 범위를 정하고 결과를 실측과 테스트로 검증했습니다.',
    'AI가 실수해도 사고로 이어지지 않도록 차단 장치를 만들고, 판단 과정은 결정 기록과 개발 일지로 남깁니다.',
  ],
  portrait: '/images/portrait.webp',
  email: 'taegeun1234@naver.com',
  github: 'https://github.com/park-taegeun',
  githubHandle: 'park-taegeun',
}

/** 상세 페이지의 특정 블록으로 가는 근거 링크 */
export interface EvidenceLink {
  label: string
  project?: ProjectKey
  /** 상세 안 블록 id (예: check-0, decision-1, ai) */
  anchor?: string
  /** 음성 연구 탭 id */
  tab?: string
  /** 외부 링크 */
  href?: string
}

export interface Principle {
  en: string
  title: string
  body: string
  highlight: string
  evidence: EvidenceLink[]
}

export const PRINCIPLES: Principle[] = [
  {
    en: 'DOUBT',
    title: '잘 나온 결과를 먼저 의심한다',
    body: '좋아 보이는 지표일수록 조건을 바꿔 다시 측정한 뒤에 결론을 냅니다.',
    highlight: '조건을 바꿔 다시 측정한 뒤에',
    evidence: [
      { label: '음성 연구 · 시드 3개 재측정', project: 'voice', tab: 'tone', anchor: 'check-0' },
      { label: '띵동 · 평가셋 누수 79건', project: 'ddingdong', anchor: 'check-0' },
    ],
  },
  {
    en: 'ISOLATE',
    title: '원인을 한 번에 하나씩 분리한다',
    body: '변수를 한 번에 하나씩 바꿔 원인 후보를 배제하고, 실제 원인을 좁혀 갑니다.',
    highlight: '실제 원인을 좁혀 갑니다',
    evidence: [
      { label: '음성 연구 · 성능 저하 원인 분리', project: 'voice', tab: 'tone', anchor: 'check-1' },
      { label: '띵동 · 학습과 실제 입력의 음량 불일치', project: 'ddingdong', anchor: 'check-2' },
    ],
  },
  {
    en: 'DELEGATE & VERIFY',
    title: 'AI에 맡기기 전에 검증 방법부터 정한다',
    body: '구현은 AI 코딩 에이전트에 맡기고, 결과는 실측과 대조 실험으로 판단합니다. 어기면 사고로 이어지는 규칙은 시스템이 막습니다.',
    highlight: '실측과 대조 실험으로 판단합니다',
    evidence: [
      { label: 'AI-Vault · 5겹 차단 장치', project: 'aivault', anchor: 'decision-0' },
      { label: '띵동 · AI 활용과 검증 방식', project: 'ddingdong', anchor: 'ai' },
    ],
  },
  {
    en: 'RECORD',
    title: '실패와 철회까지 남긴다',
    body: '틀렸던 판단과 직접 철회한 결론까지 날짜별로 기록합니다.',
    highlight: '직접 철회한 결론까지',
    evidence: [
      { label: '음성 연구 · 성공처럼 보인 결과를 철회', project: 'voice', tab: 'hallucination', anchor: 'check-0' },
      { label: '띵동 · 결정 기록 8,200여 줄', href: 'https://github.com/park-taegeun/ddingdong/blob/main/docs/decisions.md' },
    ],
  },
]

export interface TimelineItem {
  title: string
  org?: string
  period: string
  note?: string
  ongoing?: boolean
  project?: ProjectKey
  /** 상세가 없는 항목(PICKL)은 랜딩 앵커로 */
  anchorId?: string
}

export interface TimelineGroup {
  year: string
  items: TimelineItem[]
}

export const TIMELINE: TimelineGroup[] = [
  {
    year: '연구 · 프로젝트',
    items: [
      {
        title: '띵동 · 청각장애인 1인 가구를 위한 현관 소리 알림 시스템',
        org: '졸업작품 · 주도',
        period: '2026.05 ~ 진행 중 · 11월 최종 발표',
        ongoing: true,
        note: '요구사항 정의, 설계 결정, 실측과 검증 담당. 구현은 AI 코딩 에이전트에 맡기고 PR 142건 직접 검토',
        project: 'ddingdong',
      },
      {
        title: '멀티모달 LLM 음성 연구',
        org: '정부 R&D 과제 · 학부연구생 참여',
        period: '2026.06 ~ 진행 중',
        ongoing: true,
        note: '짧은 발화 받아쓰기 환각 진단, 목소리 어조를 LLM에 전달하는 오디오 모듈 검증',
        project: 'voice',
      },
      {
        title: 'AI-Vault · AI 에이전트로 운영하는 개인 지식 위키',
        org: '개인 프로젝트 · 주도',
        period: '2026.10 구축 ~ 운영 중',
        ongoing: true,
        note: '5겹 차단 장치를 두고, 고정 질문으로 품질을 측정하며 운영',
        project: 'aivault',
      },
      {
        title: 'decisions-rag · 결정 기록 검색기',
        org: '개발 도구 · 주도',
        period: '2026.10',
        note: '채택 규칙을 먼저 고정한 평가로, 효과가 확인되지 않은 개선안을 걸러 냄',
        project: 'decisions-rag',
      },
      {
        title: 'EEG 감정 인식 연구',
        org: '학부연구생 · 학회 논문 4인 중 3저자',
        period: '2026.04 ~ 06',
        note: '라벨-추론 간극 지표 정의, 겹치지 않는 조건에서 재검증',
        project: 'eeg',
      },
      {
        title: 'PICKL',
        org: '멋쟁이사자처럼 13기 해커톤 · 프론트엔드',
        period: '2025',
        note: '거리 표시를 이동 시간으로 바꾸자고 제안해 반영',
        anchorId: 'side-pickl',
      },
    ],
  },
  {
    year: '학업 · 자격',
    items: [
      {
        title: '학업',
        period: '2027.02 졸업 예정',
        note: '전자컴퓨터공학 전공 · 전체 평점 4.17/4.5(백분율 96.7) · 전공 평점 4.21/4.5',
      },
      {
        title: '학기 성적',
        period: '3-2 · 4-1',
        note: '3학년 2학기 4.50(학기 석차 1/106), 4학년 1학기 4.50',
      },
      { title: '자격', period: '취득', note: '정보처리기사 · SQLD' },
      { title: '어학', period: '취득', note: 'TOEIC 845' },
      { title: '병역', period: '2022.03 ~ 2023.09', note: '육군 병장 만기 전역' },
    ],
  },
]
