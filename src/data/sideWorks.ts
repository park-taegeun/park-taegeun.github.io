export interface SideWorkImage {
  src: string
  alt: string
  caption: string
  kind?: 'wide' | 'portrait' | 'square'
  /** 프레임 높이 override — 미지정 시 primary=lg, supporting=sm */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** supporting 그리드에서 한 줄 전체 차지 (와이드 이미지용) */
  span?: 'full'
  /** 이미지 최대 폭(px) */
  maxW?: number
}

export interface SideWorkLink {
  label: string
  href: string
}

export interface SideWorkVideo {
  /** YouTube video ID (unlisted) — youtube-nocookie 임베드 */
  youtubeId: string
  /** lite-embed 썸네일 (세로 9:16 프레임용, oardefault 권장) */
  thumb: string
  /** iframe title / 재생 버튼 문맥 */
  title: string
  caption: string
  /** 원본 외부 링크(youtu.be) — 새 탭 */
  href?: string
}

export interface SideWork {
  title: string
  eyebrow: string
  oneLine: string
  period?: string
  /** 모티브 — 있을 때만 렌더 */
  motif?: string
  chips: string[]
  question: string
  approach: string
  process: string
  output: string
  learning: string
  backgroundImage?: SideWorkImage
  backgroundPosition?: 'left' | 'right' | 'center'
  /** 대표 시각물 — demoVideo가 있으면 대표 슬롯은 영상이 차지 */
  primaryImage?: SideWorkImage
  /** 대표 슬롯을 대신하는 데모 영상(lite-embed) */
  demoVideo?: SideWorkVideo
  supportingImages: SideWorkImage[]
  links?: SideWorkLink[]
}

export const SIDE_WORKS: SideWork[] = [
  {
    title: 'PICKL',
    eyebrow: 'Hackathon · Frontend',
    period: '참여 · 5인 팀 프론트엔드 · 멋쟁이사자처럼 13기 중앙 해커톤 · 2025',
    oneLine:
      '동네 전통시장과 사용자를 잇는 식재료 큐레이션 서비스에서 프론트엔드를 맡아 지도, 검색, 포인트 전환, 마이페이지 화면을 구현했습니다.',
    chips: ['React', 'Kakao Maps API', '프론트엔드', '팀 협업'],
    question:
      '지도에 가게까지의 거리를 보여 주는 방식을 두고, 지도 API로 실제 도로 거리를 정확히 계산하자는 의견과 좌표 직선거리로 빠르게 계산하자는 의견이 갈렸습니다.',
    approach:
      '거리는 카드에 대략 보여 주는 정보라는 점에서, 직선거리로 계산하되 도보·차량 이동 시간으로 바꿔 보여 주는 방법을 제안했고 기획 담당이 그대로 반영했습니다.',
    process:
      '직선거리(Haversine)를 도보 분속 67m, 차량 분속 250m로 나눠 분 단위 시간으로 환산하는 로직을 컴포넌트로 구현했습니다.',
    output: '247팀 중 상위 10%로 본선에 진출했고, 맡은 화면을 데모까지 완성했습니다.',
    learning:
      '의견이 갈릴 때는 어느 쪽이 맞는지보다, 사용자에게 무엇을 보여 줄지를 기준으로 대안을 찾습니다.',
    demoVideo: {
      youtubeId: '1Yx7-71lB_k',
      thumb: '/images/side/pickl_main.webp',
      title: 'PICKL 앱 데모 영상',
      caption: '해커톤에서 구현한 지도, 검색, 포인트 전환, 마이페이지 화면의 실제 동작 영상입니다.',
      href: 'https://youtu.be/1Yx7-71lB_k',
    },
    supportingImages: [
      {
        src: '/images/side/pickl_map.webp',
        alt: 'PICKL 지도 화면. 카카오 지도 위에 전통시장 위치와 이동 시간 표시',
        caption: '지도 화면: 시장 위치와 이동 시간',
        kind: 'portrait',
        size: 'md',
      },
      {
        src: '/images/side/pickl_mypage.webp',
        alt: 'PICKL 마이페이지 화면. 포인트 전환과 사용자 정보',
        caption: '마이페이지: 포인트 전환',
        kind: 'portrait',
        size: 'md',
      },
    ],
  },
]
