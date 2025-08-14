import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderWithProviders } from "../../test-utils/renderWithProviders";
import TodoItem from "../TodoList";
import { BrowserRouter } from "react-router";

// Mock data for testing
const mockTodo = {
  id: 1,
  text: "Learn React Testing",
  completed: false,
  priority: "medium",
};

const mockCompletedTodo = {
  id: 2,
  text: "Build Todo App",
  completed: true,
  priority: "high",
};

const mock = jest.genMockFromModule("../../utils/priorityUtils");
mock.getPriorityByValue = jest.fn((value) => {
  const arr = [
    { key: "low", name: "Low", color: "#6b7280" },
    { key: "medium", name: "Medium", color: "#f59e0b" },
    { key: "high", name: "High", color: "#ef4444" },
    { key: "urgent", name: "Urgent", color: "#dc2626" },
  ];
  return arr.find((p) => p.key === value) || { key: value, name: value };
});

import { getPriorityByValue } from "../../utils/priorityUtils";

describe("TodoItem Component", () => {
  const mockProps = {
    toggleTodo: jest.fn(),
    deleteTodo: jest.fn(),
    editTodo: jest.fn(),
    priorities: [
      { key: "low", name: "Low", color: "#6b7280" },
      { key: "medium", name: "Medium", color: "#f59e0b" },
      { key: "high", name: "High", color: "#ef4444" },
      { key: "urgent", name: "Urgent", color: "#dc2626" },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders todo text correctly", () => {
    render(
      <BrowserRouter>
        <TodoItem todo={mockTodo} {...mockProps} />
      </BrowserRouter>,
    );
    expect(screen.getByText("Learn React Testing")).toBeInTheDocument();
  });

  test("renders completed todo with correct styling", () => {
    render(
      <BrowserRouter>
        <TodoItem todo={mockCompletedTodo} {...mockProps} />
      </BrowserRouter>,
    );
    const todoItem = screen.getByText("Build Todo App").closest("li");
    expect(todoItem).toHaveClass("completed");
  });

  test("renders non-completed todo without completed class", () => {
    render(
      <BrowserRouter>
        <TodoItem todo={mockTodo} {...mockProps} />
      </BrowserRouter>,
    );
    const todoItem = screen.getByText("Learn React Testing").closest("li");
    expect(todoItem).not.toHaveClass("completed");
  });

  test("checkbox is checked for completed todo", () => {
    render(
      <BrowserRouter>
        <TodoItem todo={mockCompletedTodo} {...mockProps} />
      </BrowserRouter>,
    );
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  test("checkbox is unchecked for non-completed todo", () => {
    render(
      <BrowserRouter>
        <TodoItem todo={mockTodo} {...mockProps} />
      </BrowserRouter>,
    );
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  test("renders edit and delete buttons", () => {
    render(
      <BrowserRouter>
        <TodoItem todo={mockTodo} {...mockProps} />
      </BrowserRouter>,
    );
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  test("renders with correct structure", () => {
    render(<TodoItem todo={mockTodo} {...mockProps} />);

    // Check that the component renders as a list item
    const listItem = screen.getByRole("listitem");
    expect(listItem).toBeInTheDocument();

    // Check that it contains the expected elements
    expect(listItem).toHaveClass("todo-item");
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByText("Learn React Testing")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });
});
