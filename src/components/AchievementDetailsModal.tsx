import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Calendar, User, FileText } from "lucide-react";
import type { Achievement } from "@/utils/api";
import { BadgeIcon, getBadgeLabel, getBadgeColor } from "@/components/BadgeIcon";

interface AchievementDetailsModalProps {
  achievement: Achievement | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AchievementDetailsModal({ 
  achievement, 
  isOpen, 
  onClose 
}: AchievementDetailsModalProps) {
  if (!achievement) return null;

  const getStatusColor = (status: Achievement['status']) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const getCategoryColor = (category: Achievement['category']) => {
    const colors = {
      'Academic': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Technical': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Sports': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Arts': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'Community Service': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Leadership': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'Internship': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleDownloadCertificate = () => {
    // Mock certificate download - in real app this would download actual certificate
    const link = document.createElement('a');
    link.href = 'data:application/pdf;base64,JVBERi0xLjMKJf////8KNCAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMyAwIFIKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFsgNCAwIFIgXQovQ291bnQgMQo+PgplbmRvYmoKNCAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDMgMCBSCi9NZWRpYUJveCBbIDAgMCA2MTIgNzkyIF0KL1Jlc291cmNlcyA8PAovUHJvY1NldCA2IDAgUgo+PgovQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCjUgMCBvYmoKPDwKL0xlbmd0aCAzMAo+PgpzdHJlYW0KQlQKL0YxIDEyIFRmCjUwIDUwMCBUZAooQ2VydGlmaWNhdGUgb2YgQWNoaWV2ZW1lbnQpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKNiAwIG9iago8PAovUHJvY1NldCBbIC9QREYgL1RleHQgXQovRm9udCA8PAovRjEgNyAwIFIKPj4KPj4KZW5kb2JqCjcgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCnhyZWYKMCA4CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDA5NyAwMDAwMCBuIAowMDAwMDAwMTU4IDAwMDAwIG4gCjAwMDAwMDAyMDMgMDAwMDAgbiAKMDAwMDAwMDI2MCAwMDAwMCBuIAowMDAwMDAwNDEzIDAwMDAwIG4gCjAwMDAwMDA0OTEgMDAwMDAgbiAKMDAwMDAwMDU2NSAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDgKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjY1NQolJUVPRgo=';
    link.download = `${achievement.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_certificate.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="text-primary">
              <FileText className="w-6 h-6" />
            </div>
            <span>{achievement.title}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status and Badge Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BadgeIcon badge={achievement.badge} size={32} />
              <div>
                <Badge className={`border ${getBadgeColor(achievement.badge)}`}>
                  {getBadgeLabel(achievement.badge)}
                </Badge>
              </div>
            </div>
            <Badge className={getStatusColor(achievement.status)}>
              {achievement.status}
            </Badge>
          </div>

          {/* Category */}
          <div>
            <Badge className={getCategoryColor(achievement.category)}>
              {achievement.category}
            </Badge>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {achievement.description}
            </p>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Submitted:</span>
              <span className="font-medium">{achievement.submittedDate}</span>
            </div>
            
            {achievement.approvedDate && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="text-muted-foreground">Approved:</span>
                <span className="font-medium text-green-600">{achievement.approvedDate}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Student:</span>
              <span className="font-medium">{achievement.studentName}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">ID:</span>
              <span className="font-medium">{achievement.studentId}</span>
            </div>
          </div>

          {/* Download Certificate Button */}
          {achievement.status === 'Approved' && (
            <div className="flex justify-center pt-4 border-t border-border">
              <Button 
                onClick={handleDownloadCertificate}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
              >
                <Download className="w-4 h-4" />
                Download Certificate
              </Button>
            </div>
          )}
          
          {achievement.status !== 'Approved' && (
            <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border">
              Certificate will be available once the achievement is approved
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}