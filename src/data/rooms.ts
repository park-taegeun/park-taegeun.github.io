import type { ProjectKey } from './projects'

export interface EvidenceItem {
  src: string
  alt: string
  caption: string
  layout?: 'wide' | 'compact'
}

export interface EvidenceGroup {
  label: string
  desc?: string
  /** gallery: 균일 썸네일 + 클릭 확대(그래프 벽 방지). 기본은 대형 프레임. */
  layout?: 'gallery' | 'feature'
  items: EvidenceItem[]
}

/** 대표 화면 옆 핵심 수치 — 포스터/이미지를 못 읽어도 결론이 전달되게(모노 병기). */
export interface HeroStat {
  value: string
  label: string
}

/** 세로 내러티브 비트(번호형 프로세스에도 재사용). 이미지는 있는 비트만. */
export interface OriginBeat {
  eyebrow: string
  title: string
  body: string
  image?: EvidenceItem
}

export interface OriginStory {
  label: string
  beats: OriginBeat[]
}

export interface AiUsageBlock {
  /** 짧은 한글 단계명 (프로세스 맵·번호 흐름용). */
  step?: string
  eyebrow: string
  title: string
  /** 접힘 상태용 한 줄 결과. 없으면 output 사용. */
  scanResult?: string
  usedWhen: string
  how: string[]
  output: string
  /** 펼침 영역 인라인 증거. */
  evidence?: EvidenceItem
}

export interface RoomData {
  key: ProjectKey
  entranceLine: string
  entranceDetail?: string
  mainWallSize?: 'default' | 'compact'
  mainWall: EvidenceItem
  /** 대표 화면 아래 핵심 수치 스트립(모노). */
  heroStats?: HeroStat[]
  /** 있으면 flat evidence 대신 라벨 그룹 단위로 렌더. */
  evidenceGroups?: EvidenceGroup[]
  /** 그리드 밀도. */
  evidenceGrid?: 2 | 3
  cardStack?: {
    label: string
    caption: string
    groups: { label: string; items: EvidenceItem[] }[]
  }
  slideViewer?: {
    label: string
    items: { src: string; alt: string; caption: string }[]
  }
  /** 세로 내러티브 — 있으면 별도 섹션. voice에서는 작업 과정(01~05)으로 사용. */
  originStory?: OriginStory
  evidence: EvidenceItem[]
  casePanels?: {
    eyebrow: string
    title: string
    body: string
  }[]
  phaseFlow?: {
    eyebrow: string
    title: string
    intro?: string
    phases: { no: string; name: string; desc: string }[]
  }
  aiUsage?: {
    intro: string
    blocks: AiUsageBlock[]
    fullStackProof?: {
      label: string
      item: EvidenceItem
    }
  }
  writingRefs?: {
    title: string
    source: string
    summary: string
    application: string
  }[]
  infoDock: {
    problem: string | string[]
    insight: string | string[]
    role: string | string[]
    coreFlow: string | string[]
    output: string | string[]
    verification: string | string[]
    uxWritingPoint: string | string[]
    learning: string | string[]
  }
}

