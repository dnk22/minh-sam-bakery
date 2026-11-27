import { createStore } from "zustand/vanilla";

export function createPageLoadingStore() {
  const store = createStore<{ activeCount: number }>(() => ({ activeCount: 0 }));
  const tokens = new Set<symbol>();

  function begin() {
    const token = Symbol("page-loading");
    tokens.add(token);
    store.setState({ activeCount: tokens.size });
    return () => {
      if (tokens.delete(token)) store.setState({ activeCount: tokens.size });
    };
  }

  async function run<T>(operation: () => Promise<T>): Promise<T> {
    const release = begin();
    try { return await operation(); }
    finally { release(); }
  }

  return { store, begin, run };
}

export const pageLoading = createPageLoadingStore();
export const withPageLoading = pageLoading.run;
