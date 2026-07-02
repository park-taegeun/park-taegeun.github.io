// 라벨 (design-direction §0.1-1) — 영문: Pretendard 600 대문자 자간 .18em (스위스 라벨)
// 한글: Pretendard 500, 대문자 없음. JetBrains Mono는 진짜 코드성 텍스트에만 (여기서 다루지 않음).
import { createElement, type ElementType, type ReactNode } from 'react'

interface LabelProps {
  as?: ElementType
  lang?: 'en' | 'ko'
  /** 더 흐린 라벨(#94A3B8)은 큰 텍스트 옆 보조용만 — 본문 단독 사용 금지(a11y 대비) */
  className?: string
  children: ReactNode
}

export const labelEnClass =
  'font-body font-semibold uppercase tracking-[0.18em] text-text-muted text-[11.5px]'
const labelKoClass = 'font-body font-medium tracking-normal text-text-muted text-[13px]'

export default function Label({ as = 'p', lang = 'en', className = '', children }: LabelProps) {
  return createElement(as, { className: `${lang === 'en' ? labelEnClass : labelKoClass} ${className}` }, children)
}
