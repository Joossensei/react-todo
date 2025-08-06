import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TodoList from "./index";

describe("TodoList Component", () => {
  // Define mock todos
  const standardTodos = [
    {
      id: 1,
      text: "Learn React",
      completed: false,
      priority: "urgent",
    },
    {
      id: 2,
      text: "Build Todo App",
      completed: true,
      priority: "high",
    },
    {
      id: 3,
      text: "Write Tests",
      completed: false,
      priority: "medium",
    },
    {
      id: 4,
      text: "Learn React Testing",
      completed: false,
      priority: "low",
    },
  ];

  beforeEach(() => {
    window.localStorage.clear();
  });

  test("renders todo list correctly", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    expect(screen.getByText("Todo List")).toBeInTheDocument();
  });

  test("renders todos correctly", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    expect(screen.getByText("Learn React")).toBeInTheDocument();
  });

  test("renders add todo form correctly", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    expect(screen.getByText("Add Todo")).toBeInTheDocument();
  });

  test("renders status filter form correctly", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    expect(screen.getByText("All Status")).toBeInTheDocument();
  });

  test("renders priority filter form correctly", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    expect(screen.getByText("All Priorities")).toBeInTheDocument();
  });

  test("renders search form correctly", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    const searchInputs = screen.getAllByPlaceholderText("Search todos...");
    const searchDesktop = searchInputs.find((input) =>
      input.closest(".desktop-header"),
    );
    expect(searchDesktop).toBeInTheDocument();
  });

  //--------------------------- Add todo form tests --------------------------- //
  test("renders add todo form correctly", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    const addTodoButton = screen.getByText("Add Todo");
    fireEvent.click(addTodoButton);
    expect(screen.getByText("Add +")).toBeInTheDocument();
  });

  test("Add todo form hides when add todo button is clicked again", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    const addTodoButton = screen.getByText("Add Todo");
    fireEvent.click(addTodoButton);
    expect(screen.getByText("Add +")).toBeInTheDocument();
    fireEvent.click(addTodoButton);
    expect(screen.queryByText("Add +")).not.toBeInTheDocument();
  });

  test("Adding a todo adds it to the list with the correct priority (using button)", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    const addTodoButton = screen.getByText("Add Todo");
    fireEvent.click(addTodoButton);
    const input = screen.getByPlaceholderText("Add a todo");
    fireEvent.change(input, { target: { value: "Very new value" } });
    const prioritySelect = screen.getByText("Select Priority").parentElement;
    fireEvent.change(prioritySelect, { target: { value: "high" } });
    const saveButton = screen.getByText("Add +");
    fireEvent.click(saveButton);
    expect(screen.getByText("Very new value")).toBeInTheDocument();
    const newItem = screen.getByText("Very new value").closest("li");
    const priority = newItem.querySelector(".todo-item-priority");
    expect(priority).toHaveTextContent("High");
  });

  test("Adding a todo adds it to the list (using enter key)", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    const addTodoButton = screen.getByText("Add Todo");
    fireEvent.click(addTodoButton);
    const input = screen.getByPlaceholderText("Add a todo");
    fireEvent.change(input, { target: { value: "Very new value" } });
    const prioritySelect = screen.getByText("Select Priority").parentElement;
    fireEvent.change(prioritySelect, { target: { value: "high" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(screen.getByText("Very new value")).toBeInTheDocument();
    const newItem = screen.getByText("Very new value").closest("li");
    const priority = newItem.querySelector(".todo-item-priority");
    expect(priority).toHaveTextContent("High");
  });

  test("Adding a todo with an empty text value shows an error message (using button)", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    const addTodoButton = screen.getByText("Add Todo");
    fireEvent.click(addTodoButton);
    const input = screen.getByPlaceholderText("Add a todo");
    fireEvent.change(input, { target: { value: "" } });
    const saveButton = screen.getByText("Add +");
    fireEvent.click(saveButton);
    expect(
      screen.getByText("Todo and priority are required"),
    ).toBeInTheDocument();
  });

  test("Adding a todo with an empty text value shows an error message (using enter key)", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    const addTodoButton = screen.getByText("Add Todo");
    fireEvent.click(addTodoButton);
    const input = screen.getByPlaceholderText("Add a todo");
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(
      screen.getByText("Todo and priority are required"),
    ).toBeInTheDocument();
  });

  test("Adding a todo with an empty priority value shows an error message (using button)", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    const addTodoButton = screen.getByText("Add Todo");
    fireEvent.click(addTodoButton);
    const input = screen.getByPlaceholderText("Add a todo");
    fireEvent.change(input, { target: { value: "Very new value" } });
    const saveButton = screen.getByText("Add +");
    fireEvent.click(saveButton);
    expect(
      screen.getByText("Todo and priority are required"),
    ).toBeInTheDocument();
  });

  test("Adding a todo with an empty priority value shows an error message (using enter key)", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    const addTodoButton = screen.getByText("Add Todo");
    fireEvent.click(addTodoButton);
    const input = screen.getByPlaceholderText("Add a todo");
    fireEvent.change(input, { target: { value: "Very new value" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(
      screen.getByText("Todo and priority are required"),
    ).toBeInTheDocument();
  });

  //--------------------------- Filter form tests --------------------------- //
  test("Filter form shows all todos when all is selected", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    const comboBoxes = screen.getAllByRole("combobox");
    const statusFilter = comboBoxes.find((comboBox) =>
      comboBox.closest("#filterTodos"),
    );
    fireEvent.change(statusFilter, { target: { value: "all" } });
    expect(screen.getByText("Learn React")).toBeInTheDocument();
    expect(screen.getByText("Build Todo App")).toBeInTheDocument();
    expect(screen.getByText("Write Tests")).toBeInTheDocument();
  });

  test("Filter form shows completed todos when completed is selected", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    const comboBoxes = screen.getAllByRole("combobox");
    const statusFilter = comboBoxes.find((comboBox) =>
      comboBox.closest("#filterTodos"),
    );
    fireEvent.change(statusFilter, { target: { value: "completed" } });
    expect(screen.getByText("Build Todo App")).toBeInTheDocument();
    expect(screen.queryByText("Learn React")).not.toBeInTheDocument();
    expect(screen.queryByText("Write Tests")).not.toBeInTheDocument();
  });

  test("Filter form shows incomplete todos when incomplete is selected", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    const comboBoxes = screen.getAllByRole("combobox");
    const statusFilter = comboBoxes.find((comboBox) =>
      comboBox.closest("#filterTodos"),
    );
    fireEvent.change(statusFilter, { target: { value: "incomplete" } });
    expect(screen.queryByText("Build Todo App")).not.toBeInTheDocument();
    expect(screen.getByText("Learn React")).toBeInTheDocument();
    expect(screen.getByText("Write Tests")).toBeInTheDocument();
  });

  test("Filter form shows no todos when no todos are found", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    // Reopen the Build Todo App todo so we can filter to show completed todos
    const buildTodoApp = screen.getByText("Build Todo App");
    const checkbox = buildTodoApp.parentElement.querySelector(
      "input[class='todo-checkbox']",
    );
    fireEvent.click(checkbox);
    const comboBoxes = screen.getAllByRole("combobox");
    const statusFilter = comboBoxes.find((comboBox) =>
      comboBox.closest("#filterTodos"),
    );
    fireEvent.change(statusFilter, { target: { value: "completed" } });
    expect(screen.queryByText("Learn React")).not.toBeInTheDocument();
    expect(screen.queryByText("Build Todo App")).not.toBeInTheDocument();
    expect(screen.queryByText("Write Tests")).not.toBeInTheDocument();
    expect(screen.getByText("No todos to show")).toBeInTheDocument();
  });

  test("Filter shows correct todos after filtering multiple times", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    // We start with all todos showing so check if this is the case
    expect(screen.getByText("Learn React")).toBeInTheDocument();
    expect(screen.getByText("Build Todo App")).toBeInTheDocument();
    expect(screen.getByText("Write Tests")).toBeInTheDocument();
    const comboBoxes = screen.getAllByRole("combobox");
    const statusFilter = comboBoxes.find((comboBox) =>
      comboBox.closest("#filterTodos"),
    );

    // Check if the build todo app is still in the document
    const buildTodoApp = screen.getByText("Build Todo App");
    const checkbox = buildTodoApp.parentElement.querySelector(
      "input[class='todo-checkbox']",
    );
    expect(checkbox).toBeChecked();

    // Filter to show only completed todos
    fireEvent.change(statusFilter, { target: { value: "completed" } });

    expect(screen.queryByText("Learn React")).not.toBeInTheDocument();
    expect(screen.queryByText("Build Todo App")).toBeInTheDocument();
    expect(screen.queryByText("Write Tests")).not.toBeInTheDocument();

    // Filter to show only incomplete todos
    fireEvent.change(statusFilter, { target: { value: "incomplete" } });
    expect(screen.queryByText("Build Todo App")).not.toBeInTheDocument();
    expect(screen.getByText("Learn React")).toBeInTheDocument();
    expect(screen.getByText("Write Tests")).toBeInTheDocument();

    // Filter to show all todos
    fireEvent.change(statusFilter, { target: { value: "all" } });
    expect(screen.getByText("Learn React")).toBeInTheDocument();
    expect(screen.getByText("Build Todo App")).toBeInTheDocument();
    expect(screen.getByText("Write Tests")).toBeInTheDocument();
  });

  //--------------------------- Search form tests --------------------------- //
  test("Search form shows correct todos when searching", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    const searchInputs = screen.getAllByPlaceholderText("Search todos...");
    const searchDesktop = searchInputs.find((input) =>
      input.closest(".desktop-header"),
    );
    fireEvent.change(searchDesktop, { target: { value: "Lea" } });
    expect(screen.getByText("Learn React")).toBeInTheDocument();
    expect(screen.queryByText("Build Todo App")).not.toBeInTheDocument();
    expect(screen.queryByText("Write Tests")).not.toBeInTheDocument();
  });

  test("Search form shows no todos when no todos are found", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    const searchInputs = screen.getAllByPlaceholderText("Search todos...");
    const searchDesktop = searchInputs.find((input) =>
      input.closest(".desktop-header"),
    );
    fireEvent.change(searchDesktop, { target: { value: "nonsense" } });
    expect(screen.queryByText("Learn React")).not.toBeInTheDocument();
    expect(screen.queryByText("Build Todo App")).not.toBeInTheDocument();
    expect(screen.queryByText("Write Tests")).not.toBeInTheDocument();
    expect(screen.getByText("No todos to show")).toBeInTheDocument();
  });

  //--------------------------- Todo delete item tests --------------------------- //
  test("Todo item deletes when delete button is clicked", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    const todoItem = screen.getByText("Learn React");
    const deleteButton = todoItem.parentElement.querySelector(
      "button[class='delete-btn']",
    );
    fireEvent.click(deleteButton);
    expect(screen.queryByText("Learn React")).not.toBeInTheDocument();
  });

  //--------------------------- Todo toggle item tests --------------------------- //
  test("Todo item toggles when checkbox is clicked", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    const todoItem = screen.getByText("Learn React").closest("li");
    const checkbox = todoItem.parentElement.querySelector(
      "input[class='todo-checkbox']",
    );
    fireEvent.click(checkbox);
    expect(todoItem).toHaveClass("completed");
  });

  test("Todo item toggles on and off when checkbox is clicked", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    const todoItem = screen.getByText("Learn React").closest("li");
    const checkbox = todoItem.parentElement.querySelector(
      "input[class='todo-checkbox']",
    );
    fireEvent.click(checkbox);
    expect(todoItem).toHaveClass("completed");
    fireEvent.click(checkbox);
    expect(todoItem).not.toHaveClass("completed");
  });

  //--------------------------- Todo edit item tests --------------------------- //
  test("Todo item shows edit form when edit button is clicked", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    const todoItem = screen.getByText("Learn React");
    const editButton = todoItem.parentElement.querySelector(
      "button[class='edit-btn']",
    );
    fireEvent.click(editButton);
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  test("Todo item can be edited using the edit form (using button)", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    const todoItem = screen.getByText("Learn React");
    const editButton = todoItem.parentElement.querySelector(
      "button[class='edit-btn']",
    );
    fireEvent.click(editButton);
    const editFields = screen.getAllByRole("textbox");
    const editField = editFields.find((input) => input.value === "Learn React");
    fireEvent.change(editField, { target: { value: "Learn React edited" } });
    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);
    expect(screen.getByText("Learn React edited")).toBeInTheDocument();
  });

  test("Todo item can be edited using the edit form (using enter key)", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    const todoItem = screen.getByText("Learn React");
    const editButton = todoItem.parentElement.querySelector(
      "button[class='edit-btn']",
    );
    fireEvent.click(editButton);
    const editFields = screen.getAllByRole("textbox");
    const editField = editFields.find((input) => input.value === "Learn React");
    fireEvent.change(editField, { target: { value: "Learn React edited" } });
    fireEvent.keyDown(editField, { key: "Enter", code: "Enter" });
    expect(screen.getByText("Learn React edited")).toBeInTheDocument();
  });

  test("Check if edit form dissappears when edit button is clicked again", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    const todoItem = screen.getByText("Learn React");
    const editButton = todoItem.parentElement.querySelector(
      "button[class='edit-btn']",
    );
    fireEvent.click(editButton);
    expect(screen.getByText("Save")).toBeInTheDocument();
    fireEvent.click(editButton);
    expect(screen.queryByText("Save")).not.toBeInTheDocument();
  });

  test("Check if edit form dissappears when todo is edited", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    const todoItem = screen.getByText("Learn React");
    const editButton = todoItem.parentElement.querySelector(
      "button[class='edit-btn']",
    );
    fireEvent.click(editButton);
    const editFields = screen.getAllByRole("textbox");
    const editField = editFields.find((input) => input.value === "Learn React");
    fireEvent.change(editField, { target: { value: "Learn React edited" } });
    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);
    expect(screen.getByText("Learn React edited")).toBeInTheDocument();
    expect(screen.queryByText("Save")).not.toBeInTheDocument();
  });

  test("Check if edit form dissappears when todo is edited using enter key", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    const todoItem = screen.getByText("Learn React");
    const editButton = todoItem.parentElement.querySelector(
      "button[class='edit-btn']",
    );
    fireEvent.click(editButton);
    const editFields = screen.getAllByRole("textbox");
    const editField = editFields.find((input) => input.value === "Learn React");
    fireEvent.change(editField, { target: { value: "Learn React edited" } });
    fireEvent.keyDown(editField, { key: "Enter", code: "Enter" });
    expect(screen.getByText("Learn React edited")).toBeInTheDocument();
    expect(screen.queryByText("Save")).not.toBeInTheDocument();
  });

  test("Check if edit form shows error message when todo is edited with an empty value", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    const todoItem = screen.getByText("Learn React");
    const editButton = todoItem.parentElement.querySelector(
      "button[class='edit-btn']",
    );
    fireEvent.click(editButton);
    const editFields = screen.getAllByRole("textbox");
    const editField = editFields.find((input) => input.value === "Learn React");
    fireEvent.change(editField, { target: { value: "" } });
    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);
    expect(screen.getByText("Todo is required")).toBeInTheDocument();
  });

  test("Check if edit form shows error message when todo is edited with an empty value using enter key", () => {
    render(<TodoList title="Todo List" standardTodos={standardTodos} />);
    const todoItem = screen.getByText("Learn React");
    const editButton = todoItem.parentElement.querySelector(
      "button[class='edit-btn']",
    );
    fireEvent.click(editButton);
    const editFields = screen.getAllByRole("textbox");
    const editField = editFields.find((input) => input.value === "Learn React");
    fireEvent.change(editField, { target: { value: "" } });
    fireEvent.keyDown(editField, { key: "Enter", code: "Enter" });
    expect(screen.getByText("Todo is required")).toBeInTheDocument();
  });
});
