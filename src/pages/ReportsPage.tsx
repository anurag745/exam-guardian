import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Download, 
  Search, 
  Filter,
  Shield,
  AlertTriangle,
  Eye,
  Users,
  ArrowLeft
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface StudentReport {
  id: string;
  studentName: string;
  examTitle: string;
  examDate: string;
  plagiarismScore: number;
  keystrokeAnomalies: number;
  webcamAlerts: number;
  overallRiskScore: number;
  status: 'clean' | 'suspicious' | 'flagged';
  timeSpent: number;
  completionRate: number;
}

const ReportsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [examFilter, setExamFilter] = useState("all");

  const reports: StudentReport[] = [
    {
      id: '1',
      studentName: 'Alice Johnson',
      examTitle: 'Computer Science Final',
      examDate: '2024-01-15',
      plagiarismScore: 15,
      keystrokeAnomalies: 2,
      webcamAlerts: 0,
      overallRiskScore: 25,
      status: 'clean',
      timeSpent: 45,
      completionRate: 100
    },
    {
      id: '2',
      studentName: 'Bob Smith',
      examTitle: 'Computer Science Final',
      examDate: '2024-01-15',
      plagiarismScore: 75,
      keystrokeAnomalies: 8,
      webcamAlerts: 5,
      overallRiskScore: 85,
      status: 'flagged',
      timeSpent: 35,
      completionRate: 90
    },
    {
      id: '3',
      studentName: 'Carol Davis',
      examTitle: 'Computer Science Final',
      examDate: '2024-01-15',
      plagiarismScore: 45,
      keystrokeAnomalies: 4,
      webcamAlerts: 2,
      overallRiskScore: 55,
      status: 'suspicious',
      timeSpent: 50,
      completionRate: 95
    }
  ];

  if (!user || user.role !== 'instructor') {
    navigate('/instructor/login');
    return null;
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.examTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    const matchesExam = examFilter === "all" || report.examTitle === examFilter;
    
    return matchesSearch && matchesStatus && matchesExam;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clean': return 'success';
      case 'suspicious': return 'warning';
      case 'flagged': return 'destructive';
      default: return 'default';
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return 'success';
    if (score < 70) return 'warning';
    return 'destructive';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/instructor/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <span className="text-muted-foreground">|</span>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-semibold">Exam Reports</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reports.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all exams
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clean Results</CardTitle>
                  <Shield className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">
                    {reports.filter(r => r.status === 'clean').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((reports.filter(r => r.status === 'clean').length / reports.length) * 100)}% of total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Flagged Cases</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">
                    {reports.filter(r => r.status === 'flagged').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Require investigation
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Risk Score</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(reports.reduce((sum, r) => sum + r.overallRiskScore, 0) / reports.length)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Across all students
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Overview Table */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Exam Reports</CardTitle>
                <CardDescription>
                  Overview of the latest exam results and security assessments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Exam</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.slice(0, 5).map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.studentName}</TableCell>
                        <TableCell>{report.examTitle}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress 
                              value={report.overallRiskScore} 
                              className="w-16 h-2"
                            />
                            <span className={`text-sm font-medium text-${getRiskColor(report.overallRiskScore)}`}>
                              {report.overallRiskScore}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(report.status) as any}>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filter Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by student name or exam..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="clean">Clean</SelectItem>
                      <SelectItem value="suspicious">Suspicious</SelectItem>
                      <SelectItem value="flagged">Flagged</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={examFilter} onValueChange={setExamFilter}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by exam" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Exams</SelectItem>
                      <SelectItem value="Computer Science Final">Computer Science Final</SelectItem>
                      <SelectItem value="Data Structures Midterm">Data Structures Midterm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Reports Table */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Exam Reports</CardTitle>
                <CardDescription>
                  Comprehensive analysis of student performance and security metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Exam</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Plagiarism</TableHead>
                      <TableHead>Keystroke</TableHead>
                      <TableHead>Webcam</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.studentName}</TableCell>
                        <TableCell>{report.examTitle}</TableCell>
                        <TableCell>{new Date(report.examDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={report.plagiarismScore > 50 ? "destructive" : "outline"}
                            className="text-xs"
                          >
                            {report.plagiarismScore}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={report.keystrokeAnomalies > 5 ? "destructive" : "outline"}
                            className="text-xs"
                          >
                            {report.keystrokeAnomalies}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={report.webcamAlerts > 3 ? "destructive" : "outline"}
                            className="text-xs"
                          >
                            {report.webcamAlerts}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress 
                              value={report.overallRiskScore} 
                              className="w-16 h-2"
                            />
                            <span className={`text-sm font-medium text-${getRiskColor(report.overallRiskScore)}`}>
                              {report.overallRiskScore}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(report.status) as any}>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Details
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Analytics Cards */}
              <Card>
                <CardHeader>
                  <CardTitle>Security Trend Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Analytics dashboard coming soon. Will include trends, patterns, and detailed statistical analysis.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Average Completion Rate</span>
                      <span className="font-bold">
                        {Math.round(reports.reduce((sum, r) => sum + r.completionRate, 0) / reports.length)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Time Spent</span>
                      <span className="font-bold">
                        {Math.round(reports.reduce((sum, r) => sum + r.timeSpent, 0) / reports.length)} minutes
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Security Incident Rate</span>
                      <span className="font-bold text-warning">
                        {Math.round((reports.filter(r => r.status !== 'clean').length / reports.length) * 100)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReportsPage;