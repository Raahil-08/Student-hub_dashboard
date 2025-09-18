import { useEffect, useState } from "react";
import { AchievementCard } from "@/components/AchievementCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Users } from "lucide-react";
import { api, type Achievement } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

export default function FacultyApproval() {
  const [submissions, setSubmissions] = useState<Achievement[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await api.getAllSubmissions();
        setSubmissions(data);
        setFilteredSubmissions(data.filter(s => s.status === 'Pending'));
      } catch (error) {
        console.error('Failed to fetch submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  useEffect(() => {
    let filtered = submissions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(submission =>
        submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.studentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(submission => submission.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== "All") {
      filtered = filtered.filter(submission => submission.category === categoryFilter);
    }

    setFilteredSubmissions(filtered);
  }, [submissions, searchTerm, statusFilter, categoryFilter]);

  const handleApprove = async (id: string) => {
    try {
      await api.updateAchievementStatus(id, 'Approved');
      setSubmissions(prev => 
        prev.map(s => s.id === id ? { ...s, status: 'Approved' as const, approvedDate: new Date().toISOString().split('T')[0] } : s)
      );
      toast({
        title: "Success",
        description: "Achievement approved successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve achievement",
        variant: "destructive"
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.updateAchievementStatus(id, 'Rejected');
      setSubmissions(prev => 
        prev.map(s => s.id === id ? { ...s, status: 'Rejected' as const } : s)
      );
      toast({
        title: "Success",
        description: "Achievement rejected successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject achievement",
        variant: "destructive"
      });
    }
  };

  const getStatusCounts = () => {
    return {
      All: submissions.length,
      Pending: submissions.filter(s => s.status === 'Pending').length,
      Approved: submissions.filter(s => s.status === 'Approved').length,
      Rejected: submissions.filter(s => s.status === 'Rejected').length
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Users className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Faculty Approval Panel</h1>
          <p className="text-muted-foreground">Review and approve student achievement submissions</p>
        </div>
      </div>

      {/* Status Overview */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Badge 
            key={status}
            variant={statusFilter === status ? "default" : "secondary"}
            className="cursor-pointer px-3 py-1"
            onClick={() => setStatusFilter(status)}
          >
            {status}: {count}
          </Badge>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by title or student name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            <SelectItem value="Academic">Academic</SelectItem>
            <SelectItem value="Technical">Technical</SelectItem>
            <SelectItem value="Sports">Sports</SelectItem>
            <SelectItem value="Arts">Arts</SelectItem>
            <SelectItem value="Community Service">Community Service</SelectItem>
            <SelectItem value="Leadership">Leadership</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No submissions found matching your criteria.</p>
          </div>
        ) : (
          filteredSubmissions.map((submission) => (
            <AchievementCard 
              key={submission.id} 
              achievement={submission} 
              showActions={true}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))
        )}
      </div>
    </div>
  );
}