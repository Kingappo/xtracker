export interface MonthGroup<T> {
  key: string;
  label: string;
  items: T[];
  total: number;
}

// Groups entries into per-month buckets. Assumes the input array is already
// sorted most-recent-first (as the API returns it), so the resulting groups
// come out in the same most-recent-month-first order automatically.
export const groupByMonth = <T extends { date: string; amount: number }>(
  items: T[],
): MonthGroup<T>[] => {
  const map = new Map<string, MonthGroup<T>>();

  items.forEach((item) => {
    const d = new Date(item.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;

    if (!map.has(key)) {
      map.set(key, {
        key,
        label: d.toLocaleDateString("default", {
          month: "long",
          year: "numeric",
        }),
        items: [],
        total: 0,
      });
    }

    const group = map.get(key)!;
    group.items.push(item);
    group.total += item.amount;
  });

  return Array.from(map.values());
};
