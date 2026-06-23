import { cn } from "@/lib/utils"

export const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-surface rounded-xl shadow-sm border border-border", className)}>
    {children}
  </div>
)

export const CardHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("p-6 pb-4", className)}>{children}</div>
)

export const CardTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h3 className={cn("font-semibold text-ink", className)}>{children}</h3>
)

export const CardDescription = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={cn("text-sm text-muted mt-1", className)}>{children}</p>
)

export const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("p-6 pt-0", className)}>{children}</div>
)