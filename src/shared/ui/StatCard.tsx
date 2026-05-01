import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  hint?: string
  trend?: { value: number; isPositive: boolean }
  icon?: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger'
  className?: string
}

const variantStyles = {
  default: 'bg-[var(--color-bg-surface)] border-[var(--color-border)]',
  success: 'bg-[var(--color-success-subtle)] border-[var(--color-success)]/30',
  warning: 'bg-[var(--color-warning-subtle)] border-[var(--color-warning)]/30',
  danger: 'bg-[var(--color-danger-subtle)] border-[var(--color-danger)]/30',
}

const iconColors = {
  default: 'text-[var(--color-primary)] bg-[var(--color-primary-subtle)]',
  success: 'text-[var(--color-success)] bg-[var(--color-success-subtle)]',
  warning: 'text-[var(--color-warning)] bg-[var(--color-warning-subtle)]',
  danger: 'text-[var(--color-danger)] bg-[var(--color-danger-subtle)]',
}

export function StatCard({ label, value, hint, trend, icon, variant = 'default', className = '' }: StatCardProps) {
  return (
    <article className={`p-5 rounded-xl border transition-all duration-200 hover:border-[var(--color-border-light)] hover:-translate-y-0.5 hover:shadow-md ${variantStyles[variant]} ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{label}</span>
        {icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColors[variant]}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight">{value}</div>
      {trend && (
        <div className={`flex items-center gap-1.5 mt-3 text-xs font-semibold ${trend.isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
          <svg className={`w-3.5 h-3.5 ${trend.isPositive ? '' : 'rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span>{trend.value}%</span>
          {hint && <span className="text-[var(--color-text-muted)] font-normal ml-1">{hint}</span>}
        </div>
      )}
      {!trend && hint && <p className="mt-2 text-xs text-[var(--color-text-muted)]">{hint}</p>}
    </article>
  )
}