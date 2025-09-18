import { useEffect, useState } from "react";
import { AchievementCard } from "@/components/AchievementCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { api, type Achievement } from "@/utils/api";

export default function MyAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [filteredAchievements, setFilteredAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const data = await api.getMyAchievements();
        setAchievements(data);
        setFilteredAchievements(data);
      } catch (error) {
        console.error('Failed to fetch achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  useEffect(() => {
    let filtered = achievements;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(achievement =>
        achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        achievement.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(achievement => achievement.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== "All") {
      filtered = filtered.filter(achievement => achievement.category === categoryFilter);
    }

    setFilteredAchievements(filtered);
  }, [achievements, searchTerm, statusFilter, categoryFilter]);

  const getStatusCounts = () => {
    return {
      All: achievements.length,
      Pending: achievements.filter(a => a.status === 'Pending').length,
      Approved: achievements.filter(a => a.status === 'Approved').length,
      Rejected: achievements.filter(a => a.status === 'Rejected').length
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
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Achievements</h1>
        <p className="text-muted-foreground">Track and manage your submitted achievements</p>
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
            placeholder="Search achievements..."
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
        
        <Button variant="outline" onClick={() => {
          setSearchTerm("");
          setStatusFilter("All");
          setCategoryFilter("All");
        }}>
          <Filter className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      </div>

      {/* Achievements List */}
      <div className="space-y-4">
        {filteredAchievements.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No achievements found matching your criteria.</p>
          </div>
        ) : (
          filteredAchievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))
        )}
      </div>
    </div>
  );
}