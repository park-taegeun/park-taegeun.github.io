// 프로젝트 1층(카드) 데이터. 문장은 원천 문서 01~04의 「사이트 문장」만 옮긴다.
// 문장 규칙: 합니다체, em-dash 금지, 내부 용어 금지, 숫자 옆에 조건. 빌드 때 scripts/check-content.mjs가 검사한다.

export type ProjectKey = 'ddingdong' | 'voice' | 'aivault' | 'decisions-rag' | 'eeg'

export interface Project {
  key: ProjectKey
  /** main = 대표 작업(WORK), side = 그 외 작업(SIDE)의 축약 상세 */
  tier: 'main' | 'side'
  room: string
  /** 짧은 이름(제목·플립 타이틀) */
  name: string
  /** 부제(무엇인지 한 줄) */
  fullName: string
  accent: string
  ink: string
  tone: string
  tintSoft: string
  anchorId: string
  /** 주도/참여 태그 */
  ownership: '주도' | '참여'
  kind: string
  period: string
  status?: string
  oneLine: string
  result: string
  problem?: string
  role: string
  decision?: string
  /** 보여 주는 역량 태그 */
  skills: string[]
  /** 카드용 기술(10개 이내) */
  tech: string[]
  /** 한눈에 보기 카드 */
  glance: {
    metric: string
    metricCond: string
    verb: string
    jobTags: string[]
  }
  previewImage: {
    src: string
    alt: string
    caption: string
  }
  /** 링크 미리보기 문구(상세 페이지별) */
  og: { title: string; description: string }
}

const NAVY = '#1A2B4A'
const SIGNAL = '#0E7C86'

