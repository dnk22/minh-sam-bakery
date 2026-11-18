export function cmsCookiePolicy(isProduction: boolean) {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    priority: "high" as const,
  };
}
