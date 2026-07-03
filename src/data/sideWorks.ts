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
    period: '멋쟁이사자처럼 13기 · 2025',
    oneLine:
      '동네 전통시장과 사용자를 잇는 식생활 큐레이션 플랫폼의 프론트엔드를 맡아, 지도·검색·포인트전환·마이페이지 화면을 구현했습니다.',
    chips: ['React', 'Kakao Maps API', '프론트엔드', '팀 협업'],
    question:
      '시장-사용자 거리를 정확한 지도 API로 계산할지, 빠른 직선거리로 계산할지 팀 의견이 갈렸습니다.',
    approach:
      '"어느 쪽이 더 정확한가"가 아니라 "우리 서비스에 무엇이 맞는가"로 질문을 바꿨습니다. 이 거리는 카드용 참고값이지 길안내가 아니므로, 정확도보다 응답 속도와 호출 제한 없는 안정성이 우선이라고 비교표로 정리해 공유했습니다.',
    process:
      '직선거리(Haversine)를 도보·차량 속도로 나눠 시간으로 환산하는 로직을 컴포넌트로 구현했습니다.',
    output: '247팀 중 상위 10%로 본선에 진출했습니다.',
    learning:
      '의견이 갈리면 누구 말이 맞는지보다 무엇을 위한 결정인지부터 팀과 맞춥니다.',
    demoVideo: {
      youtubeId: '1Yx7-71lB_k',
      thumb: 'https://i.ytimg.com/vi/1Yx7-71lB_k/oardefault.jpg',
      title: 'PICKL 앱 데모 영상',
      caption: '해커톤에서 구현한 지도·검색·포인트전환·마이페이지 화면의 실제 동작 데모.',
      href: 'https://youtu.be/1Yx7-71lB_k',
    },
    supportingImages: [
      {
        src: '/images/side/pickl_map.png',
        alt: 'PICKL 지도 화면 — 카카오 지도 위에 전통시장 위치와 거리 표시',
        caption: '지도 화면: 시장 위치와 거리 표시',
        kind: 'portrait',
        size: 'md',
      },
      {
        src: '/images/side/pickl_mypage.png',
        alt: 'PICKL 마이페이지 화면 — 포인트 전환과 사용자 정보',
        caption: '마이페이지: 포인트 전환',
        kind: 'portrait',
        size: 'md',
      },
    ],
  },
]
