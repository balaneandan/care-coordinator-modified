import { ReadonlyURLSearchParams } from "next/navigation";

/**
 * Adds an array of queries to the `searchParams` URL state and returns the updated version as a string.
 * @param searchParams a set of search parameters created by the `useSearchParams()` hook
 * @param queries an array of objects to add to the `searchParams`. Each object must have the `name` of the query and its `value`
 * @returns a string representation of the merged search parameters prepended with a `?`.
 * @example
 * const searchParams = useSearchParams();
 * // => `page=1&per_page=20`
 * const newParams = addQueries(searchParams, [{ name: "limit", value: "10" }]);
 * // => `?page=1&per_page=20&limit=10`
 */
export const addQueries = (
  searchParams: ReadonlyURLSearchParams | null,
  queries: { name: string; value: string }[]
) => {
  const params = searchParams
    ? new URLSearchParams(searchParams.toString())
    : new URLSearchParams();

  queries.forEach(({ name, value }) => {
    params.set(name, value);
  });

  return `?${params.toString()}`;
};

/**
 * Removes an array of queries from the `searchParams` URL state and returns the updated version as a string.
 * @param searchParams a set of search parameters created by the `useSearchParams()` hook
 * @param queryNames an array of query names to remove from the `searchParams`
 * @returns a string representation of the merged search parameters prepended with a `?`.
 * @example
 * const searchParams = useSearchParams();
 * // => `page=1&per_page=20&limit=10&skip=5`
 * const newParams = addQueries(searchParams, ["limit", "skip"]);
 * // => `?page=1&per_page=20`
 */
export const removeQueries = (
  searchParams: ReadonlyURLSearchParams | null,
  queryNames: string[]
) => {
  const params = searchParams
    ? new URLSearchParams(searchParams.toString())
    : new URLSearchParams();

  queryNames.forEach((query) => {
    params.delete(query);
  });

  return `?${params.toString()}`;
};
