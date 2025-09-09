import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReusableInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  required?: boolean;
  variant?: 'default' | 'secure' | 'exam';
}

const ReusableInput = forwardRef<HTMLInputElement, ReusableInputProps>(
  ({ label, error, success, hint, required, variant = 'default', className, ...props }, ref) => {
    const getInputClass = () => {
      if (error) return 'border-danger focus:ring-danger';
      if (success) return 'border-success focus:ring-success';
      if (variant === 'secure') return 'border-primary focus:ring-primary';
      return '';
    };

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={props.id} className="text-sm font-medium">
            {label}
            {required && <span className="text-danger ml-1">*</span>}
          </Label>
        )}
        
        <Input
          ref={ref}
          className={cn(getInputClass(), className)}
          {...props}
        />
        
        {error && (
          <Alert className="border-danger/50 bg-danger/5 py-2">
            <AlertCircle className="h-4 w-4 text-danger" />
            <AlertDescription className="text-xs text-danger">
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="border-success/50 bg-success/5 py-2">
            <Check className="h-4 w-4 text-success" />
            <AlertDescription className="text-xs text-success">
              {success}
            </AlertDescription>
          </Alert>
        )}
        
        {hint && !error && !success && (
          <p className="text-xs text-muted-foreground">{hint}</p>
        )}
      </div>
    );
  }
);

ReusableInput.displayName = "ReusableInput";

export default ReusableInput;