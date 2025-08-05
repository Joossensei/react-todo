import {
  FaArrowDown,
  FaArrowRight,
  FaArrowUp,
  FaExclamationTriangle,
} from "react-icons/fa";

export const PRIORITY = {
  LOW: {
    value: "low",
    label: "Low",
    color: "#6b7280",
    icon: <FaArrowDown />,
    bgColor: "#f3f4f6",
  },
  MEDIUM: {
    value: "medium",
    label: "Medium",
    color: "#f59e0b",
    icon: <FaArrowRight />,
    bgColor: "#fef3c7",
  },
  HIGH: {
    value: "high",
    label: "High",
    color: "#ef4444",
    icon: <FaArrowUp />,
    bgColor: "#fee2e2",
  },
  URGENT: {
    value: "urgent",
    label: "Urgent",
    color: "#dc2626",
    icon: <FaExclamationTriangle />,
    bgColor: "#fecaca",
  },
};

// Helper functions