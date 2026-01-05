// frontend/components/ui/Toast/Toast.tsx
"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

interface ToastProps {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  onClose: (id: string) => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type,
  onClose,
  duration = 2000,
}) => {
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFading(true);
      const fadeTimer = setTimeout(() => onClose(id), 300);
      return () => clearTimeout(fadeTimer);
    }, duration);

    const interval = 50;
    const steps = duration / interval;
    const progressStep = 100 / steps;

    let progressTimer: NodeJS.Timeout;
    if (duration > 0) {
      progressTimer = setInterval(() => {
        setProgress((prev) => Math.max(0, prev - progressStep));
      }, interval);
    }

    return () => {
      clearTimeout(timer);
      if (progressTimer) clearInterval(progressTimer);
    };
  }, [duration, id, onClose]);

  const typeConfig = {
    success: {
      bg: "bg-white",
      border: "border-l-4 border-green-500",
      icon: CheckCircle,
      iconColor: "text-green-500",
      progressBar: "bg-green-500",
    },
    error: {
      bg: "bg-white",
      border: "border-l-4 border-red-500",
      icon: XCircle,
      iconColor: "text-red-500",
      progressBar: "bg-red-500",
    },
    info: {
      bg: "bg-white",
      border: "border-l-4 border-blue-500",
      icon: Info,
      iconColor: "text-blue-500",
      progressBar: "bg-blue-500",
    },
  };

  const config = typeConfig[type];
  const IconComponent = config.icon;

  return (
    <div
      className={`relative flex items-start gap-3 w-96 p-4 rounded-lg shadow-lg transition-all duration-300 transform ${
        config.bg
      } ${config.border} ${
        isFading
          ? "opacity-0 translate-x-full"
          : "opacity-100 translate-x-0"
      }`}
    >
      <div className={`flex-shrink-0 ${config.iconColor}`}>
        <IconComponent size={20} />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 leading-relaxed">
          {message}
        </p>
      </div>

      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Close"
      >
        <X size={16} />
      </button>

      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 rounded-b-lg overflow-hidden">
          <div
            className={`h-full ${config.progressBar} transition-all ease-linear`}
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Toast;