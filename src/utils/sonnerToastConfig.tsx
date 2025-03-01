import { toast } from "sonner";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    icon: <CheckCircle className="text-green-500" />,
    style: {
      border: "1px solid #16a34a", // Tailwind green-600
      background: "#dcfce7", // Light green background
      color: "#065f46", // Dark green text
    },
    duration: 3000,
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    icon: <XCircle className="text-red-500" />,
    style: {
      border: "1px solid #dc2626", // Tailwind red-600
      background: "#fee2e2", // Light red background
      color: "#7f1d1d", // Dark red text
    },
    duration: 4000,
  });
};

export const showWarningToast = (message: string) => {
  toast.warning(message, {
    icon: <AlertTriangle className="text-yellow-500" />,
    style: {
      border: "1px solid #f59e0b", // Tailwind yellow-500
      background: "#fef3c7", // Light yellow background
      color: "#78350f", // Dark yellow text
    },
    duration: 3500,
  });
};
