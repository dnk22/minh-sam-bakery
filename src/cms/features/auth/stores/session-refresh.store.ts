import { createStore } from "zustand/vanilla";

import type { RefreshSnapshot } from "../session/refresh-manager.ts";

export const sessionRefreshStore = createStore<RefreshSnapshot>(() => ({ status: "idle", attempt: 0 }));
