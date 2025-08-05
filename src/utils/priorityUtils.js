import { PRIORITY } from "../constants";

export const getPriorityByValue = (value) => {
  return Object.values(PRIORITY).find((priority) => priority.value === value);
};

export const getPriorityOrder = () => {
  return Object.values(PRIORITY).map((priority) => priority.value);
};