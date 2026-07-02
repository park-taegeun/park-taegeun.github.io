# Park Taegeun — Portfolio

박태근 포트폴리오 웹사이트. **모델이 아니라 시스템 전체를 의심하고 검증하며 끝까지 책임지는** AI/ML 엔지니어의 작업을, "계측기·실측 로그" 정체성으로 담았습니다.

배포: https://park-taegeun.github.io/

## 스택

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Framer Motion (UI 모션) · GSAP (시그니처 전환·리빌)
- Lenis (스무스 스크롤) · React Router

## 구조

- 랜딩(빠른 길): Hero → About → 대표 작업 요약 → 대표 작업 3 → 실측 로그(velog) → 그 외 작업 → 피날레
- 프로젝트 룸(느린 길): 진입 → 대표 화면 → 설계 구조 → 작업 과정 → 근거 자료 → 프로젝트 정보
- 콘텐츠는 `src/data/*.ts`를 컴포넌트가 렌더하는 데이터 기반 방식

### 대표 작업

1. **Multimodal ASR** — 멀티모달 LLM 음성인식 환각 진단·개선 (정부 R&D · 학부연구생 · 진행 중)
2. **EEG Emotion** — 14채널 EEG 단독 실시간 감정 인식 (학부연구생 · IEIE 발표)
3. **Sound Alert** — 청각장애인용 소리 알림 시스템, 센서부터 알림까지 1인 end-to-end (졸업작품 · 진행 중)

## 디자인 시스템

- 배경 오프화이트 + 딥네이비 텍스트, 액센트는 딥 틸(signal) 하나로 절제
- 의미 축: 개입 전(회색 `--claimed`) → 검증 후(틸 `--signal`)
- 수치·타임스탬프·파일명은 모두 모노(IBM Plex Mono)로 렌더 — 실측 로그 정체성
- 디스플레이: Space Grotesk · 본문: Pretendard

## 개발

```bash
npm install
npm run dev        # 로컬 개발 서버
npm run typecheck  # 타입 검사
npm run lint       # ESLint
npm run build      # 프로덕션 빌드
npm run preview    # 빌드 미리보기
```

## 배포

`main` 브랜치 push 시 GitHub Actions가 빌드해 GitHub Pages로 배포합니다(유저 페이지, base `/`).

## 이미지 자산

`public/images/` 아래 경로와 코드 참조가 1:1로 일치합니다. 아직 넣지 않은 이미지는 로드 실패 시 파일명이 적힌 placeholder로 대체됩니다(`src/lib/placeholder.ts`).
