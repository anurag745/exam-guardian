import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Monitor, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/20">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">ExamGuard</span>
          </div>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link to="/student/login" className="text-muted-foreground hover:text-foreground transition-colors">
              Student Portal
            </Link>
            <Link to="/instructor/login" className="text-muted-foreground hover:text-foreground transition-colors">
              Instructor Portal
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="mb-8 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm">
            <Shield className="mr-2 h-4 w-4" />
            Hybrid AI-Powered Cheating Detection
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            Secure Online Exams with Advanced Monitoring
          </h1>
          <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto">
            ExamGuard combines keystroke analysis, plagiarism detection, and real-time webcam monitoring 
            to ensure exam integrity while maintaining student privacy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-gradient-to-r from-primary to-primary-dark">
              <Link to="/student/login">Student Login</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/instructor/login">Instructor Portal</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-card/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Monitoring System</h2>
            <p className="text-muted-foreground text-lg">Advanced AI-powered features for complete exam security</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader className="text-center">
                <Monitor className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Real-time Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Webcam feed analysis and behavioral pattern detection during exams
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader className="text-center">
                <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Plagiarism Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  AI-powered text analysis to detect copied content and suspicious patterns
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader className="text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Keystroke Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Biometric authentication through typing patterns and behavior analysis
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader className="text-center">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Detailed Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Comprehensive post-exam analytics with confidence scores and evidence
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 ExamGuard. Advanced Online Exam Security System.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;