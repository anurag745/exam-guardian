import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Camera, Clock, AlertTriangle, Eye, Shield } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ExamQuestion {
  id: number;
  question: string;
  maxLength: number;
}

const StudentExam = () => {
  const { examId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [alerts, setAlerts] = useState<string[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [keystrokePattern, setKeystrokePattern] = useState<number[]>([]);

  const examQuestions: ExamQuestion[] = [
    {
      id: 1,
      question: "Explain the concept of object-oriented programming and its main principles.",
      maxLength: 500
    },
    {
      id: 2,
      question: "Describe the differences between procedural and functional programming paradigms.",
      maxLength: 400
    },
    {
      id: 3,
      question: "What are the advantages and disadvantages of using cloud computing for enterprise applications?",
      maxLength: 600
    }
  ];

  useEffect(() => {
    // Start webcam monitoring
    const startMonitoring = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Camera Required",
          description: "Camera access is required for exam monitoring.",
        });
      }
    };

    startMonitoring();

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Simulate random monitoring alerts
    const alertTimer = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every 5 seconds
        const alertMessages = [
          "Multiple faces detected in frame",
          "Looking away from screen detected",
          "Suspicious tab switching behavior",
          "Audio detected from external source"
        ];
        const randomAlert = alertMessages[Math.floor(Math.random() * alertMessages.length)];
        setAlerts(prev => [...prev.slice(-2), randomAlert]); // Keep last 3 alerts
        
        toast({
          variant: "destructive",
          title: "Monitoring Alert",
          description: randomAlert,
        });
      }
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(alertTimer);
      // Stop camera stream
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    
    // Capture keystroke timing (simplified)
    const now = Date.now();
    setKeystrokePattern(prev => [...prev.slice(-19), now]); // Keep last 20 keystrokes
  };

  const handleSubmitExam = async () => {
    // Simulate exam submission
    const examData = {
      examId,
      studentId: user?.id,
      answers,
      keystrokePattern,
      alerts,
      timeSpent: 3600 - timeLeft
    };

    console.log('Submitting exam:', examData);
    
    toast({
      title: "Exam Submitted Successfully",
      description: "Your answers have been recorded and will be reviewed.",
    });

    navigate('/');
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!user || user.role !== 'student') {
    navigate('/student/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <h1 className="font-semibold">Computer Science Exam</h1>
              <p className="text-sm text-muted-foreground">Student: {user.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant={timeLeft > 300 ? "default" : "destructive"} className="text-sm">
              <Clock className="mr-1 h-4 w-4" />
              {formatTime(timeLeft)}
            </Badge>
            
            <Badge variant={isMonitoring ? "default" : "secondary"} className="text-sm">
              <Eye className="mr-1 h-4 w-4" />
              Monitoring Active
            </Badge>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Exam Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Exam Instructions</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Answer all questions to the best of your ability</li>
                  <li>• Stay within the character limits for each question</li>
                  <li>• Keep your face visible to the camera at all times</li>
                  <li>• Do not switch tabs or leave the exam window</li>
                  <li>• You have {formatTime(3600)} to complete the exam</li>
                </ul>
              </CardContent>
            </Card>

            {/* Questions */}
            {examQuestions.map((question, index) => (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Question {index + 1} of {examQuestions.length}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground">{question.question}</p>
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Type your answer here..."
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="min-h-[150px] resize-none"
                      maxLength={question.maxLength}
                    />
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Character limit: {question.maxLength}</span>
                      <span>{(answers[question.id] || '').length}/{question.maxLength}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button 
                size="lg" 
                onClick={handleSubmitExam}
                className="bg-gradient-to-r from-primary to-primary-dark"
              >
                Submit Exam
              </Button>
            </div>
          </div>

          {/* Monitoring Sidebar */}
          <div className="space-y-6">
            {/* Webcam Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Live Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  muted
                  className="w-full rounded border aspect-video object-cover"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Your activity is being monitored for exam integrity
                </p>
              </CardContent>
            </Card>

            {/* Alerts */}
            {alerts.length > 0 && (
              <Card className="border-warning/50">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2 text-warning">
                    <AlertTriangle className="h-4 w-4" />
                    Recent Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {alerts.slice(-3).map((alert, index) => (
                    <Alert key={index} className="border-warning/30 bg-warning/5">
                      <AlertDescription className="text-xs">
                        {alert}
                      </AlertDescription>
                    </Alert>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Exam Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Questions Answered:</span>
                  <span>{Object.keys(answers).length}/{examQuestions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Remaining:</span>
                  <span className={timeLeft < 300 ? "text-danger" : ""}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Alerts Triggered:</span>
                  <span className={alerts.length > 0 ? "text-warning" : "text-success"}>
                    {alerts.length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentExam;