import {
  FaExclamationTriangle,
  FaChevronUp,
  FaChevronDown,
  FaMinus,
  FaFlag,
  FaStar,
  FaBolt,
  FaFire,
  FaArrowUp,
  FaArrowDown,
  FaCircle,
  FaSquare,
  FaHeart,
  FaClock,
  FaCalendarAlt,
  FaExclamation,
  FaQuestion,
  FaInfo,
  FaCheck,
  FaTimes,
  FaPlus,
  FaAsterisk,
  FaHashtag,
  FaAt,
  FaPercent,
  FaGem,
} from "react-icons/fa";

import {
  IoAlertCircle,
  IoWarning,
  IoSpeedometer,
  IoFlame,
  IoFlash,
  IoRocket,
  IoTime,
  IoNotifications,
  IoStar,
  IoFlag,
} from "react-icons/io5";

import {
  MdPriorityHigh,
  MdFlag,
  MdStar,
  MdWarning,
  MdInfo,
  MdNotifications,
  MdSpeed,
  MdTrendingUp,
  MdTrendingDown,
} from "react-icons/md";

// Define available priority icons with categories
export const PRIORITY_ICONS = {
  // Basic Arrows & Directions
  "fa-chevron-up": {
    component: FaChevronUp,
    name: "Chevron Up",
    category: "arrows",
  },
  "fa-chevron-down": {
    component: FaChevronDown,
    name: "Chevron Down",
    category: "arrows",
  },
  "fa-arrow-up": { component: FaArrowUp, name: "Arrow Up", category: "arrows" },
  "fa-arrow-down": {
    component: FaArrowDown,
    name: "Arrow Down",
    category: "arrows",
  },

  // Priority & Urgency
  "fa-exclamation-triangle": {
    component: FaExclamationTriangle,
    name: "Warning Triangle",
    category: "priority",
  },
  "fa-exclamation": {
    component: FaExclamation,
    name: "Exclamation",
    category: "priority",
  },
  "fa-fire": { component: FaFire, name: "Fire", category: "priority" },
  "fa-bolt": { component: FaBolt, name: "Lightning", category: "priority" },
  "io-alert-circle": {
    component: IoAlertCircle,
    name: "Alert Circle",
    category: "priority",
  },
  "io-warning": { component: IoWarning, name: "Warning", category: "priority" },
  "md-priority-high": {
    component: MdPriorityHigh,
    name: "Priority High",
    category: "priority",
  },
  "md-warning": { component: MdWarning, name: "Warning", category: "priority" },

  // Flags & Markers
  "fa-flag": { component: FaFlag, name: "Flag", category: "markers" },
  "io-flag": { component: IoFlag, name: "Flag Outline", category: "markers" },
  "md-flag": { component: MdFlag, name: "Material Flag", category: "markers" },
  "fa-star": { component: FaStar, name: "Star", category: "markers" },
  "io-star": { component: IoStar, name: "Star Outline", category: "markers" },
  "md-star": { component: MdStar, name: "Material Star", category: "markers" },

  // Shapes & Basic
  "fa-minus": { component: FaMinus, name: "Minus", category: "basic" },
  "fa-circle": { component: FaCircle, name: "Circle", category: "basic" },
  "fa-square": { component: FaSquare, name: "Square", category: "basic" },
  "fa-diamond": { component: FaGem, name: "Diamond", category: "basic" },
  "fa-heart": { component: FaHeart, name: "Heart", category: "basic" },

  // Time & Speed
  "fa-clock": { component: FaClock, name: "Clock", category: "time" },
  "fa-calendar": {
    component: FaCalendarAlt,
    name: "Calendar",
    category: "time",
  },
  "io-time": { component: IoTime, name: "Time", category: "time" },
  "io-speedometer": {
    component: IoSpeedometer,
    name: "Speedometer",
    category: "time",
  },
  "md-speed": { component: MdSpeed, name: "Speed", category: "time" },

  // Action & Status
  "fa-check": { component: FaCheck, name: "Check", category: "status" },
  "fa-times": { component: FaTimes, name: "Times", category: "status" },
  "fa-plus": { component: FaPlus, name: "Plus", category: "status" },
  "fa-info": { component: FaInfo, name: "Info", category: "status" },
  "fa-question": {
    component: FaQuestion,
    name: "Question",
    category: "status",
  },
  "md-info": { component: MdInfo, name: "Material Info", category: "status" },

  // Special Symbols
  "fa-hashtag": { component: FaHashtag, name: "Hashtag", category: "symbols" },
  "fa-at": { component: FaAt, name: "At Symbol", category: "symbols" },
  "fa-asterisk": {
    component: FaAsterisk,
    name: "Asterisk",
    category: "symbols",
  },
  "fa-percent": { component: FaPercent, name: "Percent", category: "symbols" },

  // Trending & Movement
  "md-trending-up": {
    component: MdTrendingUp,
    name: "Trending Up",
    category: "trending",
  },
  "md-trending-down": {
    component: MdTrendingDown,
    name: "Trending Down",
    category: "trending",
  },
  "io-rocket": { component: IoRocket, name: "Rocket", category: "trending" },
  "io-flash": { component: IoFlash, name: "Flash", category: "trending" },
  "io-flame": { component: IoFlame, name: "Flame", category: "trending" },

  // Notifications
  "io-notifications": {
    component: IoNotifications,
    name: "Notifications",
    category: "notifications",
  },
  "md-notifications": {
    component: MdNotifications,
    name: "Material Notifications",
    category: "notifications",
  },
};

// Default icon mappings for existing priority keys
export const DEFAULT_PRIORITY_ICON_MAPPING = {
  low: "fa-chevron-down",
  medium: "fa-minus",
  high: "fa-chevron-up",
  urgent: "fa-exclamation-triangle",
};

// Get icon component by key
export const getIconComponent = (iconKey) => {
  const iconData = PRIORITY_ICONS[iconKey];
  return iconData ? iconData.component : PRIORITY_ICONS["fa-minus"].component;
};

// Get icon name by key
export const getIconName = (iconKey) => {
  const iconData = PRIORITY_ICONS[iconKey];
  return iconData ? iconData.name : "Default";
};

// Get icons by category
export const getIconsByCategory = (category) => {
  return Object.entries(PRIORITY_ICONS)
    .filter(([key, data]) => data.category === category)
    .reduce((acc, [key, data]) => {
      acc[key] = data;
      return acc;
    }, {});
};

// Get all categories
export const getIconCategories = () => {
  const categories = new Set();
  Object.values(PRIORITY_ICONS).forEach((icon) =>
    categories.add(icon.category),
  );
  return Array.from(categories).sort();
};

// Helper function to get priority icon (with fallback to mapping)
export const getPriorityIcon = (priority, iconKey = null) => {
  // If iconKey is provided, use it
  if (iconKey && PRIORITY_ICONS[iconKey]) {
    return PRIORITY_ICONS[iconKey].component;
  }

  // Otherwise fall back to default mapping by priority key
  const defaultIconKey =
    DEFAULT_PRIORITY_ICON_MAPPING[priority?.key] ||
    DEFAULT_PRIORITY_ICON_MAPPING.medium;
  return PRIORITY_ICONS[defaultIconKey].component;
};
