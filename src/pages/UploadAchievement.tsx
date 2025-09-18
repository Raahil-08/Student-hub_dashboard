import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, FileText, Users, User, Briefcase, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import { BadgeIcon, getBadgeLabel, type BadgeType } from "@/components/BadgeIcon";

const instituteData = {
  Technology: [
    "Computer Science Engineering",
    "Information Technology",
    "Electronics & Communication",
    "Mechanical Engineering",
    "Civil Engineering",
  ],
  Design: [
    "UI/UX Design",
    "Graphic Design",
    "Product Design",
    "Fashion Design",
    "Interior Design",
  ],
  Management: ["Human Resources", "Finance", "Marketing", "Operations", "Strategy"],
  Arts: ["Fine Arts", "Performing Arts", "Literature", "Music", "Theatre"],
  Architecture: [
    "Urban Design",
    "Sustainable Architecture",
    "Landscape Architecture",
    "Interior Architecture",
    "Building Technology",
  ],
  Pharmacy: [
    "Pharmacology",
    "Pharmaceutical Chemistry",
    "Pharmaceutics",
    "Pharmacognosy",
    "Clinical Pharmacy",
  ],
  Law: [
    "Corporate Law",
    "Criminal Law",
    "International Law",
    "Intellectual Property Law",
    "Human Rights Law",
  ],
  Science: ["Physics", "Chemistry", "Biology", "Mathematics", "Environmental Science"],
  InternationalStudies: [
    "International Relations",
    "Global Politics",
    "Diplomacy",
    "Development Studies",
    "Area Studies",
  ],
};

const categories = [
  "Academic",
  "Technical",
  "Sports",
  "Arts",
  "Community Service",
  "Leadership",
] as const;
type Category = (typeof categories)[number];

const badges = [
  { value: "diamond-international" as const, label: "Diamond - International" },
  { value: "platinum-national" as const, label: "Platinum - National" },
  { value: "gold-state" as const, label: "Gold - State" },
  { value: "silver-district" as const, label: "Silver - District" },
  { value: "bronze-intra-college" as const, label: "Bronze - Intra College" },
] as const;
type Badge = (typeof badges)[number]["value"];

