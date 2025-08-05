import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddTodo from "./index";

// Mock the priority utils
const mockGetPriorityByValue = jest.fn((value) => {
  const priorities = {
    low: { label: "Low" },
    medium: { label: "Medium" },
    high: { label: "High" },
    urgent: { label: "Urgent" },
  };
  return priorities[value] || { label: "Unknown" };
});

const mockGetPriorityOrder = jest.fn(() => ["low", "medium", "high", "urgent"]);

jest.mock("../../utils/priorityUtils", () => ({
  getPriorityByValue: mockGetPriorityByValue,
  getPriorityOrder: mockGetPriorityOrder,
}));

describe("AddTodo Component", () => {
  const mockProps = {
    onAddTodo: jest.fn(),
    isAddingTodo: false,
    setIsAddingTodo: jest.fn(),
    newTodo: { text: "", priority: "" },
    setNewTodo: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Add Todo button", () => {
    render(<AddTodo {...mockProps} />);
    expect(screen.getByText("Add Todo")).toBeInTheDocument();
  });

  test("shows form when isAddingTodo is true", () => {
    render(<AddTodo {...mockProps} isAddingTodo={true} />);
    expect(screen.getByPlaceholderText("Add a todo")).toBeInTheDocument();
    expect(screen.getByText("Add +")).toBeInTheDocument();
    expect(screen.getByText("Select Priority")).toBeInTheDocument();
  });

  test("hides form when isAddingTodo is false", () => {
    render(<AddTodo {...mockProps} isAddingTodo={false} />);
    expect(screen.queryByPlaceholderText("Add a todo")).not.toBeInTheDocument();
    expect(screen.queryByText("Add +")).not.toBeInTheDocument();
  });

  test("calls setIsAddingTodo when Add Todo button is clicked", () => {
    render(<AddTodo {...mockProps} />);
    const addButton = screen.getByText("Add Todo");
    fireEvent.click(addButton);
    expect(mockProps.setIsAddingTodo).toHaveBeenCalledWith(true);
  });

  test("calls onAddTodo when Add + button is clicked", () => {
    render(<AddTodo {...mockProps} isAddingTodo={true} />);
    const addButton = screen.getByText("Add +");
    fireEvent.click(addButton);
    expect(mockProps.onAddTodo).toHaveBeenCalled();
  });

  test("calls onAddTodo when Enter key is pressed", () => {
    render(<AddTodo {...mockProps} isAddingTodo={true} />);
    const input = screen.getByPlaceholderText("Add a todo");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(mockProps.onAddTodo).toHaveBeenCalled();
  });

  test("calls setNewTodo when input text changes", () => {
    render(<AddTodo {...mockProps} isAddingTodo={true} />);
    const input = screen.getByPlaceholderText("Add a todo");
    fireEvent.change(input, { target: { value: "New todo" } });
    expect(mockProps.setNewTodo).toHaveBeenCalledWith({
      text: "New todo",
      priority: "",
    });
  });

  test("calls setNewTodo when priority select changes", () => {
    render(<AddTodo {...mockProps} isAddingTodo={true} />);
    const select = screen.getByText("Select Priority");
    fireEvent.change(select, { target: { value: "high" } });
    expect(mockProps.setNewTodo).toHaveBeenCalledWith({
      text: "",
      priority: "high",
    });
  });

  test("shows error message when validation fails", () => {
    render(<AddTodo {...mockProps} isAddingTodo={true} />);
    const addButton = screen.getByText("Add +");
    fireEvent.click(addButton);
    expect(
      screen.getByText("Todo and priority are required"),
    ).toBeInTheDocument();
  });

  test("does not show error message when validation passes", () => {
    render(
      <AddTodo
        {...mockProps}
        isAddingTodo={true}
        newTodo={{ text: "Valid todo", priority: "high" }}
      />,
    );
    const addButton = screen.getByText("Add +");
    fireEvent.click(addButton);
    expect(
      screen.queryByText("Todo and priority are required"),
    ).not.toBeInTheDocument();
  });

  test("renders all priority options", () => {
    render(<AddTodo {...mockProps} isAddingTodo={true} />);
    expect(screen.getByText("Low")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
    expect(screen.getByText("Urgent")).toBeInTheDocument();
  });

  test("input value reflects newTodo.text", () => {
    render(
      <AddTodo
        {...mockProps}
        isAddingTodo={true}
        newTodo={{ text: "Test todo", priority: "" }}
      />,
    );
    const input = screen.getByPlaceholderText("Add a todo");
    expect(input.value).toBe("Test todo");
  });

  test("select value reflects newTodo.priority", () => {
    render(
      <AddTodo
        {...mockProps}
        isAddingTodo={true}
        newTodo={{ text: "", priority: "high" }}
      />,
    );
    const select = screen.getByText("Select Priority");
    expect(select.value).toBe("high");
  });

  test("calls onAddTodo when validation passes", () => {
    render(
      <AddTodo
        {...mockProps}
        isAddingTodo={true}
        newTodo={{ text: "Valid todo", priority: "high" }}
      />,
    );
    const addButton = screen.getByText("Add +");
    fireEvent.click(addButton);
    expect(mockProps.onAddTodo).toHaveBeenCalled();
  });

  test("does not call onAddTodo when validation fails", () => {
    render(<AddTodo {...mockProps} isAddingTodo={true} />);
    const addButton = screen.getByText("Add +");
    fireEvent.click(addButton);
    expect(mockProps.onAddTodo).not.toHaveBeenCalled();
  });
});
