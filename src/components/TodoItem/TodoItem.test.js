import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TodoItem from "./index";
import {
  FaChevronDown,
  FaMinus,
  FaChevronUp,
  FaExclamationTriangle,
} from "react-icons/fa";

// Mock data for testing
const mockTodo = {
  id: 1,
  text: "Learn React Testing",
  completed: false,
};

const mockCompletedTodo = {
  id: 2,
  text: "Build Todo App",
  completed: true,
};

// Mock prioritys
const mockPriority = {
  LOW: {
    value: "low",
    label: "Low",
    color: "#6b7280",
    icon: <FaChevronDown />,
    bgColor: "#f3f4f6",
  },
  MEDIUM: {
    value: "medium",
    label: "Medium",
    color: "#f59e0b",
    icon: <FaMinus />,
    bgColor: "#fef3c7",
  },
  HIGH: {
    value: "high",
    label: "High",
    color: "#ef4444",
    icon: <FaChevronUp />,
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

const mock = jest.genMockFromModule("../../utils/priorityUtils");
// Is still undefined no clue why
mock.getPriorityByValue = jest.fn((value) => {
  return mockPriority[value];
});

import { getPriorityByValue } from "../../utils/priorityUtils";

describe("TodoItem Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders todo text correctly", () => {
    render(<TodoItem todo={mockTodo} />);
    expect(screen.getByText("Learn React Testing")).toBeInTheDocument();
  });

  test("renders completed todo with correct styling", () => {
    render(<TodoItem todo={mockCompletedTodo} />);
    const todoItem = screen.getByText("Build Todo App").closest("li");
    expect(todoItem).toHaveClass("completed");
  });

  test("renders non-completed todo without completed class", () => {
    render(<TodoItem todo={mockTodo} />);
    const todoItem = screen.getByText("Learn React Testing").closest("li");
    expect(todoItem).not.toHaveClass("completed");
  });

  test("checkbox is checked for completed todo", () => {
    render(<TodoItem todo={mockCompletedTodo} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  test("checkbox is unchecked for non-completed todo", () => {
    render(<TodoItem todo={mockTodo} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  test("renders edit and delete buttons", () => {
    render(<TodoItem todo={mockTodo} />);
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
    render(<TodoItem todo={mockTodo} />);

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
