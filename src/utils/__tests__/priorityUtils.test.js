import { getPriorityByValue, getPriorityOrder } from "../priorityUtils";
import { PRIORITY } from "../../constants";

describe("getPriorityByValue", () => {
  test("returns the correct priority", () => {
    expect(getPriorityByValue("urgent")).toBe(PRIORITY.URGENT);
  });
});

describe("getPriorityOrder", () => {
  test("returns the correct priority order", () => {
    expect(getPriorityOrder()).toEqual(["low", "medium", "high", "urgent"]);
  });
});
