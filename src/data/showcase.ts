// 랜딩 「프로젝트」 탭 데이터. 왼쪽 목록 + 오른쪽 패널(한눈에 보는 요약).
// 문장은 projects.ts·rooms.ts·sideWorks.ts의 사이트 문장을 줄인 것이다. 새 사실·새 수치를 넣지 않는다.
// 패널 규칙: 맡은 일 한 줄, 요약 한 줄, 배경 2줄 이내, 진행 3단계, 결과 3줄 이내.
// results[].mark = 그 줄의 측정값(청록으로 표시). summaryMark는 지금 쓰지 않는다(색은 측정값 전용).
import { projectByKey, type ProjectKey } from './projects'
import { SIDE_WORKS } from './sideWorks'

export interface ShowcaseMedia {
  kind: 'image' | 'phones'
  src?: string
  alt?: string
  caption: string
}

export interface ShowcaseItem {
  /** 랜딩 앵커 id(상세 → 목록 복귀, 이력 링크가 이 id로 탭을 연다) */
  id: string
  group: '대표 프로젝트' | '그 외 작업'
  /** 상세 페이지가 있으면 키 */
  project?: ProjectKey
  name: string
  /** 목록 둘째 줄 */
  listMeta: string
  ownership: '주도' | '참여'
  chips: string[]
  role: string
  summary: string
  summaryMark: string
  background: string[]
  steps: string[]
  results: { text: string; mark?: string }[]
  tech: string[]
  media: ShowcaseMedia
  /** 상세 페이지가 없을 때 외부 링크 */
  external?: { label: string; href: string }
}

const p = projectByKey

