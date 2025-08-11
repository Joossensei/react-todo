// Utils
import { getPriorityOrder } from "./priorityUtils";

// Smart sort functions
export const sortTodos = (todos, priorities, sortBy) => {
  const sortedTodos = [...todos];

  switch (sortBy) {
    case "priority-desc":
      return sortedTodos.sort((a, b) => {
        const priorityOrder = getPriorityOrder(priorities);
        // Return the difference between the index of the priority of the second todo and the first todo
        return (
          priorityOrder.indexOf(b.priority) - priorityOrder.indexOf(a.priority)
        );
      });

    case "priority-desc-text-asc":
      return sortedTodos.sort((a, b) => {
        const priorityOrder = getPriorityOrder(priorities);
        // Return the difference between the index of the priority of the second todo and the first todo
        const priorityDiff =
          priorityOrder.indexOf(b.priority) - priorityOrder.indexOf(a.priority);
        // If the priorities are different, return the difference
        if (priorityDiff !== 0) return priorityDiff;
        // If the priorities are the same, return the difference between the text of the second todo and the first todo
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });

    case "incomplete-priority-desc":
      return sortedTodos.sort((a, b) => {
        // Incomplete todos first
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        // Then by priority (high to low)
        const priorityOrder = getPriorityOrder(priorities);
        // Return the difference between the index of the priority of the second todo and the first todo
        return (
          priorityOrder.indexOf(b.priority) - priorityOrder.indexOf(a.priority)
        );
      });

    case "text-asc":
      // Return the difference between the text of the second todo and the first todo
      return sortedTodos.sort((a, b) => a.name.localeCompare(b.name));

    case "text-desc":
      // Return the difference between the text of the second todo and the first todo
      return sortedTodos.sort((a, b) => b.name.localeCompare(a.name));

    default:
      return sortedTodos;
  }
};

// Get available sort options
export const getSortOptions = () => [
  { value: "priority-desc", label: "Priority (High to Low)" },
  { value: "priority-desc-text-asc", label: "Priority + Alphabetical" },
  { value: "incomplete-priority-desc", label: "Incomplete + Priority" },
  { value: "text-asc", label: "Alphabetical (A-Z)" },
  { value: "text-desc", label: "Alphabetical (Z-A)" },
];
