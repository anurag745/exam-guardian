import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Eye, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertNotificationProps {
  type: 'security' | 'monitoring' | 'system' | 'warning';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp?: string;
  className?: string;
}

const AlertNotification: React.FC<AlertNotificationProps> = ({
  type,
  severity,
  title,
  description,
  timestamp,
  className
}) => {
  const getIcon = () => {
    switch (type) {
      case 'security':
        return <Shield className="h-4 w-4" />;
      case 'monitoring':
        return <Eye className="h-4 w-4" />;
      case 'system':
        return <Camera className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSeverityVariant = () => {
    switch (severity) {
      case 'low':
        return 'outline';
      case 'medium':
        return 'secondary';
      case 'high':
        return 'warning';
      case 'critical':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getAlertClass = () => {
    switch (severity) {
      case 'critical':
        return 'border-danger/50 bg-danger/5';
      case 'high':
        return 'border-warning/50 bg-warning/5';
      case 'medium':
        return 'border-primary/50 bg-primary/5';
      default:
        return '';
    }
  };

  return (
    <Alert className={cn(getAlertClass(), className)}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          {getIcon()}
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">{title}</span>
              <Badge variant={getSeverityVariant() as any} className="text-xs">
                {severity.toUpperCase()}
              </Badge>
            </div>
            <AlertDescription className="text-xs">
              {description}
            </AlertDescription>
            {timestamp && (
              <p className="text-xs text-muted-foreground">{timestamp}</p>
            )}
          </div>
        </div>
      </div>
    </Alert>
  );
};

export default AlertNotification;