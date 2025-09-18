import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileText, Calendar, Trophy } from "lucide-react";
import { api, type Achievement } from "@/utils/api";
import { BadgeIcon, getBadgeLabel, getBadgeColor, type BadgeType } from "@/components/BadgeIcon";
import { AchievementDetailsModal } from "@/components/AchievementDetailsModal";
import jsPDF from 'jspdf';

export default function Portfolio() {
  const [approvedAchievements, setApprovedAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null);
  const [showInternships, setShowInternships] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const badges: BadgeType[] = ['diamond-international', 'platinum-national', 'gold-state', 'silver-district', 'bronze-intra-college'];

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const data = await api.getMyAchievements();
        setApprovedAchievements(data.filter(a => a.status === 'Approved'));
      } catch (error) {
        console.error('Failed to fetch achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = margin;

    // Header
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('Portfolio Resume', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Student Info
    doc.setFontSize(18);
    doc.text('Sarah Johnson', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Computer Science Student', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;
    
    doc.text(`${approvedAchievements.length} Achievements | Updated ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Line separator
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;

    // Achievements section
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Achievements', margin, yPosition);
    yPosition += 10;

    // Group achievements by category
    const achievementsByCategory = approvedAchievements.reduce((acc, achievement) => {
      if (!acc[achievement.category]) {
        acc[achievement.category] = [];
      }
      acc[achievement.category].push(achievement);
      return acc;
    }, {} as Record<string, Achievement[]>);

    Object.entries(achievementsByCategory).forEach(([category, achievements]) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = margin;
      }

      // Category header
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(category, margin, yPosition);
      yPosition += 8;

      achievements.forEach((achievement) => {
        // Check if we need a new page
        if (yPosition > 260) {
          doc.addPage();
          yPosition = margin;
        }

        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text(`• ${achievement.title}`, margin + 5, yPosition);
        yPosition += 6;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        
        // Description (wrap text)
        const descriptionLines = doc.splitTextToSize(achievement.description, pageWidth - margin * 2 - 10);
        doc.text(descriptionLines, margin + 10, yPosition);
        yPosition += descriptionLines.length * 4;

        // Badge and date
        doc.setFontSize(9);
        doc.text(`Badge: ${getBadgeLabel(achievement.badge)}`, margin + 10, yPosition);
        yPosition += 4;
        doc.text(`Approved: ${achievement.approvedDate}`, margin + 10, yPosition);
        yPosition += 8;
      });

      yPosition += 5;
    });

    // Download the PDF
    doc.save('portfolio-resume.pdf');
  };

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAchievement(null);
  };

  const getCategoryColor = (category: Achievement['category']) => {
    const colors = {
      'Academic': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Technical': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Sports': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Arts': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'Community Service': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Leadership': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Portfolio</h1>
          <p className="text-muted-foreground">Showcase your approved achievements</p>
        </div>
        <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download as PDF
        </Button>
      </div>

      {/* Portfolio Header */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <CardContent className="p-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">SJ</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Sarah Johnson</h2>
              <p className="text-muted-foreground">Computer Science Student</p>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span>{approvedAchievements.length} Achievements</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Updated {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badge Filters and Internships */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {badges.map(badge => {
          const count = approvedAchievements.filter(a => a.badge === badge).length;
          const isSelected = selectedBadge === badge && !showInternships;
          return (
            <Card 
              key={badge} 
              className={`text-center p-4 cursor-pointer transition-all hover:scale-105 ${
                isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
              }`}
              onClick={() => {
                setSelectedBadge(isSelected ? null : badge);
                setShowInternships(false);
              }}
            >
              <CardContent className="p-0 space-y-2">
                <div className="flex justify-center">
                  <BadgeIcon badge={badge} size={32} />
                </div>
                <p className="text-2xl font-bold text-primary">{count}</p>
                <p className="text-sm text-muted-foreground">{getBadgeLabel(badge)}</p>
              </CardContent>
            </Card>
          );
        })}
        
        {/* Internships Box */}
        <Card 
          className={`text-center p-4 cursor-pointer transition-all hover:scale-105 ${
            showInternships ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
          }`}
          onClick={() => {
            setShowInternships(!showInternships);
            setSelectedBadge(null);
          }}
        >
          <CardContent className="p-0 space-y-2">
            <div className="flex justify-center">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <p className="text-2xl font-bold text-primary">
              {approvedAchievements.filter(a => a.category === 'Internship').length}
            </p>
            <p className="text-sm text-muted-foreground">Internships</p>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Grid */}
      {(() => {
        const filteredAchievements = showInternships
          ? approvedAchievements.filter(a => a.category === 'Internship')
          : selectedBadge 
            ? approvedAchievements.filter(a => a.badge === selectedBadge)
            : approvedAchievements;

        if (filteredAchievements.length === 0) {
          return (
            <Card className="p-12 text-center">
              <CardContent>
                <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">
                  {showInternships ? 'No internships found' : selectedBadge ? 'No achievements with this badge' : 'No Approved Achievements Yet'}
                </h3>
                <p className="text-muted-foreground">
                  {showInternships 
                    ? 'No internship achievements have been approved yet'
                    : selectedBadge 
                      ? 'Try selecting a different badge or clear the filter' 
                      : 'Start by uploading your achievements to build your portfolio!'
                  }
                </p>
                {(selectedBadge || showInternships) && (
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={() => {
                      setSelectedBadge(null);
                      setShowInternships(false);
                    }}
                  >
                    Clear Filter
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        }

        return (
          <div className="space-y-4">
            {(selectedBadge || showInternships) && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Showing:</span>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10">
                  {showInternships ? (
                    <>
                      <FileText className="w-4 h-4" />
                      <span className="text-sm font-medium">Internships</span>
                    </>
                  ) : selectedBadge ? (
                    <>
                      <BadgeIcon badge={selectedBadge} size={16} />
                      <span className="text-sm font-medium">{getBadgeLabel(selectedBadge)}</span>
                    </>
                  ) : null}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setSelectedBadge(null);
                    setShowInternships(false);
                  }}
                  className="text-xs"
                >
                  Clear Filter
                </Button>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className="hover-scale cursor-pointer transition-all hover:bg-card/50"
                  onClick={() => handleAchievementClick(achievement)}
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <BadgeIcon badge={achievement.badge} size={20} />
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <Badge className={getCategoryColor(achievement.category)}>
                          {achievement.category}
                        </Badge>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>Approved on {achievement.approvedDate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })()}

      <AchievementDetailsModal
        achievement={selectedAchievement}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}