import { sortTodos } from "../sortingUtils";

describe("sortTodos", () => {
  test("sorts todos by priority", () => {
    const todos = [
      { id: 1, text: "Learn React", priority: "low" },
      { id: 2, text: "Build Todo App", priority: "high" },
    ];
    const sortedTodos = sortTodos(todos, [], "priority-desc");
    expect(sortedTodos).toEqual([
      { id: 2, text: "Build Todo App", priority: "high" },
      { id: 1, text: "Learn React", priority: "low" },
    ]);
  });
});