export const PROJECTS: Project[] = [
  {
    key: 'ddingdong',
    tier: 'main',
    room: '01',
    name: '띵동',
    fullName: '청각장애인 1인 가구를 위한 현관 소리 알림 시스템',
    accent: SIGNAL,
    ink: NAVY,
    tone: '#E6EDEC',
    tintSoft: '#EEF2F1',
    anchorId: 'selected-ddingdong',
    ownership: '주도',
    kind: '개인 졸업작품',
    period: '2026.05 ~ 진행 중',
    status: '11월 최종 발표',
    oneLine:
      '현관에서 나는 초인종·노크·화재경보를 구분해 카카오톡으로 알리고, 방문자 사진과 방문자가 한 말의 자막까지 보내는 IoT 시스템입니다.',
    result:
      '현관 기기부터 서버·카카오톡·대시보드까지 실제 기기로 연결해 동작시켰고, 4종 소리 분류는 평가 703클립에서 macro F1 0.82입니다(개발 중 값).',
    problem:
      '국내 청각장애인용 초인종은 방문자가 버튼을 눌러야 수신기에 불이 켜지는 방식이라, 노크는 알 수 없고 누가 왔는지·무슨 말을 했는지도 전하지 못합니다.',
    role:
      '요구사항, 설계 결정, 하드웨어 결선, 실기기 측정, 검증 설계를 맡았습니다. 코드는 AI 코딩 에이전트(Claude Code)에 맡기고 PR마다 검토해 머지했습니다(142건).',
    decision:
      '소리 종류마다 다른 규칙으로 보냅니다. 화재경보는 사람 확인을 건너뛰고 바로, 초인종·노크는 거리 센서로 문 앞에 사람이 있을 때만 보냅니다.',
    skills: ['데이터 품질 검증', '평가 설계', '하드웨어-서버-앱 통합', 'AI 에이전트 위임과 검증'],
    tech: ['ESP32-S3', 'C++(PlatformIO)', 'Python', 'TensorFlow(YAMNet)', 'Flask', 'SQLite', 'React', 'TypeScript', 'Kakao API', 'Claude Code'],
    glance: {
      metric: 'macro F1 0.82',
      metricCond: '4종 소리 분류 · 평가 703클립 · 개발 중 값',
      verb: '센서부터 카카오톡까지 실기기로 잇고, 평가셋 누수 79건을 찾아 정확도 표기를 바로잡았습니다.',
      jobTags: ['AI 엔지니어', '임베디드/IoT'],
    },
    previewImage: {
      src: '/images/ddingdong/kakao_3cut.webp',
      alt: '카카오톡 알림 세 장면. 초인종 텍스트 알림, 방문자 사진, 방문자가 한 말의 자막',
      caption: '초인종이 울리면 텍스트 알림, 방문자 사진, 방문자가 한 말의 자막이 차례로 도착합니다.',
    },
    og: {
      title: '띵동 · 현관 소리 알림 시스템 | 박태근',
      description: '초인종·노크·화재경보를 구분해 카카오톡으로 알리는 IoT 시스템. 4종 분류 macro F1 0.82(평가 703클립, 개발 중 값), PR 142건 검토·머지.',
    },
  },
  {
    key: 'voice',
    tier: 'main',
    room: '02',
    name: '멀티모달 LLM 음성 연구',
    fullName: '짧은 발화 환각 진단과 어조 모듈 검증',
    accent: SIGNAL,
    ink: NAVY,
    tone: '#E7EDF1',
    tintSoft: '#EFF3F6',
    anchorId: 'selected-voice',
    ownership: '참여',
    kind: '정부 R&D 과제 학부연구생',
    period: '2026.06 ~ 진행 중',
    oneLine:
      '멀티모달 LLM(Gemma 4)이 음성을 받을 때 생기는 두 문제를 정부 과제에서 맡아 실험했습니다. 짧은 말을 받아쓸 때 생기는 환각, 그리고 글자에 남지 않는 목소리 어조를 LLM에 넘기는 일입니다.',
    result:
      '짧은 발화 환각은 오디오가 언어 모델로 들어가는 연결부만 다시 학습해(파라미터 32,768개), 길이를 맞춘 비교에서 오류율(CER)을 0.31에서 0.21로 낮췄습니다. 어조는 LLM 입력으로 넘기는 실시간 모듈(발화 1초당 57ms)을 만들었고, 감정 판단 정답률을 시드 3회 평균 +1.1%p 올렸습니다.',
    problem:
      '이 모델은 10자 이하 한국어 발화의 약 70%에서 정답 글자 수보다 오류가 많은 출력을 냈습니다. 또 대사와 목소리의 감정이 어긋난 발화에서 최종 감정 판정은 목소리 쪽과 같은 경우가 대사 쪽보다 6.9배 많았는데, 받아쓴 글자에는 이 정보가 남지 않습니다.',
    role:
      '과제의 음성 분석 항목에서 실험 설계, 결과 검증과 해석, 랩미팅 발표(10회)를 맡았습니다. 실험 코드는 AI 코딩 도구에 맡기고, 출력과 중간 데이터를 원래 기록과 대조해 검증했습니다. 모델 본체와 융합 구조는 팀 몫이고, 연구 방향은 지도교수 지시와 피드백에 따라 조정했습니다.',
    decision:
      '좋은 결과일수록 조건을 바꿔 다시 쟀습니다. 길이를 맞추자 오히려 나빠진 학습 방식은 철회했습니다. 학습 1회에서 +2.2%p였던 어조 효과는 시드 3회로 다시 재서 +1.1%p로 낮춰 보고했습니다.',
    skills: ['평가 설계와 지표 검증', '통계 검정(McNemar, 부트스트랩)', 'LLM 부분 학습(LoRA/QLoRA)', '음성 특징 설계', 'AI 위임과 검증'],
    tech: ['Python', 'PyTorch', 'Hugging Face Transformers', 'PEFT(LoRA/QLoRA)', 'bitsandbytes', 'Gemma 4', 'librosa', 'openSMILE', 'jiwer', 'scikit-learn'],
    glance: {
      metric: 'CER 0.31 → 0.21',
      metricCond: '길이를 맞춘 168발화 · 학습 1회',
      verb: '좋은 결과일수록 조건을 바꿔 다시 쟀고, 학습 1회 효과는 시드 3회로 다시 재서 낮춰 보고했습니다.',
      jobTags: ['AI 엔지니어', 'LLM 평가'],
    },
    previewImage: {
      src: '/images/voice/voice_main.svg',
      alt: '왼쪽 막대: 길이를 맞춘 오류율 원래 모델 0.31, 연결부 학습 0.21, 철회한 어텐션 학습 0.52. 오른쪽 막대: 오디오 길이와 출력 길이의 상관 원래 0.021, 연결부 학습 0.755, 정답 전사문 0.737',
      caption: '연결부만 다시 학습하자 길이를 맞춘 오류율이 내려가고, 출력 길이가 오디오 길이를 따라가기 시작했습니다. 회색은 철회한 방식입니다.',
    },
    og: {
      title: '멀티모달 LLM 음성 연구 | 박태근',
      description: '정부 R&D 과제 참여. 짧은 발화 환각을 연결부 학습으로 낮추고(길이 통제 CER 0.31 → 0.21), 어조 효과는 시드 3회로 다시 재서 +1.1%p로 보고.',
    },
  },
  {
    key: 'aivault',
    tier: 'main',
    room: '03',
    name: 'AI-Vault',
    fullName: 'AI 에이전트가 정리하고 지키는 개인 지식 위키',
    accent: SIGNAL,
    ink: NAVY,
    tone: '#E8ECF2',
    tintSoft: '#F1F4F8',
    anchorId: 'selected-aivault',
    ownership: '주도',
    kind: '개인 프로젝트',
    period: '2026.10 구축 ~ 운영 중',
    oneLine:
      '기술 블로그 209편과 노션 기록 260개를 AI 에이전트(Claude Code)가 읽고 정리·연결·유지하는 지식 위키(약 130페이지, 공개 약 120)로 바꾸고, 공개 부분은 웹사이트로 배포해 운영하고 있습니다.',
    result:
      'AI가 규칙을 어겨도 사고가 나지 않도록 차단 장치를 5겹으로 두었고, 시연에서 원본 수정·비밀값 쓰기·우회 쓰기·금지 폴더 읽기·push 다섯 시도가 모두 막혔습니다. 위키 품질은 고정 질문으로 재서, 새 기록을 반영한 뒤 위키만으로 답한 문항이 5개 중 1개에서 5개로 늘었습니다.',
    problem:
      '2백여 편의 기록이 블로그와 노션에 흩어져 있어, 필요한 내용을 찾으려면 매번 원본을 다시 뒤져야 했습니다. 정리를 AI에게 맡기면 원본을 고치거나 비공개 내용을 공개 구역에 쓰는 사고 위험이 따라옵니다.',
    role:
      '무엇을 공개하고 무엇을 지킬지 정했고, 구조와 안전 원칙, 공개 기준 승인, 실제 환경 검증, 보안 사고 대응, push를 맡았습니다. 스크립트·훅 초안과 위키 페이지 작성은 Claude Code에 맡기고 결과를 검토해 승인했습니다.',
    decision:
      'AI에게 하는 「부탁」(규칙서)과 시스템이 막는 「강제」(훅·권한·커밋 검사·배포 검사)를 나눴습니다. 어기면 사고가 나는 규칙만 강제로 옮겼고, 공개 저장소로 내보내는 push는 끝까지 사람이 합니다.',
    skills: ['AI 에이전트 설계·운영', 'AI 안전장치(거버넌스)', 'LLM 평가 설계', '보안 사고 대응', '자동화 범위 판단'],
    tech: ['Claude Code(훅·스킬·서브에이전트)', 'MCP', 'Python', 'Obsidian', 'Quartz', 'GitHub Actions', 'Git hooks', 'macOS launchd', 'Velog GraphQL API'],
    glance: {
      metric: '위험 시도 5/5 차단',
      metricCond: '본인 승인 시연 1회 · 우회 시도 0',
      verb: 'AI에게 맡긴 정리 작업이 사고로 번지지 않게 차단 장치를 5겹으로 두고, 위키 품질은 고정 질문으로 쟀습니다.',
      jobTags: ['AX', 'AI 엔지니어'],
    },
    previewImage: {
      src: '/images/aivault/demo_table.svg',
      alt: '안전장치 시연 결과 표. 원본 수정, 비밀값 쓰기, 셸 우회 쓰기, 금지 폴더 읽기, push 다섯 시도와 각각을 막은 장치',
      caption: 'AI에게 위험한 시도 다섯 가지를 일부러 시킨 시연. 다섯 번 모두 막혔고 AI는 우회하지 않고 보고했습니다.',
    },
    og: {
      title: 'AI-Vault · AI 에이전트가 지키는 지식 위키 | 박태근',
      description: '블로그 209편과 노션 260개를 AI 에이전트가 정리하는 위키. 차단 장치 5겹, 위험 시도 5/5 차단(시연 1회), 고정 질문으로 품질 측정.',
    },
  },
  {
    key: 'decisions-rag',
    tier: 'side',
    room: 'S1',
    name: 'decisions-rag',
    fullName: '결정 기록 검색기와 사전 등록 평가',
    accent: SIGNAL,
    ink: NAVY,
    tone: '#E9EDF0',
    tintSoft: '#F1F4F6',
    anchorId: 'side-decisions-rag',
    ownership: '주도',
    kind: '개발 도구',
    period: '2026.10',
    oneLine:
      '졸업작품의 결정 기록 문서(약 6,200줄)에서 과거 결정과 폐기된 안을 찾아 주는 RAG 검색기입니다. AI 코딩 에이전트가 작업 전에 MCP 도구로 직접 호출합니다.',
    result:
      '결과를 보기 전에 시험지 30문항과 채택 규칙을 먼저 고정하고 평가했습니다. 기준선 오답·부분 정답 21건 중 19건이 검색 실패여서 답변 모델보다 검색을 먼저 고쳐야 한다는 결론을 냈습니다. 원래 시험지에서 좋아 보인 질의 재작성은 숨겨 둔 시험지 15문항에서 검색은 나아졌지만 정답이 1문항 줄어, 미리 정한 규칙대로 채택하지 않았습니다.',
    role:
      '설계 방향과 채택 규칙 승인, 블라인드 채점 확인과 일부 직접 채점, 인덱스 생성과 평가 실행, MCP 등록과 시연을 맡았습니다. 코드와 테스트, 평가 문항 초안은 Claude Code가 작성했습니다.',
    skills: ['평가 설계', 'RAG 진단', '사전 등록', 'AI 위임과 검증'],
    tech: ['Python', 'LlamaIndex', 'Chroma', 'OpenAI 임베딩', 'BM25', 'Ollama', 'MCP Python SDK'],
    glance: {
      metric: '실패 21건 중 19건 = 검색',
      metricCond: '기준선 30문항 · 실행 1회',
      verb: '결과를 보기 전에 채택 규칙을 고정하고, 좋아 보인 개선안을 숨겨 둔 시험지로 걸러 냈습니다.',
      jobTags: ['AI 엔지니어'],
    },
    previewImage: {
      src: '/images/rag/rag_table.svg',
      alt: 'decisions-rag 실험 판정 표. 기준선, 폐기안 표시, 하이브리드, 질의 재작성, 로컬 모델 비교와 판정',
      caption: '실험 다섯 가지와 판정. 좋아 보인 개선도 미리 정한 규칙에 맞지 않으면 채택하지 않았습니다.',
    },
    og: {
      title: 'decisions-rag · 결정 기록 검색기 | 박태근',
      description: '결정 기록 RAG 검색기와 사전 등록 평가. 실패 21건 중 19건이 검색 실패라는 진단, 숨겨 둔 시험지로 겉보기 개선을 걸러 냄.',
    },
  },
  {
    key: 'eeg',
    tier: 'side',
    room: 'S2',
    name: 'EEG 감정 인식',
    fullName: '소비자용 14채널 뇌파 감정 인식과 라벨-추론 간극 분석',
    accent: SIGNAL,
    ink: NAVY,
    tone: '#E8ECF2',
    tintSoft: '#F1F4F8',
    anchorId: 'side-eeg',
    ownership: '참여',
    kind: '학부연구생 공동 연구 · 학회 논문 4인 중 3저자',
    period: '2026.04 ~ 06',
    oneLine:
      '소비자용 14채널 뇌파 기기만으로 1초마다 감정을 추론하는 모델을 만들고, 60초 영상 하나에 라벨 하나를 붙여 학습한 모델이 1초 단위로 추론할 때 생기는 어긋남을 지표로 분석한 공동 연구입니다.',
    result:
      '뇌파 하나만으로 trial 정확도 75.1%를 기록해, 생체신호 5종을 함께 쓰는 공개 기준 모델(68.2%)보다 6.9%p 높았습니다. 같은 정규화를 적용한 기준 모델(73.3%)과 비교하면 차이는 1.8%p입니다.',
    role:
      '공동 연구에서 학습-추론 라벨 간극을 재는 지표 두 개를 정의하고, 겹치지 않는 조건으로 그 지표를 다시 쟀습니다. 기준선으로 쓰는 trial을 학습·평가에서 빼고 trial 단위로 나눠 데이터 누수를 막는 일도 맡았습니다.',
    skills: ['평가 지표 설계', '자기 결과 재검증', '시계열 신호 처리', '실시간 추론'],
    tech: ['Python', 'PyTorch', 'SciPy', 'scikit-learn', 'LightGBM'],
    glance: {
      metric: 'trial 정확도 75.1%',
      metricCond: '5-fold 교차검증 · 108명 × 50 trial',
      verb: '라벨-추론 간극을 재는 지표 두 개를 정의하고, 겹치지 않는 조건으로 다시 쟀습니다.',
      jobTags: ['AI 엔지니어'],
    },
    previewImage: {
      src: '/images/eeg/eeg_results.svg',
      alt: 'EEG 결과 막대. 생체신호 5종 LightGBM 68.2%, EEG와 같은 정규화 LightGBM 73.3%, 이중 스트림 모델 75.1%',
      caption: '같은 정규화를 적용한 기준 모델과 나란히 놓아, 모델 구조의 몫(+1.8%p)을 따로 보였습니다.',
    },
    og: {
      title: 'EEG 감정 인식 · 라벨-추론 간극 분석 | 박태근',
      description: '14채널 뇌파 단독 trial 정확도 75.1%(5-fold). 라벨-추론 간극 지표 정의와 겹치지 않는 조건 재측정. IEIE 2026 하계 논문 3저자.',
    },
  },
]

export const MAIN_PROJECTS = PROJECTS.filter((p) => p.tier === 'main')
export const SIDE_PROJECTS = PROJECTS.filter((p) => p.tier === 'side')
export const projectByKey = (key: ProjectKey) => PROJECTS.find((p) => p.key === key)!
