import { useState, useEffect } from "react";

/**
 * Custom hook for managing localStorage with React state
 * @param {string} key - The localStorage key
 * @param {*} initialValue - The initial value if nothing is in localStorage
 * @returns {[any, function]} - [storedValue, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  // Initialize state with localStorage value or initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Function to update both state and localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};
