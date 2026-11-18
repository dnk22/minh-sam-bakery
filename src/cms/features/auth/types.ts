export type CmsAuthRole = {
  id: string;
  code: string;
  name: string;
};

export type CmsAuthUser = {
  id: string;
  email: string;
  fullName: string;
  status: "ACTIVE" | "LOCKED";
  role: CmsAuthRole;
  permissions: string[];
};

export type CmsProfileUser = Omit<CmsAuthUser, "permissions">;

export type CmsAuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
};

export type CmsLoginResult = CmsAuthTokens & {
  user: CmsAuthUser;
};

export type CmsAuthErrorKind =
  | "validation"
  | "unauthorized"
  | "forbidden"
  | "locked"
  | "rate_limited"
  | "timeout"
  | "unavailable"
  | "invalid_response";

export type CmsSessionResolution =
  | { status: "authenticated"; user: CmsAuthUser }
  | { status: "needs_refresh" }
  | { status: "unauthenticated" }
  | { status: "locked" }
  | { status: "forbidden" }
  | { status: "unavailable"; reason: "timeout" | "unavailable" | "invalid_response" };

export function toCmsProfileUser(user: CmsAuthUser): CmsProfileUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    status: user.status,
    role: user.role,
  };
}