export const ROOMS: Record<ProjectKey, RoomData> = {
  voice: {
    key: 'voice',
    entranceLine:
      '멀티모달 LLM이 짧은 발화에서 오디오를 무시하고 언어 습관으로 문장을 지어내는 환각을, 원인을 단계별로 좁혀 진단하고 융합 통로 한 지점을 다시 학습시켜 오디오 의존을 회복시켰습니다.',
    entranceDetail:
      '평가 지표 설계, 원인 분리, 실패와 철회, 회복, 한계 규명까지 전 과정을 실측과 함께 기록했습니다.',
    mainWall: {
      src: '/images/evidence/voice/hero_correlation.png',
      alt: '오디오 길이 대비 출력 길이 상관 — base 0.024 / attention 0.128 / 융합 통로 0.755 / 정답 0.737',
      caption:
        '오디오 길이에 출력이 따라붙는 정도: 융합 통로 재학습으로 0.128에서 0.755로 회복',
    },
    casePanels: [
      {
        eyebrow: 'problem framing',
        title: '무엇이, 언제 틀리는가',
        body: 'corpus 평균 CER은 소수 샘플의 극단 실패에 휘둘렸습니다. 중앙값을 실제 성능 지표로, 평균과 중앙값의 괴리를 환각 지표로 바꾸자 문제의 구조가 드러났습니다. 회의 음성 CER은 낭독 대비 약 5배(0.089에서 0.433)였지만, 이는 전반적 품질 저하가 아니라 짧은 발화에서 간헐적으로 터지는 환각 폭발이었습니다.',
      },
      {
        eyebrow: 'cause isolation',
        title: '원인을 단일 변수로 하나씩',
        body: '양자화·구조·토크나이저·오디오 경로를 하나씩 통제하며 배제했습니다. 양자화를 제거한 대조군에서도 짧은 발화 환각과 길이 의존성이 그대로 보존됐고, 대표 환각 트리거 "구십"이 텍스트 경로에선 정상인데 오디오 경로에서만 환각을 냈습니다. 원인은 오디오 입력 경로에 있었습니다.',
      },
      {
        eyebrow: 'retraction',
        title: '성공처럼 보인 결과를 스스로 뒤집다',
        body: 'language_model 어텐션 LoRA는 audio-gap을 음수에서 양수로 바꿔 처음엔 성공처럼 보였습니다. 그러나 과생성을 제외하고 길이를 통제하자 CER이 역전(base 0.301 < ft 0.521)됐습니다. 오디오를 더 들은 게 아니라 환각성 과생성을 억제한 부산물이었고, 초기 결론을 철회했습니다.',
      },
    ],
    originStory: {
      label: '작업 과정',
      beats: [
        {
          eyebrow: '01',
          title: '진단: 무엇이 언제 틀리는가',
          body: '평균이 아니라 중앙값을 성능 지표로, 평균과 중앙값의 괴리를 환각 지표로 바꿔 문제의 구조부터 드러냈습니다.',
        },
        {
          eyebrow: '02',
          title: '원인 분리: 오디오 경로로 좁히다',
          body: '양자화·구조·토크나이저·오디오 경로를 하나씩 통제하며 배제해, 원인이 오디오 입력 경로에 있음을 좁혔습니다.',
        },
        {
          eyebrow: '03',
          title: '실패와 철회',
          body: 'language_model 어텐션 LoRA는 성공처럼 보였지만 길이를 통제하자 CER이 역전됐고, 과생성 억제 부작용임을 확인해 초기 결론을 철회했습니다.',
        },
        {
          eyebrow: '04',
          title: '융합 통로 특정·재학습',
          body: '모델 dump로 오디오가 LLM으로 진입하는 단일 게이트(embed_audio.embedding_projection, 1536에서 2560)를 특정하고, 학습 데이터 2,485건으로 이 한 지점만 LoRA 재학습했습니다. 학습 파라미터는 32,768개, 전체 79억의 0.0004%입니다.',
        },
        {
          eyebrow: '05',
          title: '한계 규명',
          body: '회복 후에도 극단 초단발화(2~8자)에서 발음 오인식이 남았습니다. 같은 오디오를 Whisper large-v3에 넣으니 6개 중 5개 음소를 정확히 변별해, 정보는 입력에 존재하며 한계는 정보 부족이 아니라 추출 실패임을 외부 모델로 규명했습니다.',
        },
      ],
    },
    evidence: [],
    evidenceGroups: [
      {
        label: '핵심 결과: 오디오 의존 회복',
        layout: 'gallery',
        desc: '대표 화면의 상관 회복(0.128 → 0.755)에 더해, 길이를 통제했을 때도 CER 역전이 사라진 것으로 회복을 확인했습니다. 썸네일을 누르면 원본 크기로 볼 수 있습니다.',
        items: [
          {
            src: '/images/evidence/voice/length_controlled_cer.png',
            alt: '길이 통제 CER — 융합 통로 재학습 후 역전 해소',
            caption: '길이를 통제해도 CER 역전이 사라진 상태',
          },
        ],
      },
      {
        label: '문제 진단',
        layout: 'gallery',
        desc: '발화가 짧을수록 터지는 환각률과, 평균과 중앙값의 괴리로 환각 폭발의 구조를 드러냈습니다. 썸네일을 누르면 원본 크기로 볼 수 있습니다.',
        items: [
          {
            src: '/images/evidence/voice/hall_rate_by_length.png',
            alt: '발화 길이 구간별 환각률 — 10자 이하 70.5%',
            caption: '길이별 환각률: 10자 이하 발화 70.5%',
          },
          {
            src: '/images/evidence/voice/mean_vs_median.png',
            alt: '평균 CER과 중앙값 CER의 괴리',
            caption: '평균과 중앙값의 괴리를 환각 지표로 사용',
          },
        ],
      },
      {
        label: '원인 분리와 검증',
        layout: 'gallery',
        desc: '양자화·섭동·개입 단계를 통제해 오디오 입력 경로가 원인임을 좁혔습니다.',
        items: [
          {
            src: '/images/evidence/voice/nf4_vs_bf16.png',
            alt: 'NF4 양자화와 BF16 비교 — 양자화 제거 대조군에서도 환각 보존',
            caption: '양자화는 근본 원인이 아님(대조군에서 환각 보존)',
          },
          {
            src: '/images/evidence/voice/perturbation.png',
            alt: 'SNR·무음 마스킹·오류 모드 섭동 실험',
            caption: 'SNR·무음 마스킹 섭동으로 본 오류 모드',
          },
          {
            src: '/images/evidence/voice/stage1_vs_stage2_audio_gap.png',
            alt: 'stage1과 stage2의 audio-gap — short 개선, long 부작용',
            caption: '개입 단계별 audio-gap: short 개선, long 부작용',
          },
        ],
      },
      {
        label: '한계 규명·부수 발견',
        layout: 'gallery',
        desc: '표현층 개입의 한계와, 오디오 임베딩에 실제로 정보가 담겨 있음을 외부 대조로 확인했습니다.',
        items: [
          {
            src: '/images/evidence/voice/pron6_3way.png',
            alt: '발음 6개 3-way 비교 — 표현층 개입이 무력한 구간',
            caption: '발음 6개: 표현층 개입이 듣지 못한 구간',
          },
          {
            src: '/images/evidence/voice/long_3way.png',
            alt: '긴 발화 3-way 비교 — audio_tower 교정 순효과 +9',
            caption: '긴 발화: audio_tower 교정 순효과 +9',
          },
          {
            src: '/images/evidence/voice/emotion_probe.png',
            alt: '오디오 임베딩만으로 감정 분류 49.5% (chance 33%)',
            caption: '오디오 임베딩만으로 감정 49.5%(chance 33%)',
          },
          {
            src: '/images/evidence/voice/opensmile_gemma.png',
            alt: 'openSMILE 대비 LLM은 방향만 맞히고 수치는 내지 못함',
            caption: 'LLM은 방향만, 정량 수치는 내지 못함',
          },
        ],
      },
    ],
    infoDock: {
      problem:
        '멀티모달 LLM은 짧은 한국어 발화에서 오디오를 듣지 않고 언어 습관으로 문장을 지어냅니다. 10자 이하 발화의 환각률이 70.5%였고, corpus 평균 CER은 소수의 극단 실패에 휘둘렸습니다.',
      insight:
        '먼저 시도한 어텐션 LoRA는 길이를 통제하자 CER이 역전됐습니다. 오디오를 더 들은 게 아니라 과생성을 억제한 부작용이었고, 초기 결론을 철회한 뒤 개입 지점을 오디오 융합 통로로 옮겼습니다.',
      role:
        '환각 평가 지표를 설계하고, 원인 후보를 단일 변수로 분리하고, 오디오 융합 통로 한 지점을 재학습하고, 남은 실패를 외부 모델로 대조 검증하는 일을 맡아 진행했습니다.',
      coreFlow:
        '평가 지표 설계에서 원인 분리, 실패와 철회, 융합 통로 특정·재학습, 한계 규명까지 이어지는 진단·개입 흐름.',
      output:
        '오디오-출력 상관을 0.128에서 0.755(정답 0.737 수준)로 회복하고, 전체 79억 파라미터의 0.0004%(32,768개)만 학습해 길이 통제 CER 역전을 해소했습니다.',
      verification:
        '상관·CER 수치, 실제 전사문 육안 검사, Whisper large-v3 외부 대조 세 방향으로 결과를 교차 확인했습니다.',
      uxWritingPoint:
        '평균 대신 중앙값을 성능 지표로, 평균과 중앙값의 괴리를 환각 지표로 설계해 지표 자체가 무엇을 재는지부터 정의했습니다.',
      learning:
        '점수를 받으면 그 점수가 어떤 분포에서 나왔는지부터 확인하는 순서로 일합니다.',
    },
  },

  eeg: {
    key: 'eeg',
    entranceLine:
      '14채널 소비자급 EEG 단독 입력으로 감정을 실시간 인식하면서, 라벨링 방식의 한계를 지표로 규명한 연구입니다.',
    entranceDetail:
      '학습-추론 라벨 간극을 모델 오류가 아니라 라벨링 방식의 한계로 보고, 검증 지표 두 개를 정의해 데이터 단에서 원인을 규명했습니다.',
    mainWall: {
      src: '/images/evidence/eeg/ieie_poster.png',
      alt: 'IEIE 학회 포스터 — Dual-Stream Transformer for Single 14-Channel EEG Emotion Recognition and Analysis of the Label-Inference Gap',
      caption: 'IEIE 학회 발표 포스터 (Park et al., 서경대). 눌러서 원본 크기로 볼 수 있습니다.',
    },
    heroStats: [
      { value: '75.1%', label: 'trial 정확도 · 14채널 EEG 단독' },
      { value: '+6.9%p', label: '5종 생체신호 LightGBM(68.2%) 대비' },
      { value: '83.1%', label: '비중첩 인접 segment 일관성' },
    ],
    casePanels: [
      {
        eyebrow: 'problem framing',
        title: '학습과 추론의 라벨이 어긋난다',
        body: '60초 영상 하나에 라벨 하나를 붙이는 방식은 1초 단위 추론과 어긋납니다. 감정은 60초 내내 변하기 때문입니다. 이 어긋남을 모델 성능 문제로 뭉뚱그리지 않고, 라벨링 방식이 만든 구조적 한계로 분리해 보았습니다.',
      },
      {
        eyebrow: 'metric design',
        title: '검증 지표 두 개를 정의하고 누수를 차단',
        body: 'segment-trial 정합도와 인접 segment 일관성 두 지표를 정의해 라벨 간극을 정량화했습니다. trial 단위로 학습·검증을 분리해 같은 trial의 segment가 양쪽에 섞이는 데이터 누수를 차단했습니다.',
      },
      {
        eyebrow: 'self-check',
        title: '자기 방법의 허점을 비중첩으로 재측정',
        body: '인접 segment 일관성이 75% 중첩 슬라이딩 윈도우 때문에 부풀려졌을 가능성을 의심해, 비중첩 조건을 따로 만들어 재측정했습니다. 그 조건에서도 인접 일관성 83.1%가 유지됐습니다.',
      },
    ],
    evidence: [],
    evidenceGroups: [],
    infoDock: {
      problem:
        '60초 영상 하나에 라벨 하나를 붙이는 방식은 1초 단위 추론과 어긋납니다. 감정은 60초 내내 변하기 때문입니다.',
      insight:
        '이 어긋남을 모델 오류가 아니라 라벨링 방식의 한계로 보고, 검증 지표 두 개(segment-trial 정합도, 인접 segment 일관성)를 정의해 원인을 데이터 단에서 규명했습니다.',
      role:
        '공동 연구에서 문제를 제기하고 검증 지표를 정의하는 데 참여했습니다. IEIE 학회에 논문·포스터로 발표했습니다.',
      coreFlow:
        '라벨 간극 정의에서 지표 두 개 설계, 데이터 누수 차단, 비중첩 재측정으로 이어지는 검증 흐름.',
      output:
        '14채널 EEG 단독으로 trial 정확도 75.1%를 얻어 5종 생체신호 LightGBM 베이스라인(68.2%)을 6.9%p 앞섰고, 비중첩 조건에서 재측정해도 인접 일관성 83.1%가 유지됐습니다.',
      verification:
        '5-fold 교차검증, 1D CNN 제거 시 정확도 급락(절제실험), 비중첩 재측정으로 결과를 검증했습니다.',
      uxWritingPoint:
        'segment-trial 정합도와 인접 segment 일관성을 지표로 정의해, 라벨링 방식이 무엇을 왜곡하는지를 수치로 드러냈습니다.',
      learning:
        '내 방법이 좋아 보이면 그 수치가 실험 설정 때문에 부풀려진 건 아닌지부터 다른 조건으로 재측정합니다.',
    },
  },

  ddingdong: {
    key: 'ddingdong',
    entranceLine:
      '놓치면 안 되는 소리를 실시간 감지해 알리는, 센서부터 ML·서버·알림까지 전 계층을 1인 설계·구현한 시스템으로, 현재 진행 중입니다.',
    entranceDetail:
      '한 단계라도 끊기면 알림이 무의미해지므로, 모델 정확도가 아니라 데이터가 흐르는 전 구간을 책임지고 설계했습니다.',
    mainWall: {
      src: '/images/evidence/ddingdong/system_diagram.png',
      alt: '소리 알림 시스템 구성도 — 센서·펌웨어·서버·ML·알림·대시보드 전 계층',
      caption: '센서에서 알림까지 전 계층을 잇는 시스템 구성',
    },
    casePanels: [
      {
        eyebrow: 'sensor',
        title: 'ToF 채택: 초음파를 기각하다',
        body: '초음파 센서는 소리를 내 마이크 수집에 간섭합니다. 소리 감지가 핵심인 시스템에서 센서가 소음원이 되면 안 되므로, 레이저 기반 ToF로 바꿔 위치 감지와 소리 수집을 분리했습니다.',
      },
      {
        eyebrow: 'matching',
        title: 'DTW+cosine 확정: 코사인 단독의 한계',
        body: '코사인 단독은 초인종 누름 길이 차이에 흔들렸습니다. DTW로 시간축을 정렬한 뒤 코사인으로 주파수를 비교하도록 바꿔, 초인종과 화재경보 분리 마진 8.418로 화재경보 오탐을 걸렀습니다.',
      },
      {
        eyebrow: 'alerting',
        title: '2단계 알림: 속도와 정보량을 함께',
        body: '1차는 5초 내 텍스트로 즉시 알리고, 2차는 사진과 STT 자막으로 맥락을 채웁니다. /detect와 /enrich를 분리해 속도와 정보량을 함께 확보했고, 서버 파이프라인은 100회 측정에서 평균 61.7ms였습니다.',
      },
    ],
    aiUsage: {
      intro:
        '소리 알림 시스템을 만드는 과정에서, AI 도구를 코드를 대신 써 주는 생성기가 아니라 하드웨어를 발주하기 전에 리스크를 먼저 검증하는 도구로 썼습니다. AI 제안도 그대로 받지 않고 자가검증을 거쳐 채택했습니다.',
      blocks: [
        {
          step: '사전 검증',
          eyebrow: 'pre-flight',
          title: '발주 전 하드웨어 리스크를 코드 레벨로 먼저 검증',
          scanResult: '발주 전에 바꾼 설계 3건',
          usedWhen: '센서·부품을 실제로 사기 전, 간섭·타이밍 리스크를 미리 확인하는 단계',
          how: [
            'Claude Code와 MCP로 초음파-마이크 간섭 시나리오를 코드 레벨로 먼저 돌려, 실물 없이 리스크를 재현했습니다.',
            '재현 결과를 근거로 센서·타이밍·수집 경로 설계 세 가지를 발주 전에 바꿨습니다.',
          ],
          output: '실물 발주 전에 미리 바로잡은 설계 3건',
        },
        {
          step: '기록',
          eyebrow: 'decision log',
          title: '결정을 커밋 해시와 함께 SSoT로 관리',
          scanResult: '커밋 해시로 추적되는 decisions.md',
          usedWhen: '왜 이 설계로 정했는지를 나중에 다시 확인해야 할 때',
          how: [
            'decisions.md에 각 결정을 배경·대안·근거와 함께 남기고, 관련 커밋 해시를 붙여 단일 출처로 관리했습니다.',
            '설계가 바뀌면 기록도 함께 갱신해, 폐기한 접근과 채택한 접근이 한 문서에서 추적되게 했습니다.',
          ],
          output: '커밋 해시로 추적되는 단일 결정 기록',
        },
        {
          step: '자가 검증',
          eyebrow: 'self-review',
          title: 'AI 제안도 3단계로 되짚어 채택',
          scanResult: '틀린 가정을 실제 타겟에 맞춰 뒤집음',
          usedWhen: 'AI가 낸 코드·구성 제안을 그대로 받을지 판단하는 단계',
          how: [
            'AI 제안을 효율성·리팩토링·오류 방지 3단계로 되짚어, 근거가 약한 제안은 걸렀습니다.',
            'AI가 가정한 "다크 테마" 대시보드가 실제 사용자(청각장애 1인 가구)에 맞지 않는다고 보고, 타겟에 맞춰 뒤집었습니다.',
          ],
          output: '자가검증으로 걸러 채택한 구현, WiFi 작업 약 40% 단축',
        },
      ],
    },
    evidence: [],
    evidenceGroups: [
      {
        label: '시스템',
        desc: '센서·서버·ML·알림·대시보드 전 계층의 화면과 흐름입니다. (이미지 준비 중)',
        items: [
          {
            src: '/images/evidence/ddingdong/dashboard.png',
            alt: 'React 대시보드 화면 — 감지 이벤트와 알림 상태',
            caption: 'React 대시보드: 감지 이벤트·알림 상태 (준비 중)',
          },
          {
            src: '/images/evidence/ddingdong/flow.png',
            alt: '데이터 흐름도 — 마이크 수집부터 YAMNet 추론, 검증, 알림 발송까지',
            caption: '수집에서 알림까지의 데이터 흐름 (준비 중)',
          },
        ],
      },
    ],
    infoDock: {
      problem:
        '중증 청각장애 1인 가구는 초인종·노크·화재경보를 인지하지 못해 안전에 위협을 받습니다. 기존 제품은 수동 버튼식이라 소리를 자동 분류하지 못합니다.',
      insight:
        '한 단계라도 끊기면 알림 전체가 무의미해지므로, 모델 정확도 하나가 아니라 소리(ML)와 위치(센서) 2중 검증으로 옆집 오탐까지 막는 전 구간 설계가 핵심이라고 봤습니다.',
      role:
        '마이크 수집부터 YAMNet 추론, DTW+코사인 2단계 오탐 검증, 서버, 알림 발송, 대시보드까지 데이터 흐름 전 구간을 1인으로 직접 설계하고 구현했습니다.',
      coreFlow:
        '마이크 수집에서 YAMNet 추론, DTW+코사인 검증, 위치 센서 대조, 서버, 2단계 알림, 대시보드까지 이어지는 end-to-end 흐름.',
      output: [
        '완료: React 대시보드·Flask 서버·YAMNet 예비 학습(test 88.7% / macro_f1 0.848, 공개 데이터 기준), 서버 파이프라인 평균 61.7ms.',
        '진행 중: 마이크·ToF 결선, 카카오톡 연동, 한국 환경음 자체 녹음 후 2차 파인튜닝. 목표 정확도 90%, 11월 전시.',
      ],
      verification: [
        '발주 전 Claude Code로 간섭 시나리오를 코드 레벨로 먼저 돌려 설계 세 가지를 변경.',
        '폐기한 접근을 정직하게 기록: 학교 WiFi(802.1X) 폐기, pitch-shifting 증강 기각, 공개 화재경보 데이터 약 65%가 차량 사이렌이라 전량 제외.',
        '소리(ML)와 위치(센서) 2중 검증, 초인종·화재경보 분리 마진 8.418로 오탐 차단.',
      ],
      uxWritingPoint:
        '완료 수치(예비 학습 88.7%)와 목표 수치(90%)를 분리해 표기하고, 1차 즉시 알림과 2차 맥락 보강 알림을 나눠 놓치면 안 되는 정보가 먼저 도달하게 설계했습니다.',
      learning:
        '부품을 사기 전에 간섭 시나리오부터 코드로 돌려, 실물에서 터질 문제를 발주 전에 바로잡는 순서로 일합니다.',
    },
  },
}
