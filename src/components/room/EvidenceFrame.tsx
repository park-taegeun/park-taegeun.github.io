// 증거 액자. 실제 화면·사진·그림이 주인공이고 장식이 증거를 가리지 않는다.
// large: 본문 폭 액자(대표 이미지·결정 옆 그림) / thumb: 균일 높이 썸네일(갤러리).
// onExpand가 있으면 그림 영역만 버튼이 되어 라이트박스로 확대한다(캡션은 버튼 밖).
import type { EvidenceItem } from '../../data/rooms'
import { onImgError } from '../../lib/placeholder'

interface EvidenceFrameProps {
  item: EvidenceItem
  large?: boolean
  thumb?: boolean
  onExpand?: () => void
  /** 첫 화면 이미지(LCP)면 eager */
  priority?: boolean
}

const ZoomIcon = () => (
  <span
    aria-hidden
    className="absolute top-2.5 right-2.5 grid place-items-center h-7 w-7 rounded-full bg-white/90 text-ink opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300"
    style={{ boxShadow: '0 2px 8px rgba(16,26,44,0.12)' }}
  >
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  </span>
)

export default function EvidenceFrame({ item, large = false, thumb = false, onExpand, priority = false }: EvidenceFrameProps) {
  const frameStyle = {
    borderRadius: 'var(--frame-radius)',
    border: 'var(--frame-border)',
    boxShadow: thumb ? 'var(--shadow-soft)' : 'var(--shadow-frame)',
  }

  const media = thumb ? (
    <div className="grid place-items-center h-[168px] sm:h-[184px] p-3">
      <img
        src={item.src}
        alt={item.alt}
        onError={onImgError}
        loading="lazy"
        decoding="async"
        className="max-w-full max-h-full w-auto h-auto object-contain"
      />
    </div>
  ) : (
    <div className={large ? 'p-2.5 md:p-3' : 'p-2'}>
      <img
        src={item.src}
        alt={item.alt}
        onError={onImgError}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        className="block w-full h-auto"
        style={{ borderRadius: 'calc(var(--frame-radius) - 8px)' }}
      />
    </div>
  )

  const frame = (
    <div className="relative bg-panel overflow-hidden" style={frameStyle}>
      {media}
      {onExpand && <ZoomIcon />}
    </div>
  )

  return (
    <figure className={item.layout === 'compact' ? 'mx-auto w-full max-w-[340px]' : undefined}>
      {onExpand ? (
        <button
          type="button"
          onClick={onExpand}
          aria-label={`확대 보기: ${item.caption}`}
          className="group block w-full text-left cursor-zoom-in transition-transform duration-300 hover:scale-[1.01]"
          style={{ transitionTimingFunction: 'var(--ease-default)', borderRadius: 'var(--frame-radius)' }}
        >
          {frame}
        </button>
      ) : (
        frame
      )}
      <figcaption className="font-body text-text-sub text-[13px] leading-[1.6] mt-2.5 px-0.5 break-keep">{item.caption}</figcaption>
    </figure>
  )
}