export const SHOWCASE: ShowcaseItem[] = [
  {
    id: p('ddingdong').anchorId,
    group: '대표 프로젝트',
    project: 'ddingdong',
    name: '띵동',
    listMeta: '졸업작품 · 2026.05 ~',
    ownership: '주도',
    chips: ['개인 졸업작품', '2026.05 ~ 진행 중', '11월 최종 발표'],
    role: '요구사항 정의, 설계 결정, 하드웨어 결선, 실기기 측정, 검증 설계. 코드는 Claude Code가 작성하고 PR 142건을 검토해 머지',
    summary: '현관 소리를 구분해 방문자 사진과 한 말의 자막까지 카카오톡으로 보내는 IoT 알림 시스템',
    summaryMark: '방문자 사진과 한 말의 자막까지',
    background: [
      '등록 청각장애인의 약 26%가 1인 가구, 시각 신호표시기 보유는 0.3%',
      '기존 초인종 알림은 노크를 모르고, 누가 무슨 말을 했는지 전하지 못함',
    ],
    steps: ['소리 감지 시 2초 녹음과 거리 센서 값 전송', '서버가 4종 분류 후 소리별 발송 규칙 판정', '텍스트 알림 → 사진·음성 자막'],
    results: [
      { text: '4종 소리 분류 macro F1 0.82 (평가 703클립, 개발 중 값)', mark: 'macro F1 0.82' },
      { text: '평가셋 누수 79건을 찾아 정확도 정정' },
      { text: '사진·자막 알림 10.4~11.0초 (목표 15초, 노크 n=3)' },
    ],
    tech: ['ESP32-S3', 'TensorFlow(YAMNet)', 'Flask', 'React', 'Kakao API', 'Claude Code'],
    media: { kind: 'image', src: p('ddingdong').previewImage.src, alt: p('ddingdong').previewImage.alt, caption: '초인종이 울리면 텍스트 알림, 방문자 사진, 음성 자막 순으로 도착' },
  },
  {
    id: p('voice').anchorId,
    group: '대표 프로젝트',
    project: 'voice',
    name: '멀티모달 LLM 음성 연구',
    listMeta: '정부 R&D 과제 · 2026.06 ~',
    ownership: '참여',
    chips: ['정부 R&D 과제 학부연구생', '2026.06 ~ 진행 중'],
    role: '음성 분석 파트의 실험 설계, 결과 검증과 해석, 랩미팅 발표 10회. 모델 본체와 융합 구조는 팀 담당',
    summary: '멀티모달 LLM(Gemma 4)이 짧은 발화를 받아쓸 때 생기는 환각과, 텍스트에 남지 않는 목소리 어조 전달 문제를 실험',
    summaryMark: '짧은 발화를 받아쓸 때 생기는 환각',
    background: [
      '10자 이하 한국어 발화의 약 70%에서 정답 글자 수보다 오류가 많은 출력',
      '대사와 목소리 감정이 다를 때 최종 라벨이 목소리 쪽과 일치한 경우가 6.9배',
    ],
    steps: ['오디오가 들어가는 통로가 연결부 하나임을 확인', '연결부만 다시 학습(파라미터 32,768개)', '길이를 맞춰 재비교, 나빠진 방식은 철회'],
    results: [
      { text: '길이를 맞춘 오류율(CER) 0.31 → 0.21 (168발화, 학습 1회)', mark: '0.31 → 0.21' },
      { text: '어조 효과는 학습 1회 +2.2%p를 시드 3개로 재측정해 +1.1%p로 낮춰 보고' },
    ],
    tech: ['PyTorch', 'Transformers', 'PEFT(LoRA/QLoRA)', 'Gemma 4', 'openSMILE', 'jiwer'],
    media: { kind: 'image', src: p('voice').previewImage.src, alt: p('voice').previewImage.alt, caption: '회색 막대는 길이를 맞춘 비교에서 나빠져 철회한 방식' },
  },
  {
    id: p('aivault').anchorId,
    group: '대표 프로젝트',
    project: 'aivault',
    name: 'AI-Vault',
    listMeta: '개인 프로젝트 · 2026.10 ~',
    ownership: '주도',
    chips: ['개인 프로젝트', '2026.10 구축 ~ 운영 중'],
    role: '공개 범위와 안전 원칙 설계, 공개 기준 승인, 실제 환경 검증, 보안 사고 대응, push. 위키 작성과 스크립트 초안은 Claude Code',
    summary: '블로그 209편과 노션 기록 260개를 AI 에이전트가 정리하는 지식 위키를, AI가 실수해도 사고로 번지지 않게 운영',
    summaryMark: 'AI가 실수해도 사고로 번지지 않게',
    background: [
      '블로그 209편과 노션 약 1,370페이지에 기록이 흩어져 매번 원본을 다시 찾음',
      'AI에 정리를 맡기면 원본 수정, 비공개 내용 공개 같은 사고 위험',
    ],
    steps: ['규칙서(부탁)와 시스템 차단(강제) 분리', '쓰는 순간부터 배포 직전까지 5겹 차단', '고정 질문으로 위키 품질 측정'],
    results: [
      { text: '위험한 작업 5가지를 일부러 시킨 시연에서 5/5 차단 (시연 1회)', mark: '5/5 차단' },
      { text: '새 기록 반영 후 위키만으로 답한 고정 질문 1/5 → 5/5' },
      { text: '공개 저장소 push는 항상 사람이 실행' },
    ],
    tech: ['Claude Code(훅·스킬·서브에이전트)', 'MCP', 'Python', 'Obsidian', 'Quartz', 'GitHub Actions'],
    media: { kind: 'image', src: p('aivault').previewImage.src, alt: p('aivault').previewImage.alt, caption: '5번 모두 차단됐고, AI는 우회하지 않고 보고' },
  },
  {
    id: p('decisions-rag').anchorId,
    group: '그 외 작업',
    project: 'decisions-rag',
    name: 'decisions-rag',
    listMeta: '띵동 개발 도구 · 2026.10',
    ownership: '주도',
    chips: ['띵동 개발 도구', '2026.10'],
    role: '설계 방향과 채택 규칙 승인, 블라인드 채점 확인, 평가 실행, MCP 등록. 코드와 평가 문항 초안은 Claude Code',
    summary: '졸업작품 결정 기록(약 6,200줄)에서 과거 결정과 폐기된 안을 찾아 주는 RAG 검색기와, 결과를 보기 전에 고정한 평가',
    summaryMark: '결과를 보기 전에 고정한 평가',
    background: ['AI 코딩 에이전트가 작업 전에 과거 결정을 MCP 도구로 확인해야 함'],
    steps: ['평가 문항 30개와 채택 규칙을 먼저 고정', '기준선 오답 원인 분류', '개선안을 held-out 문항으로 재평가'],
    results: [
      { text: '오답·부분 정답 21건 중 19건이 검색 실패 → 검색부터 개선', mark: '21건 중 19건이 검색 실패' },
      { text: '질의 재작성은 검색 적중이 늘었지만 held-out 정답이 9 → 8이라 미채택' },
    ],
    tech: ['LlamaIndex', 'Chroma', 'BM25', 'Ollama', 'MCP Python SDK'],
    media: { kind: 'image', src: p('decisions-rag').previewImage.src, alt: p('decisions-rag').previewImage.alt, caption: '효과가 있어 보여도 미리 정한 규칙을 통과하지 못하면 미채택' },
  },
  {
    id: p('eeg').anchorId,
    group: '그 외 작업',
    project: 'eeg',
    name: 'EEG 감정 인식',
    listMeta: '공동 연구 · 2026.04 ~ 06',
    ownership: '참여',
    chips: ['학부연구생 공동 연구', '학회 논문 4인 중 3저자', '2026.04 ~ 06'],
    role: '라벨-추론 간극 지표 2개 정의, 겹치지 않는 조건에서 재측정, trial 단위 분할로 데이터 누수 방지',
    summary: '소비자용 14채널 뇌파 기기만으로 1초마다 감정을 추론하는 공동 연구',
    summaryMark: '14채널 뇌파 기기만으로',
    background: ['60초 영상 단위 라벨로 학습한 모델이 1초 단위로 추론할 때 생기는 불일치'],
    steps: ['라벨-추론 간극 지표 2개 정의', 'trial 단위로 나눠 누수 차단', '겹치지 않는 조건에서 재측정'],
    results: [
      { text: '논문 결과: 뇌파만으로 trial 정확도 75.1% (5-fold, 108명 × 50 trial)', mark: '75.1%' },
      { text: '같은 정규화를 적용한 기준 모델(73.3%) 대비 +1.8%p' },
    ],
    tech: ['PyTorch', 'SciPy', 'scikit-learn', 'LightGBM'],
    media: { kind: 'image', src: p('eeg').previewImage.src, alt: p('eeg').previewImage.alt, caption: '같은 정규화 기준과의 차이(+1.8%p)가 모델 구조만의 효과' },
  },
  {
    id: 'side-pickl',
    group: '그 외 작업',
    name: 'PICKL',
    listMeta: '해커톤 · 2025',
    ownership: '참여',
    chips: ['5인 팀 프론트엔드', '멋쟁이사자처럼 13기 중앙 해커톤', '2025'],
    role: '지도, 검색, 포인트 전환, 마이페이지 화면 구현',
    summary: '전통시장 식재료 큐레이션 서비스에서, 가게까지의 거리를 이동 시간으로 바꿔 보여 주자고 제안해 반영',
    summaryMark: '이동 시간으로 바꿔 보여 주자고 제안해 반영',
    background: ['실제 도로 거리(정확)와 좌표 직선거리(빠름)로 팀 의견이 갈림'],
    steps: ['좌표 직선거리(Haversine) 계산', '도보 분속 67m, 차량 분속 250m로 환산', '분 단위 이동 시간으로 표시'],
    results: [{ text: '247팀 중 상위 10%로 본선 진출', mark: '상위 10%로 본선 진출' }, { text: '맡은 화면을 데모까지 완성' }],
    tech: ['React', 'Kakao Maps API'],
    media: { kind: 'phones', caption: '지도 · 시장 위치와 이동 시간 · 마이페이지' },
    external: SIDE_WORKS[0]?.demoVideo?.href ? { label: '데모 영상 보기', href: SIDE_WORKS[0].demoVideo.href } : undefined,
  },
]

export const SHOWCASE_GROUPS = ['대표 프로젝트', '그 외 작업'] as const
