import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, User } from "lucide-react";
import type { Achievement } from "@/utils/api";
import { BadgeIcon, getBadgeLabel, getBadgeColor, type BadgeType } from "@/components/BadgeIcon";

interface AchievementCardProps {
  achievement: Achievement;
  showActions?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function AchievementCard({ 
  achievement, 
  showActions = false, 
  onApprove, 
  onReject 
}: AchievementCardProps) {
  const getStatusColor = (status: Achievement['status']) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const getCategoryIcon = (category: Achievement['category']) => {
    // Return appropriate icon based on category
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div className="p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-border/50 hover-scale">
      <div className="flex items-start gap-3">
        <div className="text-primary">
          {getCategoryIcon(achievement.category)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BadgeIcon badge={achievement.badge} size={20} />
              <h3 className="font-semibold text-foreground">{achievement.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`border ${getBadgeColor(achievement.badge)}`}>
                {getBadgeLabel(achievement.badge)}
              </Badge>
              <Badge className={getStatusColor(achievement.status)}>
                {achievement.status}
              </Badge>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="font-medium text-primary">{achievement.category}</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Submitted on {achievement.submittedDate}
            </div>
            {showActions && (
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {achievement.studentName}
              </div>
            )}
          </div>
          
          {achievement.approvedDate && (
            <div className="text-xs text-green-600 mt-1">
              Approved on {achievement.approvedDate}
            </div>
          )}
          
          {showActions && achievement.status === 'Pending' && (
            <div className="flex gap-2 mt-3">
              <Button 
                size="sm" 
                onClick={() => onApprove?.(achievement.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                Approve
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => onReject?.(achievement.id)}
              >
                Reject
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}