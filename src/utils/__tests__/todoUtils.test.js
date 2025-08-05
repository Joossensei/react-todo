// src/utils/__tests__/todoUtils.test.js
import { formatTodoText, validateTodo, generateTodoId } from '../todoUtils';

describe('todoUtils', () => {
  test('formatTodoText removes whitespace', () => {
    expect(formatTodoText('  hello  ')).toBe('hello');
  });

  test('validateTodo returns false for empty string', () => {
    expect(validateTodo('')).toBe(false);
    expect(validateTodo('   ')).toBe(false);
  });

  test('generateTodoId creates unique IDs', () => {
    const todos = [{ id: 1 }, { id: 3 }, { id: 5 }];
    expect(generateTodoId(todos)).toBe(6);
  });
});