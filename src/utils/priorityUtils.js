export const getPriorityByValue = (priorities, value) => {
  return priorities.find((priority) => priority.key === value);
};

export const getPriorityOrder = (priorities) => {
  return priorities
    .sort((a, b) => a.order - b.order)
    .map((priority) => priority.key);
};

export const getPriorityByKey = (priorities, key) => {
  return priorities.find((priority) => priority.key === key);
};
