// GSAP 이징 — 디자인 시스템 모션 토큰(§16.2)을 CustomEase로 1:1 등록 (모듈 1회 평가)
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(CustomEase)

export const EASE_DEFAULT = CustomEase.create('easeDefault', '0.22,1,0.36,1')
export const EASE_PAPER = CustomEase.create('easePaper', '0.34,1.56,0.64,1')
export const EASE_ROOM = CustomEase.create('easeRoom', '0.76,0,0.24,1')
export const EASE_FLIP = CustomEase.create('easeFlip', '0.16,1,0.3,1')

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
