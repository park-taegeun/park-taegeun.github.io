// 이미지 로드 실패 시 회색 placeholder로 대체 — 아직 넣지 않은 근거 이미지 자리를 명확히 보여준다.
// 파일명을 모노로 표기해 "여기에 무엇을 넣어야 하는지"를 드러낸다.
import type { SyntheticEvent } from 'react'

export function placeholderSvg(label: string, w = 800, h = 500): string {
  const safe = label.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}'>` +
    `<rect width='100%' height='100%' fill='#EEF1F5'/>` +
    `<rect x='8' y='8' width='${w - 16}' height='${h - 16}' fill='none' stroke='#C3CAD6' stroke-dasharray='6 6'/>` +
    `<text x='50%' y='47%' text-anchor='middle' font-family='IBM Plex Mono, monospace' font-size='20' fill='#586173'>placeholder · 준비 중</text>` +
    `<text x='50%' y='55%' text-anchor='middle' font-family='IBM Plex Mono, monospace' font-size='16' fill='#8A93A3'>${safe}</text>` +
    `</svg>`
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}

/** <img onError={onImgError} /> — 한 번만 대체(무한 루프 방지). 원본 파일명을 placeholder에 표기. */
export function onImgError(e: SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget
  if (img.dataset.fallback) return
  img.dataset.fallback = '1'
  const src = img.getAttribute('src') ?? ''
  const name = src.split('/').pop() || 'image'
  img.src = placeholderSvg(name)
}
