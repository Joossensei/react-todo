import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TodoItem from "./index";

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

describe("TodoItem Component", () => {
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

  test("checkbox is read-only (static component)", () => {
    render(<TodoItem todo={mockTodo} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("readonly");
  });

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

  test("handles empty todo text gracefully", () => {
    const emptyTodo = { id: 3, text: "", completed: false };
    render(<TodoItem todo={emptyTodo} />);
    const todoItem = screen.getByRole("listitem");
    expect(todoItem).toBeInTheDocument();
  });
});
