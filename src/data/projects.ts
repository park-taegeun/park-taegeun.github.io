export type ProjectKey = 'voice' | 'eeg' | 'thingdong'

export interface Project {
  key: ProjectKey
  room: string
  name: string
  accent: string
  ink: string
  tone: string
  tintSoft: string
  role: string
  summary: string
  anchorId: string
  tagline: string
  tenSecond: string
  tenSecondCredit?: string
  problem: string
  myCall: string
  impact: string
  previewImage: {
    src: string
    alt: string
    caption: string
  }
  proofChips: string[]
  caseSummary: string
  decision: string
  verification: string
}

// 전 프로젝트 공통 팔레트 — ink=네이비, accent=시그널(틸). 장식 대신 헤어라인·모노 라벨로 절제.
const NAVY = '#1A2B4A'
const SIGNAL = '#0E7C86'

export const PROJECTS: Project[] = [
  {
    key: 'voice',
    room: '01',
    name: 'Multimodal ASR',
    accent: SIGNAL,
    ink: NAVY,
    tone: '#E7EDF1',
    tintSoft: '#EFF3F6',
    role: '학부연구생 · 정부 R&D 과제(XR 텔레프레즌스) 음성/오디오 파트 참여 · 진행 중',
    summary:
      '짧은 발화일수록 오디오를 무시하고 언어 prior로 환각을 만드는 멀티모달 LLM(Gemma 4)을, 원인을 단계별로 좁혀 진단하고 융합 통로 한 지점 재학습으로 오디오 의존을 회복한 연구입니다.',
    anchorId: 'selected-voice',
    tagline: '의심→재측정',
    tenSecond:
      '짧은 발화일수록 오디오를 무시하고 언어 prior로 환각을 만드는 멀티모달 LLM(Gemma 4)을, 원인을 단계별로 좁혀 진단하고 융합 통로 한 지점 재학습으로 오디오 의존을 회복한 연구',
    tenSecondCredit: '정부 R&D · 학부연구생 · 진행 중',
    problem:
      '멀티모달 LLM은 짧은 한국어 발화에서 오디오를 듣지 않고 언어 습관으로 문장을 지어냅니다. 10자 이하 발화의 환각률이 70.5%였습니다.',
    myCall:
      '환각 평가 지표를 설계하고, 원인 후보를 단일 변수로 하나씩 분리하고, 오디오 융합 통로 한 지점을 재학습하고, 남은 실패를 외부 모델로 대조 검증하는 일을 맡아 진행했습니다.',
    impact:
      '오디오-출력 상관을 0.128에서 0.755(정답 0.737 수준)로 회복하고, 전체 79억 파라미터의 0.0004%만 학습해 길이 통제 CER 역전을 해소했습니다.',
    previewImage: {
      src: '/images/evidence/voice/hero_correlation.png',
      alt: '오디오 길이 대비 출력 길이 상관 — base 0.024에서 융합 통로 LoRA 0.755로 회복',
      caption: '오디오 길이에 출력이 따라붙는 정도를 0.128에서 0.755로 회복',
    },
    proofChips: ['Gemma 4', 'QLoRA/PEFT', 'jiwer CER/WER', 'Whisper 대조'],
    caseSummary:
      '짧은 발화 환각을 원인 단위로 진단하고, 오디오가 LLM으로 들어가는 융합 통로 한 지점만 재학습해 오디오 의존을 회복한 연구.',
    decision:
      '먼저 시도한 language_model 어텐션 LoRA는 길이를 통제하자 CER이 역전됐습니다. 오디오를 더 들은 게 아니라 환각성 과생성을 억제한 부작용이었고, 초기 결론을 철회한 뒤 개입 지점을 오디오 융합 통로로 옮겼습니다.',
    verification:
      '상관·CER 수치, 실제 전사문 육안 검사, Whisper large-v3 외부 대조 세 방향으로 결과를 교차 확인했습니다.',
  },
  {
    key: 'eeg',
    room: '02',
    name: 'EEG Emotion',
    accent: SIGNAL,
    ink: NAVY,
    tone: '#E8ECF2',
    tintSoft: '#F1F4F8',
    role: '학부연구생 · IEIE 학회 논문·포스터 발표',
    summary:
      '14채널 소비자급 EEG 단독 입력으로 감정을 실시간 인식하면서, 라벨링 방식의 한계를 지표로 규명한 이중 스트림 1D CNN-Transformer 연구입니다.',
    anchorId: 'selected-eeg',
    tagline: '라벨→지표',
    tenSecond:
      '14채널 소비자급 EEG 단독 입력으로 감정을 실시간 인식하는 이중 스트림 1D CNN-Transformer 연구',
    tenSecondCredit: '학부연구생 · IEIE 발표',
    problem:
      '60초 영상 하나에 라벨 하나를 붙이는 방식은 1초 단위 추론과 어긋납니다. 감정은 60초 내내 변하기 때문입니다.',
    myCall:
      '이 어긋남을 모델 오류가 아니라 라벨링 방식의 한계로 보고, 검증 지표 두 개(segment-trial 정합도, 인접 segment 일관성)를 정의해 원인을 데이터 단에서 규명하는 데 참여했습니다.',
    impact:
      '14채널 EEG 단독으로 trial 정확도 75.1%를 얻어 5종 생체신호 LightGBM 베이스라인(68.2%)을 6.9%p 앞섰고, 비중첩 조건에서 재측정해도 인접 일관성 83.1%가 유지됐습니다.',
    previewImage: {
      src: '/images/evidence/eeg/ieie_poster.png',
      alt: 'IEIE 학회 포스터 — Dual-Stream Transformer for Single 14-Channel EEG Emotion Recognition',
      caption: 'IEIE 학회에 발표한 이중 스트림 트랜스포머 연구 포스터',
    },
    proofChips: ['PyTorch', '1D CNN-Transformer', 'PSD/DE', 'IEIE 발표'],
    caseSummary:
      '라벨링 방식의 한계를 지표로 규명하고, 자기 방법의 허점까지 비중첩 조건으로 재검증한 EEG 감정 인식 연구.',
    decision:
      '인접 segment 일관성이 75% 중첩 슬라이딩 윈도우 때문에 부풀려졌을 가능성을 의심해, 비중첩 조건을 따로 만들어 재측정했습니다.',
    verification:
      '5-fold 교차검증, 1D CNN 제거 시 정확도 급락(절제실험), 비중첩 재측정으로 결과를 검증했습니다.',
  },
  {
    key: 'thingdong',
    room: '03',
    name: 'Sound Alert',
    accent: SIGNAL,
    ink: NAVY,
    tone: '#E6EDEC',
    tintSoft: '#EEF2F1',
    role: '졸업작품 · 센서부터 알림까지 전 계층 1인 설계·구현 · 진행 중',
    summary:
      '놓치면 안 되는 소리(초인종·노크·화재경보)를 실시간 감지해 스마트폰으로 알리는, 센서부터 ML·서버·알림까지 전 계층을 1인 설계·구현한 end-to-end 시스템입니다.',
    anchorId: 'selected-thingdong',
    tagline: '센서→알림',
    tenSecond:
      '놓치면 안 되는 소리(초인종·노크·화재경보)를 실시간 감지해 스마트폰으로 알리는, 센서부터 ML·서버·알림까지 end-to-end 시스템',
    tenSecondCredit: '졸업작품 · 1인 설계·구현',
    problem:
      '중증 청각장애 1인 가구는 초인종·노크·화재경보를 인지하지 못해 안전에 위협을 받습니다. 기존 제품은 수동 버튼식이라 소리를 자동 분류하지 못합니다.',
    myCall:
      '마이크 수집부터 YAMNet 추론, DTW+코사인 2단계 오탐 검증, 서버, 알림 발송, 대시보드까지 데이터 흐름 전 구간을 직접 설계하고 구현했습니다.',
    impact:
      '소리(ML)와 위치(센서) 2중 검증으로 옆집 오탐을 차단하고, 초인종·화재경보 분리 마진 8.418로 화재경보 오탐을 걸러냈습니다. 서버 파이프라인은 100회 측정에서 평균 61.7ms였습니다.',
    previewImage: {
      src: '/images/evidence/thingdong/system_diagram.png',
      alt: '소리 알림 시스템 구성도 — 센서·펌웨어·서버·ML·알림·대시보드 전 계층',
      caption: '센서에서 알림까지 전 계층을 잇는 시스템 구성',
    },
    proofChips: ['ESP32-S3', 'YAMNet', 'DTW+cosine', 'Flask/AWS/React'],
    caseSummary:
      '한 단계라도 끊기면 알림이 무의미해지는 시스템을, 모델 정확도가 아니라 데이터 흐름 전 구간을 책임지고 설계한 졸업작품.',
    decision:
      '초음파 센서는 소리를 내 마이크 수집에 간섭하므로 레이저 기반 ToF로 바꿨고, 코사인 단독은 누름 길이 차이에 흔들려 DTW로 시간축을 정렬한 뒤 코사인으로 주파수를 비교하도록 했습니다.',
    verification:
      '발주 전 Claude Code로 간섭 시나리오를 코드 레벨로 먼저 돌려 설계 세 가지를 바꾸고, 예비 학습(test 88.7% / macro_f1 0.848, 공개 데이터 기준)까지 검증했습니다. 한국 환경음 자체 녹음 후 2차 파인튜닝으로 정확도 90%를 목표합니다.',
  },
]
