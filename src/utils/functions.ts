export function toArray<TData>(data: unknown) {
  return Array.isArray(data)
    ? data.map((item) => item as TData)
    : [data as TData];
}