import React from "react";
import "./styles/StatusBanner.css";
import {
  FaInfoCircle,
  FaExclamationCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";

const ICONS = {
  info: FaInfoCircle,
  error: FaExclamationCircle,
  success: FaCheckCircle,
  warning: FaExclamationTriangle,
  loading: FaSpinner,
};

export const StatusBanner = ({
  type = "info",
  children,
  message,
  className = "",
}) => {
  const Icon = ICONS[type] || ICONS.info;
  return (
    <div className={`status-banner ${type} ${className}`.trim()} role="status">
      <Icon className={`status-icon ${type === "loading" ? "spin" : ""}`} />
      <span>{children ?? message}</span>
    </div>
  );
};

export default StatusBanner;
