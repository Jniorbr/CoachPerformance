import type { ReactNode } from 'react'

export type BadgeTone = 'success' | 'warning' | 'neutral'

const tons: Record<BadgeTone, string> = {
  success: 'bg-ok-soft text-ok',
  warning: 'bg-warn-soft text-warn',
  neutral: 'bg-soft text-muted'
}

export function Badge({ tone = 'neutral', children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${tons[tone]}`}>
      {children}
    </span>
  )
}
