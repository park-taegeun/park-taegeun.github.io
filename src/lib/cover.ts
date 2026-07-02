// 전환 커버 오버레이 API — CoverOverlay(App 상주)가 마운트 시 등록하는 싱글톤.
// 시그니처 진입(§6 원확산)·뒤로가기 크로스페이드·reduced-motion 페이드가 공유한다.
export interface CoverApi {
  /** 커버 등장. circle=원확산(§6②), fade=크로스페이드(reduced/뒤로가기) */
  coverIn(tone: string, mode: 'circle' | 'fade', duration: number): Promise<void>
  /** 커버 제거(페이드 아웃) */
  coverOut(duration: number): Promise<void>
}

let api: CoverApi | null = null

export function setCoverApi(next: CoverApi | null): void {
  api = next
}

export function getCoverApi(): CoverApi | null {
  return api
}
