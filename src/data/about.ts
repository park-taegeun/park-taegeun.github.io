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
    '정부 과제에서 멀티모달 LLM의 음성 실험을 맡아, 좋아 보이는 결과일수록 조건을 바꿔 다시 쟀습니다.',
    '졸업작품과 개인 위키는 코드를 AI 코딩 에이전트에 맡기고, 저는 무엇을 맡길지 정하고 결과를 실측과 시험으로 검증하는 쪽을 맡았습니다.',
    '맡긴 AI가 실수해도 사고가 나지 않도록 막는 장치를 만들고, 틀린 판단과 철회한 결론까지 기록합니다.',
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
    body: '좋아 보이는 지표일수록 그게 실제 개선인지 착시인지부터 가립니다. 조건을 바꿔 다시 재 본 뒤에 결론을 냅니다.',
    highlight: '조건을 바꿔 다시 재 본 뒤에 결론을 냅니다',
    evidence: [
      { label: '음성 연구 · 시드 3회 재현', project: 'voice', tab: 'tone', anchor: 'check-0' },
      { label: '띵동 · 평가셋 누수 79건', project: 'ddingdong', anchor: 'check-0' },
    ],
  },
  {
    en: 'ISOLATE',
    title: '원인을 단일 변수로 하나씩 분리한다',
    body: '문제를 뭉뚱그리지 않고 후보를 하나씩 바꿔 가며 지워, 진짜 원인의 위치를 좁힙니다.',
    highlight: '진짜 원인의 위치를 좁힙니다',
    evidence: [
      { label: '음성 연구 · 손해의 원인 좁히기', project: 'voice', tab: 'tone', anchor: 'check-1' },
      { label: '띵동 · 학습과 실제 입력의 음량 불일치', project: 'ddingdong', anchor: 'check-2' },
    ],
  },
  {
    en: 'DELEGATE & VERIFY',
    title: '맡기고, 검증 방법을 먼저 정한다',
    body: '코드는 AI 코딩 에이전트에 맡기되, 맡기기 전에 무엇으로 확인할지부터 정합니다. 실측, 대조 실험, 고정 질문 채점처럼 AI의 말이 아니라 결과로 확인하고, 어기면 사고가 나는 규칙은 시스템이 막게 합니다.',
    highlight: 'AI의 말이 아니라 결과로 확인하고',
    evidence: [
      { label: 'AI-Vault · 부탁과 강제를 나눈 5겹 장치', project: 'aivault', anchor: 'decision-0' },
      { label: '띵동 · AI 위임 네 칸', project: 'ddingdong', anchor: 'ai' },
    ],
  },
  {
    en: 'RECORD',
    title: '실패와 철회까지 남긴다',
    body: '성공한 결과만이 아니라 틀렸던 판단과 스스로 철회한 과정까지 날짜와 함께 기록합니다.',
    highlight: '틀렸던 판단과 스스로 철회한 과정까지',
    evidence: [
      { label: '음성 연구 · 성공처럼 보인 결과를 철회', project: 'voice', tab: 'hallucination', anchor: 'check-0' },
      { label: '띵동 · 결정 기록 8,200여 행', href: 'https://github.com/park-taegeun/ddingdong/blob/main/docs/decisions.md' },
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
        period: '2026.05 ~ 진행 중 · 11월 발표',
        ongoing: true,
        note: '요구사항·설계 결정·실측·검증을 맡고 구현은 AI 코딩 에이전트에 맡겨 PR마다 검토',
        project: 'ddingdong',
      },
      {
        title: '멀티모달 LLM 음성 연구',
        org: '정부 R&D 과제 · 학부연구생 참여',
        period: '2026.06 ~ 진행 중',
        ongoing: true,
        note: '짧은 발화 환각 진단, 텍스트에 없는 어조를 넘기는 오디오 모듈 검증',
        project: 'voice',
      },
      {
        title: 'AI-Vault · AI 에이전트가 관리하는 개인 지식 위키',
        org: '개인 프로젝트 · 주도',
        period: '2026.10 ~ 운영 중',
        ongoing: true,
        note: '5겹 차단 장치와 고정 질문 평가로 운영',
        project: 'aivault',
      },
      {
        title: 'decisions-rag · 결정 기록 검색기',
        org: '개발 도구 · 주도',
        period: '2026.10',
        note: '사전 등록 평가로 겉보기 개선을 걸러 냄',
        project: 'decisions-rag',
      },
      {
        title: 'EEG 감정 인식 연구',
        org: '학부연구생 · 학회 논문 3저자(4인)',
        period: '2026.04 ~ 06',
        note: '라벨-추론 간극 지표 정의와 겹치지 않는 조건 재검증',
        project: 'eeg',
      },
      {
        title: 'PICKL',
        org: '멋쟁이사자처럼 13기 해커톤 · 프론트엔드',
        period: '2025',
        note: '거리 표시 방식을 시간 환산으로 제안해 반영',
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
