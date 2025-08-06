import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TodoItem from "./index";

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
  const mockPriorities = {
    low: {
      value: "low",
      label: "Low",
      color: "#6b7280",
      icon: "↓",
      bgColor: "#f3f4f6",
    },
    medium: {
      value: "medium",
      label: "Medium",
      color: "#f59e0b",
      icon: "−",
      bgColor: "#fef3c7",
    },
    high: {
      value: "high",
      label: "High",
      color: "#ef4444",
      icon: "↑",
      bgColor: "#fee2e2",
    },
    urgent: {
      value: "urgent",
      label: "Urgent",
      color: "#dc2626",
      icon: "⚠",
      bgColor: "#fecaca",
    },
  };
  return mockPriorities[value] || { value: value, label: value };
});

import { getPriorityByValue } from "../../utils/priorityUtils";

describe("TodoItem Component", () => {
  const mockProps = {
    toggleTodo: jest.fn(),
    deleteTodo: jest.fn(),
    editTodo: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders todo text correctly", () => {
    render(<TodoItem todo={mockTodo} {...mockProps} />);
    expect(screen.getByText("Learn React Testing")).toBeInTheDocument();
  });

  test("renders completed todo with correct styling", () => {
    render(<TodoItem todo={mockCompletedTodo} {...mockProps} />);
    const todoItem = screen.getByText("Build Todo App").closest("li");
    expect(todoItem).toHaveClass("completed");
  });

  test("renders non-completed todo without completed class", () => {
    render(<TodoItem todo={mockTodo} {...mockProps} />);
    const todoItem = screen.getByText("Learn React Testing").closest("li");
    expect(todoItem).not.toHaveClass("completed");
  });

  test("checkbox is checked for completed todo", () => {
    render(<TodoItem todo={mockCompletedTodo} {...mockProps} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  test("checkbox is unchecked for non-completed todo", () => {
    render(<TodoItem todo={mockTodo} {...mockProps} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  test("renders edit and delete buttons", () => {
    render(<TodoItem todo={mockTodo} {...mockProps} />);
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  // This wont work as the edit and delete functions are inside the TodoList component

  // test("delete button deletes non-completed todo", () => {
  //   render(<TodoItem todo={mockTodo} />);
  //   const deleteButton = screen.getByText("Delete");
  //   fireEvent.click(deleteButton);
  //   expect(screen.queryByText("Learn React Testing")).not.toBeInTheDocument();
  // });

  // test("delete button works when todo is completed", () => {
  //   render(<TodoItem todo={mockCompletedTodo} />);
  //   const deleteButton = screen.getByText("Delete");
  //   fireEvent.click(deleteButton);
  //   expect(screen.queryByText("Build Todo App")).not.toBeInTheDocument();
  // });

  // test("edit button opens edit form", () => {
  //   render(<TodoItem todo={mockTodo} />);
  //   const editButton = screen.getByText("Edit");
  //   fireEvent.click(editButton);
  //   expect(screen.getByText("Save")).toBeInTheDocument();
  // });

  // test("edit form saves edited todo", () => {
  //   render(<TodoItem todo={mockTodo} />);
  //   const editButton = screen.getByText("Edit");
  //   fireEvent.click(editButton);
  //   const input = screen.getByRole("textbox");
  //   fireEvent.change(input, {
  //     target: { value: "Learn React Testing edited" },
  //   });
  //   const saveButton = screen.getByText("Save");
  //   fireEvent.click(saveButton);
  //   expect(
  //     screen.queryByText("Learn React Testing edited"),
  //   ).toBeInTheDocument();
  // });

  // test("edit form shows error message for empty input", () => {
  //   render(<TodoItem todo={mockTodo} />);
  //   const editButton = screen.getByText("Edit");
  //   fireEvent.click(editButton);
  //   const input = screen.getByRole("textbox");
  //   fireEvent.change(input, { target: { value: "" } });
  //   const saveButton = screen.getByText("Save");
  //   fireEvent.click(saveButton);
  //   expect(screen.getByText("Todo is required")).toBeInTheDocument();
  // });

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
