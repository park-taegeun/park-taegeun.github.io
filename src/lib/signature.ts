// 시그니처 진입/퇴장 오케스트레이션 (design-direction §6)
// 순서 = 읽고(플립) → 덮기(원확산) → 이동 → 커버 persist 상태에서 룸 fade-up. 동시 폭발 금지.
import type { Project } from '../data/projects'
import { getCoverApi } from './cover'
import { scrollToId } from './lenis'
import { prefersReducedMotion } from './motion'

let entering = false

const delay = (s: number) => new Promise<void>((r) => setTimeout(r, s * 1000))
const nextPaint = () =>
  new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())))

/** Selected 블록 → 상세 룸. playFlip은 글자 플립 트리거(클릭 글자 인덱스부터 stagger). */
export async function enterRoom(opts: {
  project: Project
  navigate: (to: string) => void
  playFlip?: (fromLetter: number) => void
  fromLetter?: number
}): Promise<void> {
  if (entering) return
  entering = true
  const to = `/projects/${opts.project.key}`
  try {
    const api = getCoverApi()
    if (!api) {
      opts.navigate(to)
      return
    }
    if (prefersReducedMotion()) {
      // §6 모바일/저성능·reduced: 0.25~0.3s 크로스페이드 + 제목 색만 변경(playFlip 내부 분기)
      opts.playFlip?.(opts.fromLetter ?? 0)
      await api.coverIn(opts.project.tone, 'fade', 0.25)
      opts.navigate(to)
      await nextPaint()
      await api.coverOut(0.25)
      return
    }
    opts.playFlip?.(opts.fromLetter ?? 0) // ① 글자 플립 0.5~0.55s
    await delay(0.3) // ② 원확산은 0.3s 시점 시작(§6 — 플립이 먼저 읽힌 뒤)
    await api.coverIn(opts.project.tone, 'circle', 0.55) // ~0.85s에 화면 덮음
    opts.navigate(to) // ③ 커버 persist 아래에서 룸 마운트
    await nextPaint()
    await api.coverOut(0.4) // 룸 fade-up(0.4s)과 동시 — 룸 배경이 같은 톤이라 이음새 없음
  } catch {
    // 연출 실패해도 목적지 도달은 보장 (graceful degradation)
    opts.navigate(to)
  } finally {
    entering = false
  }
}

/** 룸 → 다음 룸 (RoomExit) — 다음 룸 톤으로 짧은 크로스페이드 (시그니처 플립은 Selected 전용 §0.1-3) */
export async function crossfadeToRoom(
  project: Project,
  navigate: (to: string) => void,
): Promise<void> {
  if (entering) return
  entering = true
  const to = `/projects/${project.key}`
  try {
    const api = getCoverApi()
    if (!api) {
      navigate(to)
      return
    }
    await api.coverIn(project.tone, 'fade', 0.2)
    navigate(to)
    await nextPaint()
    await api.coverOut(0.3)
  } catch {
    navigate(to)
  } finally {
    entering = false
  }
}

/** 상세 룸 → 랜딩. §6: 0.3s 크로스페이드(역재생 아님). targetId가 있으면 해당 Selected 앵커로 복귀. */
export async function exitRoom(navigate: (to: string) => void, targetId?: string): Promise<void> {
  if (entering) return
  entering = true
  const restoreAnchor = async () => {
    if (!targetId) return
    await nextPaint()
    scrollToId(targetId)
  }
  try {
    const api = getCoverApi()
    if (!api) {
      navigate('/')
      await restoreAnchor()
      return
    }
    // §6 뒤로가기 0.3s 크로스페이드 — in 0.15 + out 0.15 = 총 0.3s 해석
    await api.coverIn('#F6F7F9', 'fade', 0.15)
    navigate('/')
    await nextPaint()
    if (targetId) scrollToId(targetId)
    await api.coverOut(0.15)
  } catch {
    navigate('/')
    await restoreAnchor()
  } finally {
    entering = false
  }
}
