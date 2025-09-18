import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number;
  trend?: string;
  icon: React.ReactNode;
  className?: string;
}

export function StatsCard({ title, value, trend, icon, className }: StatsCardProps) {
  return (
    <div className={cn(
      "p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover-scale",
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-1">{trend}</p>
          )}
        </div>
        <div className="text-muted-foreground">
          {icon}
        </div>
      </div>
    </div>
  );
}