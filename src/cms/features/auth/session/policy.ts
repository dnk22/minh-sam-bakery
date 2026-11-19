export type AccessSession = {
  accessToken: string | null;
  accessExpiresAt: number | null;
};

export const ACCESS_REFRESH_WINDOW_MS = 10_000;

export function isAccessTokenFresh(session: AccessSession, now: number) {
  return Boolean(
    session.accessToken &&
    (!session.accessExpiresAt || session.accessExpiresAt > now + ACCESS_REFRESH_WINDOW_MS),
  );
}
