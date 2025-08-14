import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { todoService } from "../services/todoService";

// Hook for server-driven paginated todos
export const useTodos = ({
  initialPage = 1,
  size = 10,
  sort,
  completed,
  priority,
} = {}) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(0);
  const [nextLink, setNextLink] = useState(null);
  const [prevLink, setPrevLink] = useState(null);

  // Simple in-memory cache keyed by page under current query
  const cacheRef = useRef(new Map());
  const queryKey = useMemo(
    () => JSON.stringify({ size, sort, completed, priority }),
    [size, sort, completed, priority],
  );

  const setPageData = ({ todos, total, page, next_link, prev_link }) => {
    setTodos(Array.isArray(todos) ? todos : []);
    setTotal(Number(total) || 0);
    setNextLink(next_link || null);
    setPrevLink(prev_link || null);
    setPage(Number(page) || 1);
  };

  const fetchPage = useCallback(
    async (targetPage) => {
      try {
        setLoading(true);
        setError(null);
        const cacheKey = `${queryKey}|p=${targetPage}`;
        if (cacheRef.current.has(cacheKey)) {
          setPageData(cacheRef.current.get(cacheKey));
        } else {
          const data = await todoService.getTodos({
            page: targetPage,
            size,
            sort,
            completed,
            priority,
          });
          cacheRef.current.set(cacheKey, data);
          setPageData(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [queryKey, size, sort, completed, priority],
  );

  // Prefetch next page using next_link when available
  const prefetchNext = useCallback(async () => {
    if (!nextLink) return;
    try {
      const data = await todoService.getTodosByLink(nextLink);
      const parsed = new URL(nextLink, window.location.origin);
      const nextPage = Number(parsed.searchParams.get("page")) || page + 1;
      const cacheKey = `${queryKey}|p=${nextPage}`;
      if (!cacheRef.current.has(cacheKey)) {
        cacheRef.current.set(cacheKey, data);
      }
    } catch (_e) {
      // ignore prefetch errors
    }
  }, [nextLink, page, queryKey]);

  // Prefetch previous page using prev_link when available
  const prefetchPrev = useCallback(async () => {
    if (!prevLink) return;
    try {
      const data = await todoService.getTodosByLink(prevLink);
      const parsed = new URL(prevLink, window.location.origin);
      const prevPage =
        Number(parsed.searchParams.get("page")) || Math.max(1, page - 1);
      const cacheKey = `${queryKey}|p=${prevPage}`;
      if (!cacheRef.current.has(cacheKey)) {
        cacheRef.current.set(cacheKey, data);
      }
    } catch (_e) {
      // ignore prefetch errors
    }
  }, [prevLink, page, queryKey]);

  // Initial and query-change load
  useEffect(() => {
    cacheRef.current = new Map();
    fetchPage(initialPage);
  }, [fetchPage, initialPage]);

  // After each load, prefetch neighbors
  useEffect(() => {
    prefetchNext();
    prefetchPrev();
  }, [nextLink, prevLink, prefetchNext, prefetchPrev]);

  const goToNext = useCallback(() => {
    if (!nextLink) return;
    // Derive next page from link for safety
    const parsed = new URL(nextLink, window.location.origin);
    const nextPage = Number(parsed.searchParams.get("page")) || page + 1;
    fetchPage(nextPage);
  }, [nextLink, page, fetchPage]);

  const goToPrev = useCallback(() => {
    if (!prevLink) return;
    const parsed = new URL(prevLink, window.location.origin);
    const prevPage =
      Number(parsed.searchParams.get("page")) || Math.max(1, page - 1);
    fetchPage(prevPage);
  }, [prevLink, page, fetchPage]);

  const refetch = useCallback(() => fetchPage(page), [fetchPage, page]);

  return {
    todos,
    total,
    page,
    size,
    sort,
    completed,
    priority,
    loading,
    error,
    goToNext,
    goToPrev,
    fetchPage,
    refetch,
    setPage,
  };
};
