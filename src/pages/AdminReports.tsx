import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, BarChart3, TrendingUp, Users, Award } from "lucide-react";
import { api, type Achievement } from "@/utils/api";

interface ReportData {
  category: string;
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  approvalRate: number;
}

export default function AdminReports() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState("2024");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getAllSubmissions();
        setAchievements(data);
        generateReportData(data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateReportData = (data: Achievement[]) => {
    const categories = ['Academic', 'Technical', 'Sports', 'Arts', 'Community Service', 'Leadership'];
    
    const reportData: ReportData[] = categories.map(category => {
      const categoryAchievements = data.filter(a => a.category === category);
      const approved = categoryAchievements.filter(a => a.status === 'Approved').length;
      const pending = categoryAchievements.filter(a => a.status === 'Pending').length;
      const rejected = categoryAchievements.filter(a => a.status === 'Rejected').length;
      const total = categoryAchievements.length;
      
      return {
        category,
        total,
        approved,
        pending,
        rejected,
        approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0
      };
    });

    setReportData(reportData);
  };

  const getTotalStats = () => {
    return {
      totalSubmissions: achievements.length,
      totalApproved: achievements.filter(a => a.status === 'Approved').length,
      totalPending: achievements.filter(a => a.status === 'Pending').length,
      totalStudents: new Set(achievements.map(a => a.studentName)).size,
      overallApprovalRate: achievements.length > 0 
        ? Math.round((achievements.filter(a => a.status === 'Approved').length / achievements.length) * 100)
        : 0
    };
  };

  const handleDownloadCSV = () => {
    // Stub for CSV download
    alert('CSV download feature coming soon!');
  };

  const handleDownloadPDF = () => {
    // Stub for PDF download
    alert('PDF download feature coming soon!');
  };

  const stats = getTotalStats();

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
        <div className="flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Reports</h1>
            <p className="text-muted-foreground">Comprehensive achievement analytics and insights</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownloadCSV}>
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Button onClick={handleDownloadPDF}>
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select onValueChange={setYearFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Departments</SelectItem>
            <SelectItem value="Computer Science">Computer Science</SelectItem>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Business">Business</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Category" />
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

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
            </div>
            <p className="text-3xl font-bold text-foreground mt-2">{stats.totalSubmissions}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <p className="text-sm font-medium text-muted-foreground">Approved</p>
            </div>
            <p className="text-3xl font-bold text-foreground mt-2">{stats.totalApproved}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-yellow-600" />
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
            </div>
            <p className="text-3xl font-bold text-foreground mt-2">{stats.totalPending}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <p className="text-sm font-medium text-muted-foreground">Active Students</p>
            </div>
            <p className="text-3xl font-bold text-foreground mt-2">{stats.totalStudents}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <p className="text-sm font-medium text-muted-foreground">Approval Rate</p>
            </div>
            <p className="text-3xl font-bold text-foreground mt-2">{stats.overallApprovalRate}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Report Table */}
      <Card>
        <CardHeader>
          <CardTitle>Achievement Analytics by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Approved</TableHead>
                <TableHead className="text-right">Pending</TableHead>
                <TableHead className="text-right">Rejected</TableHead>
                <TableHead className="text-right">Approval Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.map((row) => (
                <TableRow key={row.category}>
                  <TableCell className="font-medium">{row.category}</TableCell>
                  <TableCell className="text-right">{row.total}</TableCell>
                  <TableCell className="text-right text-green-600">{row.approved}</TableCell>
                  <TableCell className="text-right text-yellow-600">{row.pending}</TableCell>
                  <TableCell className="text-right text-red-600">{row.rejected}</TableCell>
                  <TableCell className="text-right">
                    <span className={`font-medium ${row.approvalRate >= 80 ? 'text-green-600' : row.approvalRate >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {row.approvalRate}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}