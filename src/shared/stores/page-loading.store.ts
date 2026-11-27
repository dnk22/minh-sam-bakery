import { createStore } from "zustand/vanilla";
import { createLoadingOperations } from "./page-loading-operations.ts";

export function createPageLoadingStore() {
  const store = createStore<{ activeCount: number }>(() => ({ activeCount: 0 }));
  const operations = createLoadingOperations(activeCount => store.setState({ activeCount }));
  return { store, ...operations };
}

export const pageLoading = createPageLoadingStore();
export const withPageLoading = pageLoading.run;
