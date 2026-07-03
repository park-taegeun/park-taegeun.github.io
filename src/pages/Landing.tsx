// 랜딩 — Hero → About → 10초 요약 → 대표 작업 → 실측 로그(velog) → 그 외 작업 → 피날레.
// 종이 콜라주·낙서 장식은 폐기. 헤어라인 + 모노 라벨로 절제.
import { motion } from 'framer-motion'
import { useState, useEffect, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import About from '../components/about/About'
import Finale from '../components/finale/Finale'
import Hero from '../components/hero/Hero'
import Label, { labelEnClass as labelEn } from '../components/Label'
import FlipTitle, { type FlipTitleHandle } from '../components/transition/FlipTitle'
import { useRef } from 'react'
import { PROJECTS, type Project } from '../data/projects'
import { SIDE_WORKS, type SideWork, type SideWorkImage, type SideWorkVideo } from '../data/sideWorks'
import { VELOG_PROFILE, VELOG_URL, WRITING_SERIES, type WritingSeries } from '../data/writing'
import { onImgError } from '../lib/placeholder'
import { Sentences, SentencesAfterLabel } from '../components/Sentences'
import { scrollToId } from '../lib/lenis'
import { enterRoom } from '../lib/signature'

const sectionPad = { paddingBlock: 'clamp(96px, 12vw, 180px)' }

export default function Landing() {
  return (
    <>
      <BottomNav />
      <main>
        <Hero />
        <About />
        <TenSecondSummary />
        <SelectedProjects />
        <Writing />
        <SideWorks />
        <Finale />
      </main>
    </>
  )
}

const NAV_SECTIONS = [
  { id: 'about', label: 'ABOUT' },
  { id: 'selected', label: 'WORK' },
  { id: 'writing', label: 'LOG' },
  { id: 'side', label: 'SIDE' },
  { id: 'contact', label: 'CONTACT' },
] as const

function BottomNav() {
  const [active, setActive] = useState('')
  const [shown, setShown] = useState(false)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const update = () => {
      setShown(window.scrollY > 80)
      const mid = window.innerHeight * 0.55
      let cur = ''
      for (const { id } of NAV_SECTIONS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top < mid) cur = id
      }
      setActive(cur)
      const footer = document.querySelector('footer')
      setDark(!!footer && footer.getBoundingClientRect().top < window.innerHeight * 0.8)
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <nav
      aria-label="섹션 내비게이션"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 select-none"
      style={{
        opacity: shown ? 1 : 0,
        pointerEvents: shown ? 'auto' : 'none',
        transition: 'opacity 0.5s',
      }}
    >
      <div
        className="flex items-center rounded-full px-5 py-[9px]"
        style={{
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          background: dark ? 'rgba(10,10,10,0.55)' : 'rgba(255,255,255,0.72)',
          border: dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(16,26,44,0.09)',
          boxShadow: dark
            ? '0 4px 28px rgba(0,0,0,0.45)'
            : '0 4px 28px rgba(16,26,44,0.07), inset 0 1px 0 rgba(255,255,255,0.85)',
          transition: 'background 0.5s, border-color 0.5s, box-shadow 0.5s',
        }}
      >
        {NAV_SECTIONS.map(({ id, label }, i) => {
          const isActive = active === id
          return (
            <Fragment key={id}>
              {i > 0 && (
                <span
                  aria-hidden
                  className="mx-3 text-[11px] leading-none"
                  style={{ color: dark ? 'rgba(255,255,255,0.18)' : 'rgba(16,26,44,0.18)' }}
                >
                  ·
                </span>
              )}
              <button
                type="button"
                onClick={() => scrollToId(id)}
                className="font-body text-[10px] tracking-[0.16em] uppercase focus-visible:outline-none"
                style={{
                  color: isActive
                    ? dark
                      ? 'rgba(255,255,255,0.92)'
                      : 'var(--color-ink)'
                    : dark
                      ? 'rgba(255,255,255,0.38)'
                      : 'rgba(16,26,44,0.38)',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'color 0.3s, font-weight 0.3s',
                }}
              >
                {label}
              </button>
            </Fragment>
          )
        })}
      </div>
    </nav>
  )
}

