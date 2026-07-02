// 원점 스토리 — 웹툰식 세로 내러티브 (원점→검증→전환→확장).
// 세로 spine(연결선 + 도트)으로 "한 줄로 읽히는" 시퀀스를 만들고, 비트별 패널을 스크롤 리빌로 드러낸다.
// 가드레일(§8): transform/opacity만, 박스 남용 금지(라인/도트로 구분), break-keep.
import type { OriginStory } from '../../data/rooms'
import EvidenceFrame from './EvidenceFrame'
import Reveal from './Reveal'

interface OriginStoryViewProps {
  story: OriginStory
  ink: string
}

export default function OriginStoryView({ story, ink }: OriginStoryViewProps) {
  return (
    <div className="mx-auto max-w-[820px]">
      <Reveal>
        <h2
          className="border-t border-line pt-5 font-body font-semibold tracking-[0.08em] text-[13.5px]"
          style={{ color: ink }}
        >
          {story.label}
        </h2>
      </Reveal>

      <ol className="relative mt-10">
        {story.beats.map((beat, i) => {
          const isLast = i === story.beats.length - 1
          return (
            <li
              key={beat.eyebrow}
              className="relative grid grid-cols-[20px_1fr] gap-x-5 pb-14 last:pb-0 sm:grid-cols-[24px_1fr] sm:gap-x-7"
            >
              {/* 세로 연결선 — 도트에서 다음 도트까지 (마지막 비트는 생략) */}
              {!isLast && (
                <span
                  className="pointer-events-none absolute left-[9px] top-2 -bottom-2 w-px bg-line sm:left-[11px]"
                  aria-hidden
                />
              )}
              {/* 도트 — eyebrow 중심에 정렬, base 링으로 연결선 위에 얹혀 보이게 */}
              <div className="relative flex justify-center">
                <span
                  className="relative z-10 mt-0.5 h-3 w-3 rounded-full ring-4 ring-base"
                  style={{ background: ink }}
                  aria-hidden
                />
              </div>

              <Reveal>
                <div>
                  <p
                    className="font-body font-semibold uppercase tracking-[0.18em] text-[11.5px]"
                    style={{ color: ink }}
                  >
                    {beat.eyebrow}
                  </p>
                  <h3 className="font-body font-bold text-ink text-[19px] leading-[1.4] mt-2 break-keep sm:text-[21px]">
                    {beat.title}
                  </h3>
                  <p className="font-body text-text-sub text-[15px] leading-[1.75] mt-3 max-w-[52ch] break-keep">
                    {beat.body}
                  </p>
                  {beat.image && (
                    <div className="mt-6 max-w-[560px]">
                      <EvidenceFrame item={beat.image} tiltDir={i % 2 === 0 ? 1 : -1} />
                    </div>
                  )}
                </div>
              </Reveal>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