export default function UploadAchievement() {
  const [achievementType, setAchievementType] = useState<"Personal" | "Group" | "Internship" | null>(null);
  const [formData, setFormData] = useState<{
    institute: string;
    department: string;
    category: Category | "";
    badge: Badge | "";
    description: string;
    role: string;
    studentName: string;
    studentId: string;
    // Internship specific fields
    institutionName: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
  }>({
    institute: "",
    department: "",
    category: "",
    badge: "",
    description: "",
    role: "",
    studentName: "Sarah Johnson",
    studentId: "S001",
    institutionName: "",
    startDate: undefined,
    endDate: undefined,
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (achievementType === "Internship") {
      // Validation for internship fields
      if (!formData.institutionName.trim()) {
        toast({
          title: "Error",
          description: "Please enter the institution name",
          variant: "destructive",
        });
        return;
      }
      if (!formData.startDate || !formData.endDate) {
        toast({
          title: "Error",
          description: "Please select both start and end dates",
          variant: "destructive",
        });
        return;
      }
      if (!formData.description.trim()) {
        toast({
          title: "Error",
          description: "Please provide a description",
          variant: "destructive",
        });
        return;
      }
      if (!file) {
        toast({
          title: "Error",
          description: "Please upload the certificate",
          variant: "destructive",
        });
        return;
      }
    } else {
      // Validation for regular achievements
      if (!formData.institute || !formData.department || !formData.category || !formData.badge) {
        toast({
          title: "Error",
          description: "Please select institute, department, category, and badge level",
          variant: "destructive",
        });
        return;
      }

      if (achievementType === "Group" && !formData.role.trim()) {
        toast({
          title: "Error",
          description: "Please describe your role in the achievement",
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);
    try {
      const title = achievementType === "Internship" 
        ? `Internship - ${formData.institutionName}`
        : `${achievementType} Achievement - ${formData.institute} - ${formData.department}`;
        
      await api.submitAchievement({
        title,
        category: (achievementType === "Internship" ? "Technical" : formData.category) as Category,
        badge: (achievementType === "Internship" ? "bronze-intra-college" : formData.badge) as Badge,
        description: formData.description,
        studentName: formData.studentName,
        studentId: formData.studentId,
        fileUrl: file ? "/uploaded-file.pdf" : undefined,
      });

      toast({
        title: "Success",
        description: "Achievement submitted successfully!",
      });

      setAchievementType(null);
      setFormData({
        institute: "",
        department: "",
        category: "",
        badge: "",
        description: "",
        role: "",
        studentName: "Sarah Johnson",
        studentId: "S001",
        institutionName: "",
        startDate: undefined,
        endDate: undefined,
      });
      setFile(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit achievement",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInstituteChange = (value: string) => {
    setFormData({
      ...formData,
      institute: value,
      department: "",
    });
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-6 bg-background">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-foreground">Upload Achievement</h1>
          <p className="text-muted-foreground">Submit your accomplishments for approval</p>
        </div>

        {!achievementType ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Achievement Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground mb-6">
                  Please select whether this is a personal achievement or a group achievement.
                </p>
                <div className="flex justify-center">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col items-center gap-3 hover:bg-accent"
                      onClick={() => setAchievementType("Personal")}
                    >
                      <User className="w-8 h-8" />
                      <span className="font-medium">Personal Achievement</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col items-center gap-3 hover:bg-accent"
                      onClick={() => setAchievementType("Group")}
                    >
                      <Users className="w-8 h-8" />
                      <span className="font-medium">Group Achievement</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col items-center gap-3 hover:bg-accent"
                      onClick={() => setAchievementType("Internship")}
                    >
                      <Briefcase className="w-8 h-8" />
                      <span className="font-medium">Internship</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {achievementType === "Personal" ? (
                  <User className="w-5 h-5" />
                ) : achievementType === "Group" ? (
                  <Users className="w-5 h-5" />
                ) : (
                  <Briefcase className="w-5 h-5" />
                )}
                {achievementType === "Internship" ? "Internship Details" : `${achievementType} Achievement Details`}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAchievementType(null)}
                className="ml-auto"
              >
                Change Type
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {achievementType === "Internship" ? (
                  <>
                    {/* Institution Name */}
                    <div className="space-y-2">
                      <Label htmlFor="institutionName">Institution Name *</Label>
                      <Input
                        id="institutionName"
                        placeholder="Enter institution name"
                        value={formData.institutionName}
                        onChange={(e) =>
                          setFormData({ ...formData, institutionName: e.target.value })
                        }
                        required
                      />
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !formData.startDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.startDate ? format(formData.startDate, "PPP") : "Select start date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={formData.startDate}
                              onSelect={(date) => setFormData({ ...formData, startDate: date })}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label>End Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !formData.endDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.endDate ? format(formData.endDate, "PPP") : "Select end date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={formData.endDate}
                              onSelect={(date) => setFormData({ ...formData, endDate: date })}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                              disabled={(date) => formData.startDate ? date < formData.startDate : false}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Institute */}
                    <div className="space-y-2">
                      <Label htmlFor="institute">Institute</Label>
                      <Select onValueChange={handleInstituteChange} value={formData.institute}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an institute" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(instituteData).map((institute) => (
                            <SelectItem key={institute} value={institute}>
                              {institute}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Department */}
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData({ ...formData, department: value })
                        }
                        value={formData.department}
                        disabled={!formData.institute}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              formData.institute
                                ? "Select a department"
                                : "Select institute first"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.institute &&
                            instituteData[
                              formData.institute as keyof typeof instituteData
                            ]?.map((department) => (
                              <SelectItem key={department} value={department}>
                                {department}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label htmlFor="category">Achievement Category</Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData({ ...formData, category: value as Category | "" })
                        }
                        value={formData.category}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Badge Level - Only for Personal and Group achievements */}
                    <div className="space-y-2">
                      <Label htmlFor="badge">Badge Level *</Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData({ ...formData, badge: value as Badge | "" })
                        }
                        value={formData.badge}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select badge level you're applying for" />
                        </SelectTrigger>
                        <SelectContent>
                          {badges.map((badge) => (
                            <SelectItem key={badge.value} value={badge.value}>
                              <div className="flex items-center gap-2">
                                <BadgeIcon badge={badge.value} size={16} />
                                {badge.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    {achievementType === "Internship" ? "Description *" : "Achievement Description"}
                  </Label>
                  <Textarea
                    id="description"
                    placeholder={
                      achievementType === "Internship" 
                        ? "Describe your internship experience, responsibilities, and learnings..."
                        : "Describe your achievement in detail..."
                    }
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    required
                  />
                </div>

                {/* Role (Group only) */}
                {achievementType === "Group" && (
                  <div className="space-y-2">
                    <Label htmlFor="role">Your Role in the Achievement</Label>
                    <Textarea
                      id="role"
                      placeholder="Describe your role (e.g., Team Lead, Analyst, Presenter)"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      rows={3}
                      required
                    />
                  </div>
                )}

                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="file">
                    {achievementType === "Internship" ? "Certificate * (Required)" : "Supporting Document"}
                  </Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="hidden"
                      required={achievementType === "Internship"}
                    />
                    <label htmlFor="file" className="cursor-pointer">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {file ? file.name : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, DOC, DOCX, JPG, JPEG, PNG (Max 10MB)
                        {achievementType === "Internship" && " - Required"}
                      </p>
                    </label>
                  </div>
                </div>

                {/* Submit */}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Submitting..." : achievementType === "Internship" ? "Submit Internship" : "Submit Achievement"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