function TenSecondSummary() {
  return (
    <section id="summary" aria-label="10초 요약" className="relative overflow-hidden border-t border-line">
      <div className="mx-auto max-w-[1200px] container-pad" style={sectionPad}>
        <Label as="h2" lang="ko">대표 작업</Label>
        <ul className="mt-8 flex flex-col gap-6">
          {PROJECTS.map((p) => (
            <li key={p.key}>
              <button
                type="button"
                onClick={() => scrollToId(p.anchorId)}
                className="group text-left flex items-baseline gap-4"
              >
                <span
                  className="inline-block h-2 w-2 rounded-full shrink-0 translate-y-[-2px] opacity-70 group-hover:opacity-100 transition-opacity"
                  style={{ background: p.accent }}
                  aria-hidden
                />
                <span className="font-body text-[16px] leading-[1.6] text-text-sub group-hover:translate-x-1 transition-transform">
                  <strong className="font-body font-bold tracking-[-0.02em]" style={{ color: p.ink }}>
                    {p.name}
                  </strong>
                  <span className="text-text-muted">: </span>
                  {p.tenSecond}
                  {p.tenSecondCredit && <span className="text-text-muted"> ({p.tenSecondCredit})</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function SelectedProjects() {
  return (
    <section id="selected" className="border-t border-line">
      <h2 className="sr-only">Selected Projects</h2>
      {PROJECTS.map((p, i) => (
        <SelectedBlock key={p.key} project={p} index={i} />
      ))}
    </section>
  )
}

/* 유일한 시그니처 진입 지점 — 제목/CTA 클릭 = 글자 플립 + 원확산 */
function SelectedBlock({ project: p, index }: { project: Project; index: number }) {
  const navigate = useNavigate()
  const flipRef = useRef<FlipTitleHandle>(null)
  const visualLeft = index % 2 === 0

  const enter = (fromLetter: number) => {
    void enterRoom({
      project: p,
      navigate,
      fromLetter,
      playFlip: (from) => flipRef.current?.play(from),
    })
  }

  return (
    <article id={p.anchorId} className="relative overflow-hidden scroll-mt-16" style={{ background: p.tintSoft }}>
      <div
        className="mx-auto max-w-[1200px] container-pad grid gap-12 md:grid-cols-2 md:items-center"
        style={sectionPad}
      >
        <motion.div
          className={visualLeft ? 'md:order-1' : 'md:order-2'}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8%' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <SelectedPreview project={p} />
        </motion.div>

        <motion.div
          className={visualLeft ? 'md:order-2' : 'md:order-1'}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8%' }}
          transition={{ duration: 0.7, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className={labelEn}>
            {p.room} · <span style={{ color: p.accent }}>{p.tagline}</span>
          </p>

          <div className="mt-4">
            <FlipTitle ref={flipRef} name={p.name} ink={p.ink} onActivate={enter} />
          </div>

          <p className="font-body font-medium text-text-muted text-[12.5px] mt-4">{p.role}</p>

          <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${p.name} 핵심 증거`}>
            {p.proofChips.map((chip, chipIdx) => (
              <motion.li
                key={chip}
                initial={{ opacity: 0, scale: 0.82 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.38, delay: 0.22 + chipIdx * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="font-mono text-[12px] leading-none px-2.5 py-2 border border-line bg-white/55"
                style={{ color: p.ink, borderRadius: 999 }}
              >
                {chip}
              </motion.li>
            ))}
          </ul>

          <p className="font-body text-text-sub text-[16px] leading-[1.7] mt-6 max-w-[55ch] break-keep"><Sentences text={p.summary} /></p>
          <p className="font-body text-text-sub text-[14px] leading-[1.65] mt-4 max-w-[58ch] break-keep">
            <span className="font-semibold text-ink">핵심 판단</span>: <SentencesAfterLabel text={p.decision} />
          </p>
          <p className="font-body text-text-muted text-[13.5px] leading-[1.65] mt-2 max-w-[58ch] break-keep"><Sentences text={p.verification} /></p>

          <button
            type="button"
            onClick={() => enter(0)}
            className="font-body font-semibold text-[14px] tracking-[0.04em] mt-10 inline-block cursor-pointer"
            style={{ color: p.accent }}
          >
            작업 과정 보기 →
          </button>
        </motion.div>
      </div>
    </article>
  )
}

function SelectedPreview({ project }: { project: Project }) {
  return (
    <figure className="group">
      <div
        className="bg-panel overflow-hidden transition-transform duration-300 group-hover:scale-[1.01]"
        style={{
          borderRadius: 'var(--frame-radius)',
          border: 'var(--frame-border)',
          boxShadow: 'var(--shadow-frame)',
          transitionTimingFunction: 'var(--ease-default)',
        }}
      >
        <div className="p-2.5 md:p-3">
          <img
            src={project.previewImage.src}
            alt={project.previewImage.alt}
            onError={onImgError}
            loading="lazy"
            decoding="async"
            className="block w-full aspect-video object-cover"
            style={{ borderRadius: 'calc(var(--frame-radius) - 6px)' }}
          />
        </div>
      </div>
      <figcaption className="font-body text-text-muted text-[12.5px] leading-[1.5] mt-3 px-1">
        {project.previewImage.caption}
      </figcaption>
    </figure>
  )
}

function Writing() {
  return (
    <section id="writing" aria-label="실측 로그" className="relative overflow-hidden border-t border-line">
      <div className="mx-auto max-w-[1200px] container-pad" style={sectionPad}>
        <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
          <div>
            <Label as="h2" lang="ko">실측 로그</Label>
            <p
              className="font-body font-bold text-ink mt-4 leading-[1.35] break-keep"
              style={{ fontSize: 'clamp(22px,3vw,34px)' }}
            >
              글은 결과가 아니라 과정을 남기는 실측 로그입니다.
            </p>
            <p className="font-body text-text-sub text-[15.5px] leading-[1.75] mt-5 max-w-[68ch] break-keep">
              <Sentences text="velog에 음성·LLM 실험을 타임스탬프로 기록하고, 졸업작품 시스템의 설계 판단과 폐기한 접근, AI 생태계 탐험을 남깁니다. 성공한 결과만이 아니라 틀린 판단과 철회 과정까지 함께 씁니다." />
            </p>
          </div>

          <aside className="border-t border-line pt-5">
            <p className={`${labelEn} font-mono`}>Velog Archive</p>
            <p className="font-body font-bold text-ink text-[22px] leading-[1.35] mt-3">
              {VELOG_PROFILE.displayName} · <span className="font-mono text-[18px]">{VELOG_PROFILE.handle}</span>
            </p>
            <p className="font-body text-text-sub text-[14px] leading-[1.65] mt-2">{VELOG_PROFILE.bio}</p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="주요 태그">
              {VELOG_PROFILE.tags.map((tag) => (
                <li
                  key={tag}
                  className="font-mono text-[12px] leading-none px-2.5 py-2 border border-line bg-white/50 text-signal"
                  style={{ borderRadius: 999 }}
                >
                  {tag}
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <section aria-label="시리즈별 대표글" className="mt-14 grid gap-12">
          {WRITING_SERIES.map((s, i) => (
            <SeriesBlock key={s.name} series={s} index={i} />
          ))}
        </section>

        <div className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-6">
          <a
            href={VELOG_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 font-body font-semibold text-[15px] tracking-[0.02em] text-signal"
          >
            velog {VELOG_PROFILE.handle} 전체 글 보기
            <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </a>
          <p className="font-body text-text-muted text-[13px]">대표글은 각 시리즈에서 선정했고, 전체는 velog에 있습니다.</p>
        </div>
      </div>
    </section>
  )
}

function SeriesBlock({ series: s, index }: { series: WritingSeries; index: number }) {
  return (
    <motion.section
      aria-label={`${s.name} 대표글`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="border-t-2 pt-5"
      style={{ borderColor: 'var(--color-navy)' }}
    >
      {/* 헤더 — 축 / 시리즈명 / 편수 + 전체 보기 */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5">
        <div className="flex items-baseline gap-x-3 flex-wrap">
          <span className={`${labelEn} font-mono`} style={{ color: 'var(--color-signal)' }}>
            {s.axis}
          </span>
          <h3 className="font-body font-bold text-ink text-[19px] leading-tight">{s.name}</h3>
          <span className="font-mono text-[12px] text-text-muted">{s.count}</span>
        </div>
        <a
          href={s.href}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-1 font-body font-semibold text-[13px] text-signal"
        >
          전체 {s.count} 보기
          <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
        </a>
      </div>
      <p className="font-body text-text-sub text-[14px] leading-[1.65] mt-2.5 max-w-[70ch] break-keep">
        {s.blurb}
      </p>

      {/* 대표글 — 하이라인 로그 행(날짜 모노 · 제목 · 한 줄 · 화살표) */}
      <ul className="mt-5 border-t border-line">
        {s.posts.map((p) => (
          <li key={p.href} className="border-b border-line">
            <a
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className="group grid grid-cols-[1fr_auto] items-baseline gap-x-4 py-4 sm:grid-cols-[92px_1fr_auto] sm:gap-x-6"
            >
              <time className="hidden pt-0.5 font-mono text-[12.5px] tabular-nums text-text-muted sm:block">
                {p.date}
              </time>
              <div className="min-w-0">
                <p className="font-body font-semibold text-ink text-[15.5px] leading-[1.45] break-keep group-hover:underline underline-offset-4 decoration-1">
                  {p.title}
                </p>
                <p className="font-body text-text-sub text-[13.5px] leading-[1.6] mt-1 break-keep">
                  {p.note}
                </p>
                <time className="mt-1.5 block font-mono text-[11.5px] text-text-muted sm:hidden">
                  {p.date}
                </time>
              </div>
              <span
                aria-hidden
                className="justify-self-end pt-0.5 text-text-muted transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </motion.section>
  )
}

function SideWorks() {
  return (
    <section id="side" aria-label="그 외 작업" className="relative overflow-hidden border-t border-line">
      <div className="mx-auto max-w-[1200px] container-pad" style={sectionPad}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div>
            <Label as="p">Side Work</Label>
            <h2 className="font-display font-semibold text-ink text-[38px] leading-[1.08] mt-4 sm:text-[56px] lg:text-[72px]">
              그 외 작업
            </h2>
            <p className="font-body text-text-sub text-[15.5px] leading-[1.75] mt-5 max-w-[66ch] break-keep">
              연구·졸업작품 바깥에서 프론트엔드로 참여한 협업입니다. 결과 화면뿐 아니라 팀 안에서
              어떤 기준으로 판단을 조율했는지까지 함께 남깁니다.
            </p>
          </div>

          <aside className="border-t border-line pt-5">
            <p className={`${labelEn} font-mono`}>focus</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {['Frontend', 'Kakao Maps', '팀 협업', '의사결정'].map((tag) => (
                <li
                  key={tag}
                  className="font-mono text-[12px] leading-none px-2.5 py-2 border border-line bg-white/45 text-text-sub"
                  style={{ borderRadius: 999 }}
                >
                  {tag}
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <ul className="mt-16 flex flex-col gap-20">
          {SIDE_WORKS.map((work, index) => (
            <SideWorkItem key={work.title} work={work} index={index} />
          ))}
        </ul>
      </div>
    </section>
  )
}

function SideWorkItem({ work, index }: { work: SideWork; index: number }) {
  const visualFirst = index % 2 === 1
  const textOrder = visualFirst ? 'lg:order-2' : 'lg:order-1'
  const visualOrder = visualFirst ? 'lg:order-1' : 'lg:order-2'

  return (
    <li className="relative border-t border-line pt-10 lg:pt-12 overflow-hidden">
      <article className="relative z-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <motion.div
            className={`min-w-0 ${textOrder}`}
            initial={{ opacity: 0, x: visualFirst ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-12%' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className={`${labelEn} font-mono`}>{work.eyebrow}</p>
            <h3 className="font-display font-semibold text-ink text-[44px] leading-[0.95] mt-3 sm:text-[64px] lg:text-[82px]">
              {work.title}
            </h3>
            {work.period && <p className="font-body text-text-muted text-[13px] leading-[1.55] mt-4">{work.period}</p>}
            <p className="font-body text-text-sub text-[16px] leading-[1.75] mt-5 max-w-[58ch] break-keep"><Sentences text={work.oneLine} /></p>

            {work.motif && (
              <div className="border-y border-line py-4 mt-6">
                <p className={`${labelEn} font-mono`}>motif</p>
                <p className="font-body font-semibold text-ink text-[15px] leading-[1.55] mt-2">{work.motif}</p>
              </div>
            )}

            <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${work.title} 핵심 키워드`}>
              {work.chips.map((chip) => (
                <li
                  key={chip}
                  className="font-mono text-[12px] leading-none px-2.5 py-2 border border-line bg-white/45 text-text-sub"
                  style={{ borderRadius: 999 }}
                >
                  {chip}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className={`min-w-0 ${visualOrder}`}
            initial={{ opacity: 0, x: visualFirst ? -40 : 40, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: '-12%' }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {work.demoVideo ? (
              <SideDemoVideo video={work.demoVideo} />
            ) : work.primaryImage ? (
              <SideImageFrame image={work.primaryImage} large />
            ) : null}
          </motion.div>
        </div>

        <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <dl className={`min-w-0 ${textOrder}`}>
            <SideDetailRow label="Question" body={work.question} />
            <SideDetailRow label="Approach" body={work.approach} />
            <SideDetailRow label="Process" body={work.process} />
            <SideDetailRow label="Output" body={work.output} />
            <SideDetailRow label="Learning" body={work.learning} />

            {work.links && (
              <div className="border-t border-line pt-5">
                {work.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-body font-semibold text-[13px] tracking-[0.04em] text-text-muted hover:text-ink transition-colors"
                  >
                    {link.label} →
                  </a>
                ))}
              </div>
            )}
          </dl>

          <div className={`min-w-0 order-first ${visualOrder}`}>
            <div className="grid gap-3 sm:grid-cols-2">
              {work.supportingImages.map((image) => (
                <div key={image.src} className={image.span === 'full' ? 'sm:col-span-2' : undefined}>
                  <SideImageFrame image={image} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>
    </li>
  )
}

function SideDetailRow({ label, body }: { label: string; body: string }) {
  return (
    <div className="border-t border-line py-4 grid gap-2 sm:grid-cols-[112px_minmax(0,1fr)]">
      <dt className={`${labelEn} font-mono`}>{label}</dt>
      <dd className="font-body text-text-sub text-[14.5px] leading-[1.7] m-0 break-keep"><Sentences text={body} /></dd>
    </div>
  )
}

const FRAME_MAX_H = { sm: 260, md: 400, lg: 560, xl: 680 } as const

function SideImageFrame({ image, large = false }: { image: SideWorkImage; large?: boolean }) {
  const size = image.size ?? (large ? 'lg' : 'sm')

  return (
    <figure>
      <div
        className="mx-auto w-fit max-w-full bg-panel overflow-hidden"
        style={{
          borderRadius: 'var(--frame-radius)',
          border: 'var(--frame-border)',
          boxShadow: 'var(--shadow-soft)',
        }}
      >
        <div className="p-[2px]">
          <img
            src={image.src}
            alt={image.alt}
            onError={onImgError}
            loading="lazy"
            decoding="async"
            className="block max-w-full w-auto h-auto object-contain"
            style={{ maxHeight: FRAME_MAX_H[size], maxWidth: image.maxW ?? undefined, borderRadius: 'calc(var(--frame-radius) - 4px)' }}
          />
        </div>
      </div>
      <figcaption className="font-body text-text-muted text-[12.5px] leading-[1.5] mt-2.5 px-1 text-center">
        {image.caption}
      </figcaption>
    </figure>
  )
}

// 세로(9:16) 데모 영상 — lite-embed: 처음엔 썸네일 + 재생 버튼, 클릭 시에만 iframe 주입(경량·쿠키 절제).
function SideDemoVideo({ video }: { video: SideWorkVideo }) {
  const [active, setActive] = useState(false)

  return (
    <figure>
      <div className="mx-auto w-full" style={{ maxWidth: 320 }}>
        <div
          className="relative overflow-hidden bg-panel"
          style={{
            aspectRatio: '9 / 16',
            borderRadius: 'var(--frame-radius)',
            border: 'var(--frame-border)',
            boxShadow: 'var(--shadow-frame)',
          }}
        >
          {active ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
              title={video.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
              style={{ border: 0 }}
            />
          ) : (
            <button
              type="button"
              onClick={() => setActive(true)}
              aria-label="PICKL 데모 영상 재생"
              className="group absolute inset-0 h-full w-full cursor-pointer"
            >
              <img
                src={video.thumb}
                alt=""
                onError={onImgError}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-ink/10 transition-colors duration-300 group-hover:bg-ink/[0.02]"
                style={{ transitionTimingFunction: 'var(--ease-default)' }}
              />
              <span
                aria-hidden
                className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full transition-transform duration-300 group-hover:scale-105"
                style={{
                  background: 'var(--color-signal)',
                  boxShadow: '0 6px 20px rgba(14,124,134,0.42)',
                  transitionTimingFunction: 'var(--ease-default)',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          )}
        </div>
      </div>
      <figcaption className="font-body text-text-muted text-[12.5px] leading-[1.5] mt-2.5 px-1 text-center max-w-[320px] mx-auto">
        <Sentences text={video.caption} />
        {video.href && (
          <>
            {' '}
            <a
              href={video.href}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap underline underline-offset-2 hover:text-ink transition-colors"
            >
              전체 데모 보기 →
            </a>
          </>
        )}
      </figcaption>
    </figure>
  )
}
