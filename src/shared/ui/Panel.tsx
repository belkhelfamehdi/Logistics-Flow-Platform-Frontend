import type { PropsWithChildren, ReactNode } from 'react'

interface PanelProps extends PropsWithChildren {
  title: string
  subtitle?: string
  actions?: ReactNode
  noPadding?: boolean
  className?: string
}

export function Panel({ title, subtitle, actions, children, noPadding = false, className = '' }: PanelProps) {
  return (
    <section className={`rounded-xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] overflow-hidden transition-all duration-200 hover:border-[var(--color-border-light)] ${className}`}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className={noPadding ? '' : 'p-5'}>
        {children}
      </div>
    </section>
  )
}