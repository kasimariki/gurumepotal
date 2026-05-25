interface HeaderProps {
  title: string
  subtitle?: string
  sectionLabel?: string
  children?: React.ReactNode
}

export function Header({
  title,
  subtitle,
  sectionLabel,
  children,
}: HeaderProps) {
  return (
    <header className="flex items-start justify-between">
      <div>
        {sectionLabel && (
          <div className="mb-2 flex items-center gap-2">
            <div className="h-[3px] w-[28px] rounded-full bg-[#0F3D7A]" />
            <span className="font-en text-[11px] font-semibold uppercase tracking-wider text-[#0F3D7A]">
              {sectionLabel}
            </span>
          </div>
        )}
        <h1 className="text-[22px] font-bold leading-tight text-[#1A2E4A]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-[13px] leading-relaxed text-[#5A7184]">
            {subtitle}
          </p>
        )}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </header>
  )
}
