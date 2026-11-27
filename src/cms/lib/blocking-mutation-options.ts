/** Run explicit writes even when the browser reports offline, so the request
 * fails normally instead of pausing indefinitely behind a blocking dialog. */
export const blockingMutationOptions = {
  meta: { pageLoading: true },
  networkMode: "always",
} as const;
