import type { PropsWithChildren, ReactNode } from 'react'

interface PanelProps extends PropsWithChildren {
  title: string
  actions?: ReactNode
}

export function Panel({ title, actions, children }: PanelProps) {
  return (
    <section className="panel">
      <div className="toolbar">
        <h3>{title}</h3>
        {actions}
      </div>
      {children}
    </section>
  )
}
