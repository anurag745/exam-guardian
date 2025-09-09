import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Download, Search, Eye, Filter } from "lucide-react";

interface ReportData {
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

interface ReportsTableProps {
  data: ReportData[];
  title?: string;
  showFilters?: boolean;
  onViewDetails?: (reportId: string) => void;
  onExport?: (reportId: string) => void;
}

const ReportsTable: React.FC<ReportsTableProps> = ({
  data,
  title = "Reports",
  showFilters = true,
  onViewDetails,
  onExport
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const filteredData = data
    .filter(report => {
      const matchesSearch = report.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           report.examTitle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || report.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'risk':
          return b.overallRiskScore - a.overallRiskScore;
        case 'name':
          return a.studentName.localeCompare(b.studentName);
        case 'date':
          return new Date(b.examDate).getTime() - new Date(a.examDate).getTime();
        default:
          return 0;
      }
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
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            {title}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => onExport?.('all')}>
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by student name or exam..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
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
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="risk">Risk Score</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Exam</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Plagiarism</TableHead>
                <TableHead className="text-center">Keystroke</TableHead>
                <TableHead className="text-center">Webcam</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No reports match your current filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((report) => (
                  <TableRow key={report.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{report.studentName}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{report.examTitle}</TableCell>
                    <TableCell>{new Date(report.examDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={report.plagiarismScore > 50 ? "destructive" : "outline"}
                        className="text-xs"
                      >
                        {report.plagiarismScore}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={report.keystrokeAnomalies > 5 ? "destructive" : "outline"}
                        className="text-xs"
                      >
                        {report.keystrokeAnomalies}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
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
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onViewDetails?.(report.id)}
                        >
                          Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onExport?.(report.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {filteredData.length > 0 && (
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Showing {filteredData.length} of {data.length} reports</span>
            <div className="flex items-center space-x-4">
              <span>Clean: {filteredData.filter(r => r.status === 'clean').length}</span>
              <span>Suspicious: {filteredData.filter(r => r.status === 'suspicious').length}</span>
              <span>Flagged: {filteredData.filter(r => r.status === 'flagged').length}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportsTable;