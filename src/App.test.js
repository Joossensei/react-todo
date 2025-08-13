import { screen } from "@testing-library/react";
import App from "./App";
import { renderWithProviders } from "./test-utils/renderWithProviders";

test("Renders the app", () => {
  const stores = {
    todoStore: {
      fetchPage: jest.fn(),
      loading: false,
      error: null,
      page: 1,
      totalPages: 1,
      visibleTodos: [],
      search: "",
      sortBy: "incomplete-priority-desc",
      completedFilter: undefined,
      priorityFilter: "",
      setSearch: jest.fn(),
      setSort: jest.fn(),
      setCompletedFilter: jest.fn(),
      setPriorityFilter: jest.fn(),
      goToPrev: jest.fn(),
      goToNext: jest.fn(),
    },
    priorityStore: {
      priorities: [],
      loading: false,
      error: null,
    },
  };
  renderWithProviders(<App />, { stores, route: "/" });
  // Expect the landing route renders TodoList title
  expect(screen.getByText("Personal Tasks")).toBeInTheDocument();
});
