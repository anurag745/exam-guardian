import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  Plus, 
  Calendar, 
  AlertTriangle, 
  Shield, 
  Eye, 
  FileText,
  Clock,
  Camera,
  LogOut
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Exam {
  id: string;
  title: string;
  date: string;
  duration: number;
  status: 'scheduled' | 'active' | 'completed';
  studentsEnrolled: number;
}

interface Student {
  id: string;
  name: string;
  status: 'online' | 'away' | 'suspicious';
  alertCount: number;
  examProgress: number;
  lastActivity: string;
}

const InstructorDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [exams, setExams] = useState<Exam[]>([
    {
      id: '1',
      title: 'Computer Science Final Exam',
      date: '2024-01-15',
      duration: 60,
      status: 'active',
      studentsEnrolled: 25
    },
    {
      id: '2',
      title: 'Data Structures Midterm',
      date: '2024-01-20',
      duration: 90,
      status: 'scheduled',
      studentsEnrolled: 30
    }
  ]);

  const [activeStudents, setActiveStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      status: 'online',
      alertCount: 0,
      examProgress: 75,
      lastActivity: '2 mins ago'
    },
    {
      id: '2',
      name: 'Bob Smith',
      status: 'suspicious',
      alertCount: 3,
      examProgress: 45,
      lastActivity: '1 min ago'
    },
    {
      id: '3',
      name: 'Carol Davis',
      status: 'online',
      alertCount: 1,
      examProgress: 60,
      lastActivity: '30 secs ago'
    }
  ]);

  const [newExam, setNewExam] = useState({
    title: '',
    date: '',
    duration: 60
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setActiveStudents(prev => prev.map(student => ({
        ...student,
        examProgress: Math.min(100, student.examProgress + Math.floor(Math.random() * 3)),
        alertCount: student.status === 'suspicious' ? 
          student.alertCount + (Math.random() < 0.3 ? 1 : 0) : 
          student.alertCount
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!user || user.role !== 'instructor') {
    navigate('/instructor/login');
    return null;
  }

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExam.title || !newExam.date) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    const exam: Exam = {
      id: Date.now().toString(),
      title: newExam.title,
      date: newExam.date,
      duration: newExam.duration,
      status: 'scheduled',
      studentsEnrolled: 0
    };

    setExams(prev => [...prev, exam]);
    setNewExam({ title: '', date: '', duration: 60 });
    
    toast({
      title: "Exam Created",
      description: `${exam.title} has been scheduled successfully.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'success';
      case 'suspicious': return 'destructive';
      case 'away': return 'secondary';
      default: return 'default';
    }
  };

  const getExamStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'scheduled': return 'default';
      case 'completed': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">ExamGuard</span>
            </Link>
            <span className="text-muted-foreground">|</span>
            <span className="text-sm text-muted-foreground">Instructor Dashboard</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <Tabs defaultValue="monitoring" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
            <TabsTrigger value="exams">Exam Management</TabsTrigger>
            <TabsTrigger value="reports">
              <Link to="/instructor/reports" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Reports
              </Link>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monitoring" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{activeStudents.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Alerts Today</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">
                    {activeStudents.reduce((sum, student) => sum + student.alertCount, 0)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Exams</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">
                    {exams.filter(exam => exam.status === 'active').length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(activeStudents.reduce((sum, student) => sum + student.examProgress, 0) / activeStudents.length)}%
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Students Monitoring */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Real-time Student Monitoring
                </CardTitle>
                <CardDescription>
                  Monitor student activity and detect suspicious behavior during active exams
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Camera className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">{student.name}</h4>
                          <p className="text-sm text-muted-foreground">Last activity: {student.lastActivity}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-sm font-medium">{student.examProgress}%</p>
                          <p className="text-xs text-muted-foreground">Progress</p>
                        </div>
                        
                        <Badge variant={getStatusColor(student.status) as any}>
                          {student.status}
                        </Badge>
                        
                        {student.alertCount > 0 && (
                          <Badge variant="destructive">
                            {student.alertCount} alerts
                          </Badge>
                        )}
                        
                        <Button variant="outline" size="sm">
                          View Feed
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recent Security Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert className="border-warning/50 bg-warning/5">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Bob Smith:</strong> Multiple faces detected in webcam feed - 2 minutes ago
                  </AlertDescription>
                </Alert>
                
                <Alert className="border-warning/50 bg-warning/5">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Carol Davis:</strong> Suspicious keystroke pattern detected - 5 minutes ago
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Bob Smith:</strong> Tab switching behavior detected - 8 minutes ago
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exams" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Create New Exam */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create New Exam
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateExam} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Exam Title</Label>
                      <Input
                        id="title"
                        value={newExam.title}
                        onChange={(e) => setNewExam(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter exam title"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="date">Exam Date</Label>
                      <Input
                        id="date"
                        type="datetime-local"
                        value={newExam.date}
                        onChange={(e) => setNewExam(prev => ({ ...prev, date: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={newExam.duration}
                        onChange={(e) => setNewExam(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                        min="15"
                        max="300"
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Create Exam
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Existing Exams */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-semibold">Existing Exams</h3>
                {exams.map((exam) => (
                  <Card key={exam.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{exam.title}</CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(exam.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {exam.duration} minutes
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {exam.studentsEnrolled} students
                            </span>
                          </CardDescription>
                        </div>
                        <Badge variant={getExamStatusColor(exam.status) as any}>
                          {exam.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit Exam
                        </Button>
                        <Button variant="outline" size="sm">
                          View Results
                        </Button>
                        {exam.status === 'active' && (
                          <Button size="sm">
                            Monitor Live
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InstructorDashboard;
