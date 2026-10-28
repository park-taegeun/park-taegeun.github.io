// 프로젝트 1층(카드) 데이터. 문장은 원천 문서 01~04의 「사이트 문장」만 옮긴다.
// 문장 규칙: 합니다체, em-dash 금지, 내부 용어 금지, 숫자 옆에 조건. 빌드 때 scripts/check-content.mjs가 검사한다.

export type ProjectKey = 'ddingdong' | 'jeontongjuro' | 'voice' | 'aivault' | 'decisions-rag' | 'eeg'

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
      '현관에서 나는 초인종, 노크, 화재경보 소리를 구분해 카카오톡으로 알리고, 방문자 사진과 방문자가 한 말의 자막까지 보내는 IoT 시스템입니다.',
    result:
      '현관 기기부터 서버, 카카오톡 알림, 대시보드까지 실제 기기에서 하나로 연결해 동작시켰습니다. 4종 소리 분류 성능은 평가 703클립 기준 macro F1 0.82입니다(개발 중 값).',
    problem:
      '기존 청각장애인용 초인종은 방문자가 버튼을 눌러야 수신기에 불이 켜지는 방식입니다. 노크는 알 수 없고, 누가 와서 무슨 말을 했는지도 전하지 못합니다.',
    role:
      '요구사항 정의, 설계 결정, 하드웨어 결선, 실기기 측정, 검증 설계를 담당했습니다. 코드는 AI 코딩 에이전트(Claude Code)가 작성했고, PR 142건을 하나씩 검토한 뒤 머지했습니다.',
    decision:
      '소리 종류별로 발송 규칙을 나눴습니다. 화재경보는 사람 확인 없이 즉시 보내고, 초인종과 노크는 거리 센서로 문 앞에 사람이 있을 때만 보냅니다.',
    skills: ['데이터 품질 검증', '평가 설계', '하드웨어-서버-앱 통합', 'AI 에이전트 위임과 검증'],
    tech: ['ESP32-S3', 'C++(PlatformIO)', 'Python', 'TensorFlow(YAMNet)', 'Flask', 'SQLite', 'React', 'TypeScript', 'Kakao API', 'Claude Code'],
    glance: {
      metric: 'macro F1 0.82',
      metricCond: '4종 소리 분류 · 평가 703클립 · 개발 중 값',
      verb: '센서부터 카카오톡 알림까지 실기기로 연결했고, 평가셋 누수 79건을 찾아 정확도를 바로잡았습니다.',
      jobTags: ['AI 엔지니어', '임베디드/IoT'],
    },
    previewImage: {
      src: '/images/ddingdong/kakao_3cut.webp',
      alt: '카카오톡 알림 세 장면. 초인종 텍스트 알림, 방문자 사진, 방문자가 한 말의 자막',
      caption: '초인종이 울리면 텍스트 알림이 먼저 오고, 이어서 방문자 사진과 음성 자막이 도착합니다.',
    },
    og: {
      title: '띵동 · 현관 소리 알림 시스템 | 박태근',
      description: '초인종·노크·화재경보를 구분해 카카오톡으로 알리는 IoT 시스템. 4종 분류 macro F1 0.82(평가 703클립, 개발 중 값), PR 142건 검토·머지.',
    },
  },
  {
    key: 'jeontongjuro',
    tier: 'main',
    room: '02',
    name: '전통주로',
    fullName: '공공데이터로 양조장 여행을 잇는 관광 서비스의 백엔드',
    accent: SIGNAL,
    ink: NAVY,
    tone: '#EAEEF2',
    tintSoft: '#F2F4F7',
    anchorId: 'selected-jeontongjuro',
    ownership: '참여',
    kind: '공모전 5인 팀 · 백엔드 데이터 파트',
    period: '2026.07 ~ 09',
    status: '심사 진행 중',
    oneLine:
      '전국 양조장 59곳과 주변 식당·관광지·숙소를 지도와 여행 코스로 묶는 모바일 웹 서비스입니다. 백엔드 2명 중 데이터 파트를 맡아, 4개 기관의 공공데이터를 하나로 잇는 파이프라인과 조회 API 8개를 담당했습니다.',
    result:
      '원본은 고치지 않고 화면으로 나가는 값만 보정해, 접속되지 않는 홈페이지 링크 5곳을 내리면서도 연락 수단이 하나도 없는 양조장은 0곳으로 유지했습니다. 자동완성으로 고른 항목이 검색되지 않던 오류 23건을 없앴고, 조회 API 8개는 모두 배포했습니다.',
    problem:
      '양조장과 제품은 aT, 지정 정보는 농림축산식품부, 주변 관광지는 한국관광공사, 좌표와 연락처는 카카오에 흩어져 있었고 기관 사이에 공통 식별자가 없었습니다. 원본에는 79자에서 끊긴 제품 설명, 특수문자가 변환된 채 저장된 문장, 오타가 난 주소 같은 문제도 있었습니다.',
    role:
      '수집·적재 파이프라인 16단계, 조회 API 8개, 응답 보정 정책 3종, 검증 체계, 한국관광공사 데이터 저장 신청을 맡았습니다(백엔드 저장소 머지 PR 129건 중 55건). 로그인·회원·추천 코스와 배포는 팀원이 맡았습니다. 구현은 Claude Code에 맡기고, 설계 판단·검증·머지는 직접 했습니다.',
    decision:
      'DB에는 원본을 그대로 두고, 화면으로 나가는 값만 응답 단계에서 고쳤습니다. 어떤 값이 원본이고 어떤 값이 보정인지 항상 구분되고, 원본이 나중에 채워지면 보정이 스스로 꺼집니다.',
    skills: ['데이터 파이프라인', 'REST API 설계', '데이터 정합성 검증', '쿼리 성능', '공공데이터 거버넌스', '다직군 협업'],
    tech: ['Java 17', 'Spring Boot 4', 'Spring Data JPA', 'PostgreSQL 16', 'OpenAPI 3.1(springdoc)', 'JUnit 5', '한국관광공사 TourAPI', '공공데이터포털 odcloud', 'Kakao Local API', 'Claude Code'],
    glance: {
      metric: '연락 수단 없는 양조장 0곳',
      metricCond: '응답 기준 · 접속 불가 링크 5곳을 내린 뒤',
      verb: '4개 기관 데이터를 잇고, 원본은 그대로 둔 채 화면으로 나가는 값만 응답 단계에서 보정했습니다.',
      jobTags: ['백엔드', '데이터'],
    },
    previewImage: {
      src: '/images/jeontongjuro/screens.webp',
      alt: '전통주로 실제 서비스 화면 4장. 취향 기반 양조장 추천 홈, 양조장과 주변 장소 지도, 양조장 상세 정보, 양조장 중심 주변 코스',
      caption: '실제 서비스 화면입니다. 화면 디자인과 프론트엔드는 팀원이 맡았고, 상세 화면의 대표 주종, 방문 방식, 한 줄 요약, 연락 버튼은 제가 맡은 상세 API 응답으로 채워집니다.',
    },
    og: {
      title: '전통주로 · 공공데이터 관광 서비스 백엔드 | 박태근',
      description: '2026 관광데이터 활용 공모전 5인 팀 백엔드(데이터 파트). 4개 기관 데이터를 잇는 16단계 파이프라인과 조회 API 8개, 원본은 보존하고 화면 값만 응답 단계에서 보정.',
    },
  },
  {
    key: 'voice',
    tier: 'main',
    room: '03',
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
      '정부 R&D 과제에서 멀티모달 LLM(Gemma 4)의 음성 처리 문제 두 가지를 실험했습니다. 짧은 발화를 받아쓸 때 생기는 환각, 그리고 받아쓴 텍스트에는 남지 않는 목소리 어조를 LLM에 전달하는 문제입니다.',
    result:
      '환각 문제는 오디오가 언어 모델로 들어가는 연결부만 다시 학습해(파라미터 32,768개), 발화 길이를 맞춘 오류율(CER)을 0.31에서 0.21로 낮췄습니다. 어조 문제는 목소리 특징을 LLM 입력으로 바꾸는 모듈을 만들어, 감정 판단 정답률을 시드 3개 평균 +1.1%p 높였습니다(유의한 시드 1개).',
    problem:
      '이 모델은 10자 이하 한국어 발화의 약 70%에서 정답 글자 수보다 오류가 더 많은 출력을 냈습니다. 또 데이터셋에서 대사와 목소리의 감정이 다른 발화를 보면 최종 감정 라벨이 목소리 쪽과 일치한 경우가 대사 쪽보다 6.9배 많았는데, 받아쓴 텍스트에는 이 목소리 정보가 남지 않습니다.',
    role:
      '과제의 음성 분석 파트에서 실험 설계, 결과 검증과 해석, 랩미팅 발표(10회)를 담당했습니다. 실험 코드는 AI 코딩 도구로 작성했고, 출력과 중간 데이터를 원본 기록과 대조해 검증했습니다. 모델 본체와 융합 구조는 팀이 맡았고, 연구 방향은 지도교수님의 지시와 피드백에 따라 조정했습니다.',
    decision:
      '발화 길이를 맞춰 다시 비교하자 오히려 나빠진 학습 방식은 철회했습니다. 학습 1회에서 +2.2%p였던 어조 효과는 시드 3개로 다시 학습해 측정한 뒤 +1.1%p로 낮춰 보고했습니다.',
    skills: ['평가 설계와 지표 검증', '통계 검정(McNemar, 부트스트랩)', 'LLM 부분 학습(LoRA/QLoRA)', '음성 특징 설계', 'AI 위임과 검증'],
    tech: ['Python', 'PyTorch', 'Hugging Face Transformers', 'PEFT(LoRA/QLoRA)', 'bitsandbytes', 'Gemma 4', 'librosa', 'openSMILE', 'jiwer', 'scikit-learn'],
    glance: {
      metric: 'CER 0.31 → 0.21',
      metricCond: '길이를 맞춘 168발화 · 학습 1회',
      verb: '연결부만 다시 학습해 길이를 맞춘 오류율을 낮췄고, 학습 1회로 얻은 어조 효과는 시드 3개로 재측정해 낮춰 보고했습니다.',
      jobTags: ['AI 엔지니어', 'LLM 평가'],
    },
    previewImage: {
      src: '/images/voice/voice_main.svg',
      alt: '왼쪽 막대: 길이를 맞춘 오류율 원래 모델 0.31, 연결부 학습 0.21, 철회한 어텐션 학습 0.52(같은 기준의 167발화 측정). 오른쪽 막대: 오디오 길이와 출력 길이의 상관 원래 0.021, 연결부 학습 0.755, 정답 전사문 0.737',
      caption: '연결부만 다시 학습하자 오류율이 내려가고, 출력 길이가 실제 오디오 길이를 따라가기 시작했습니다. 회색은 철회한 방식입니다.',
    },
    og: {
      title: '멀티모달 LLM 음성 연구 | 박태근',
      description: '정부 R&D 과제 참여. 짧은 발화 환각 문제에서 연결부만 학습해 오류율을 낮추고(길이를 맞춘 CER 0.31 → 0.21), 어조 효과는 시드 3개 재측정 결과 +1.1%p로 보고.',
    },
  },
  {
    key: 'aivault',
    tier: 'main',
    room: '04',
    name: 'AI-Vault',
    fullName: 'AI 에이전트로 운영하는 개인 지식 위키',
    accent: SIGNAL,
    ink: NAVY,
    tone: '#E8ECF2',
    tintSoft: '#F1F4F8',
    anchorId: 'selected-aivault',
    ownership: '주도',
    kind: '개인 프로젝트',
    period: '2026.10 구축 ~ 운영 중',
    oneLine:
      '기술 블로그 209편과 노션 기록 260개를 AI 에이전트(Claude Code)가 읽고 정리해 약 130페이지 규모의 지식 위키로 만들었습니다. 이 중 공개 가능한 약 120페이지는 웹사이트로 배포해 운영하고 있습니다.',
    result:
      'AI가 규칙을 어겨도 사고로 이어지지 않도록 차단 장치를 5겹으로 두었습니다. AI에게 원본 수정, 비밀값 쓰기, 셸 우회 쓰기, push를 일부러 시킨 시연에서 4건 모두 실행 직전에 막혔고, 사람이 키가 든 파일을 직접 커밋해도 커밋 검사가 막았습니다. 위키 품질은 고정 질문으로 측정했고, 새 기록을 반영한 뒤 위키만으로 답한 문항이 5개 중 1개에서 5개로 늘었습니다.',
    problem:
      '블로그 글 209편과 노션 약 1,370페이지에 기록이 흩어져 있어, 필요한 내용을 찾으려면 매번 원본을 다시 뒤져야 했습니다. 정리를 AI에게 맡기면 원본을 고치거나 비공개 내용을 공개 영역에 쓰는 사고 위험도 함께 생깁니다.',
    role:
      '공개 범위와 보호 대상을 정하고, 구조와 안전 원칙 설계, 공개 기준 승인, 실제 환경 검증, 보안 사고 대응, push를 담당했습니다. 스크립트와 훅 초안, 위키 페이지 작성은 Claude Code에 맡기고 결과를 검토해 승인했습니다.',
    decision:
      '규칙을 AI에게 지시만 하는 ‘부탁’(규칙서)과 시스템이 실제로 막는 ‘강제’(훅, 권한, 커밋 검사, 배포 검사)로 나눴습니다. 어기면 사고로 이어지는 규칙만 ‘강제’ 쪽으로 옮겼고, 공개 저장소에 올리는 push는 항상 사람이 직접 합니다.',
    skills: ['AI 에이전트 설계·운영', 'AI 안전장치(거버넌스)', 'LLM 평가 설계', '보안 사고 대응', '자동화 범위 판단'],
    tech: ['Claude Code(훅·스킬·서브에이전트)', 'MCP', 'Python', 'Obsidian', 'Quartz', 'GitHub Actions', 'Git hooks', 'macOS launchd', 'Velog GraphQL API'],
    glance: {
      metric: '위험 시도 4/4 차단',
      metricCond: '시연 1회 · 사람 커밋도 차단',
      verb: 'AI가 실수해도 사고로 번지지 않게 차단 장치를 5겹으로 두고, 위키 품질은 고정 질문으로 측정했습니다.',
      jobTags: ['AX', 'AI 엔지니어'],
    },
    previewImage: {
      src: '/images/aivault/demo_table.svg',
      alt: '안전장치 시연 결과 표. AI에게 시킨 원본 수정, 비밀값 쓰기, 셸 우회 쓰기, push 네 시도와 사람이 키가 든 파일을 직접 커밋한 경우, 각각을 막은 장치',
      caption: 'AI에게 위험한 작업 4가지를 일부러 시킨 시연입니다. 4건 모두 실행 직전에 막혔고, 사람이 같은 실수를 해도 커밋 단계에서 다시 막혔습니다.',
    },
    og: {
      title: 'AI-Vault · AI 에이전트로 운영하는 지식 위키 | 박태근',
      description: '블로그 글 209편과 노션 기록 260개를 AI 에이전트가 정리하는 위키. 차단 장치 5겹, 위험 시도 4/4 차단(시연 1회), 고정 질문으로 품질 측정.',
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
      '졸업작품의 결정 기록 문서(평가 당시 약 6,200줄)에서 과거 결정과 폐기된 안을 찾아 주는 RAG 검색기입니다. AI 코딩 에이전트가 작업 전에 MCP 도구로 호출해 과거 결정을 확인합니다.',
    result:
      '결과를 보기 전에 평가 문항 30개와 채택 규칙을 먼저 고정하고 평가했습니다. 기준선의 오답·부분 정답 21건 중 19건이 검색 실패여서, 답변 모델보다 검색을 먼저 개선해야 한다고 판단했습니다. 기존 문항에서 효과가 있어 보인 질의 재작성도 held-out 문항에서는 검색 적중이 늘었지만 정답이 1문항 줄어, 미리 정한 규칙에 따라 채택하지 않았습니다.',
    role:
      '설계 방향과 채택 규칙 승인, 블라인드 채점 확인과 일부 직접 채점, 인덱스 생성과 평가 실행, MCP 등록과 시연을 담당했습니다. 코드와 테스트, 평가 문항 초안은 Claude Code가 작성했습니다.',
    skills: ['평가 설계', 'RAG 진단', '사전 등록', 'AI 위임과 검증'],
    tech: ['Python', 'LlamaIndex', 'Chroma', 'OpenAI 임베딩', 'BM25', 'Ollama', 'MCP Python SDK'],
    glance: {
      metric: '오답·부분 정답 19/21이 검색 실패',
      metricCond: '기준선 30문항 · 실행 1회',
      verb: '채택 규칙을 먼저 고정하고, 효과가 있어 보인 개선안을 held-out 평가로 걸러 냈습니다.',
      jobTags: ['AI 엔지니어'],
    },
    previewImage: {
      src: '/images/rag/rag_table.svg',
      alt: 'decisions-rag 실험 판정 표. 기준선, 폐기안 표시, 하이브리드, 질의 재작성, 로컬 모델 비교와 판정',
      caption: '실험 5가지와 판정 결과입니다. 효과가 있어 보여도 미리 정한 규칙을 통과하지 못하면 채택하지 않았습니다.',
    },
    og: {
      title: 'decisions-rag · 결정 기록 검색기 | 박태근',
      description: '결정 기록 RAG 검색기와 사전 등록 평가. 오답·부분 정답 21건 중 19건이 검색 실패라는 진단, held-out 평가로 효과가 확인되지 않은 개선안을 걸러 냄.',
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
      '소비자용 14채널 뇌파 기기만으로 1초마다 감정을 추론하는 공동 연구입니다. 60초 영상 단위 라벨로 학습한 모델이 1초 단위로 추론할 때 생기는 불일치를 지표로 분석했습니다.',
    result:
      '뇌파만으로 trial 정확도 75.1%를 기록해, 생체신호 5종을 함께 쓰는 공개 기준 모델(68.2%)보다 6.9%p 높았습니다. 같은 정규화를 적용한 기준 모델(73.3%)과 비교하면 차이는 1.8%p입니다.',
    role:
      '공동 연구에서 라벨-추론 간극을 재는 지표 두 개를 정의하고, 겹치지 않는 조건에서 그 지표를 다시 측정했습니다. 정규화 기준으로 쓰는 trial을 학습·평가에서 빼고, trial 단위로 나눠 데이터 누수를 막는 일도 맡았습니다.',
    skills: ['평가 지표 설계', '결과 재검증', '시계열 신호 처리', '실시간 추론'],
    tech: ['Python', 'PyTorch', 'SciPy', 'scikit-learn', 'LightGBM'],
    glance: {
      metric: 'trial 정확도 75.1%',
      metricCond: '5-fold 교차검증 · 108명 × 50 trial',
      verb: '라벨-추론 간극을 재는 지표 두 개를 정의하고, 겹치지 않는 조건에서 다시 측정했습니다.',
      jobTags: ['AI 엔지니어'],
    },
    previewImage: {
      src: '/images/eeg/eeg_results.svg',
      alt: 'EEG 결과 막대. 생체신호 5종 LightGBM 68.2%, 뇌파에 같은 정규화를 적용한 LightGBM 73.3%, 이중 스트림 모델 75.1%',
      caption: '논문은 같은 정규화를 적용한 기준 모델과 비교해 모델 구조만의 효과(+1.8%p)를 따로 보였습니다.',
    },
    og: {
      title: 'EEG 감정 인식 · 라벨-추론 간극 분석 | 박태근',
      description: '14채널 뇌파만으로 trial 정확도 75.1%(5-fold). 라벨-추론 간극 지표 정의와 겹치지 않는 조건 재측정. 2026 대한전자공학회 하계종합학술대회 논문 4인 중 3저자.',
    },
  },
]

export const MAIN_PROJECTS = PROJECTS.filter((p) => p.tier === 'main')
export const SIDE_PROJECTS = PROJECTS.filter((p) => p.tier === 'side')
export const projectByKey = (key: ProjectKey) => PROJECTS.find((p) => p.key === key)!
