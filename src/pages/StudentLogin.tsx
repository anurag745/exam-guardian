import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Camera, AlertCircle, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const StudentLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [faceVerified, setFaceVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const startFaceVerification = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      // Simulate face verification after 3 seconds
      setTimeout(() => {
        setFaceVerified(true);
        setShowCamera(false);
        stream.getTracks().forEach(track => track.stop());
        toast({
          title: "Face Verification Successful",
          description: "Your identity has been verified.",
        });
      }, 3000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Camera Access Denied",
        description: "Please allow camera access for face verification.",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!faceVerified) {
      toast({
        variant: "destructive",
        title: "Face Verification Required",
        description: "Please complete face verification before logging in.",
      });
      return;
    }

    setIsLoading(true);
    
    const success = await login(username, password, 'student');
    
    if (success) {
      toast({
        title: "Login Successful",
        description: "Welcome to your exam portal.",
      });
      navigate('/student/exam/sample-exam');
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid username or password.",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-2xl font-bold text-primary">
            <Shield className="h-8 w-8" />
            <span>ExamGuard</span>
          </Link>
          <p className="text-muted-foreground mt-2">Student Portal</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Student Login</CardTitle>
            <CardDescription>
              Enter your credentials and complete face verification to access your exam
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-4">
                <Label>Face Verification</Label>
                {!faceVerified && !showCamera && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={startFaceVerification}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Start Face Verification
                  </Button>
                )}

                {showCamera && (
                  <div className="space-y-2">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Please look directly at the camera for face verification...
                      </AlertDescription>
                    </Alert>
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      className="w-full rounded-lg border"
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  </div>
                )}

                {faceVerified && (
                  <Alert className="border-success/50 bg-success/5">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <AlertDescription className="text-success-foreground">
                      Face verification completed successfully
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-primary-dark"
                disabled={isLoading || !faceVerified}
              >
                {isLoading ? "Logging in..." : "Login to Exam"}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              <Link to="/instructor/login" className="text-primary hover:underline">
                Instructor? Login here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentLogin;