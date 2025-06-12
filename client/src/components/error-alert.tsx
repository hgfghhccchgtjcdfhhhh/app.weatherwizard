import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorAlertProps {
  isVisible: boolean;
  message: string;
  onDismiss: () => void;
  onRetry?: () => void;
}

export default function ErrorAlert({ isVisible, message, onDismiss, onRetry }: ErrorAlertProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-2xl shadow-2xl max-w-sm z-50 backdrop-blur-md border border-red-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="animate-bounce">⚠️</div>
          <span className="font-bold text-lg">Spell Failed</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="ml-4 text-white hover:text-red-200 p-1 h-auto transition-colors duration-200"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      <p className="mt-3 text-sm font-medium">{message}</p>
      {onRetry && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRetry}
          className="mt-3 text-sm underline p-0 h-auto text-white hover:text-red-200 font-semibold transition-colors duration-200"
        >
          🪄 Cast Again
        </Button>
      )}
    </div>
  );
}
