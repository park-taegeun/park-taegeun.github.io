// 문장 경계 유틸 — 한글 본문에서 마침표(문장) 뒤 다음 문장이 새 줄로 시작하게 분리.
// word-break: keep-all은 어절 중간 끊김만 막을 뿐 "문장 경계"는 제어하지 못하므로 별도 처리한다.

/**
 * 마침표/물음표/느낌표 뒤 공백을 문장 경계로 보고 분리.
 * 소수점(0.024)·중간 마침표는 뒤가 공백이 아니라 분리되지 않는다.
 */
export function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/g)
    .map((s) => s.trim())
    .filter(Boolean)
}
