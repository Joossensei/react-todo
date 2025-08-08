import { useState, useEffect } from "react";
import { priorityService } from "../services/priorityService";
import { sortPriorities } from "../utils/priorityUtils";

export const usePriorities = () => {
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPriorities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await priorityService.getPriorities();
      setPriorities(sortPriorities(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshPriorities = async () => {
    try {
      setLoading(true);
      const data = await priorityService.refreshPriorities();
      setPriorities(sortPriorities(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriorities();
  }, []);

  return {
    priorities,
    loading,
    error,
    refreshPriorities,
    refetch: fetchPriorities,
  };
};
