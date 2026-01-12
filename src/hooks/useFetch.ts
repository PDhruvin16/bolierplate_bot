import { useState, useEffect, useCallback } from 'react';

export const useFetch = <T>(
  fetchFunction: (...args: any[]) => Promise<any>,
  dependencies: any[] = [],
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchData = useCallback(
    async (...args: any[]) => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFunction(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchFunction],
  );

  const refetch = useCallback(
    (...args: any[]) => {
      return fetchData(...args);
    },
    [fetchData],
  );

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    fetchData,
    refetch,
    reset,
  };
};

export const useFetchOnMount = (
  fetchFunction: (...args: any[]) => Promise<any>,
  dependencies: any[] = [],
) => {
  const fetchState = useFetch(fetchFunction, dependencies);

  useEffect(() => {
    fetchState.fetchData();
  }, dependencies);

  return fetchState;
};

export default useFetch;
