import { normalizePermissionIds, samePermissionIds } from "./role-data.ts";

export type PermissionEditorSession = {
  sessionKey: string;
  initialized: boolean;
  baselineIds: string[];
  selectedIds: string[];
  latestRemoteIds: string[];
  remoteSource: string;
  touched: boolean;
  conflict: boolean;
};

const sourceOf = (ids: readonly string[]) => normalizePermissionIds(ids).join(",");

export function newPermissionEditorSession(sessionKey: string, remoteIds?: readonly string[]): PermissionEditorSession {
  const ids = normalizePermissionIds(remoteIds ?? []);
  return { sessionKey, initialized: remoteIds !== undefined, baselineIds: ids, selectedIds: ids, latestRemoteIds: ids, remoteSource: sourceOf(ids), touched: false, conflict: false };
}

export function reconcilePermissionEditorSession(state: PermissionEditorSession, sessionKey: string, remoteIds?: readonly string[]) {
  if (state.sessionKey !== sessionKey) return newPermissionEditorSession(sessionKey, remoteIds);
  if (remoteIds === undefined) return state;
  const nextRemote = normalizePermissionIds(remoteIds);
  const nextSource = sourceOf(nextRemote);
  if (!state.initialized) return newPermissionEditorSession(sessionKey, nextRemote);
  if (state.remoteSource === nextSource) return state;
  const locallyDirty = state.touched && !samePermissionIds(state.selectedIds, state.baselineIds);
  if (!locallyDirty) return newPermissionEditorSession(sessionKey, nextRemote);
  return { ...state, latestRemoteIds: nextRemote, remoteSource: nextSource, conflict: true };
}

export function editPermissionSelection(state: PermissionEditorSession, ids: readonly string[]) {
  return { ...state, selectedIds: normalizePermissionIds(ids), touched: true };
}

export function reloadPermissionSelection(state: PermissionEditorSession) {
  return newPermissionEditorSession(state.sessionKey, state.latestRemoteIds);
}

export function commitPermissionSelection(state: PermissionEditorSession) {
  return newPermissionEditorSession(state.sessionKey, state.selectedIds);
}

export function permissionSelectionDirty(state: PermissionEditorSession) {
  return state.touched && !samePermissionIds(state.selectedIds, state.baselineIds);
}
