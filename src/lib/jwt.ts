import * as jose from "jose";

const getSecretKey = () => {
  const secret = process.env.SESSION_SECRET || "fallback_default_session_secret_at_least_32_chars_long";
  return new TextEncoder().encode(secret);
};

export interface SessionPayload {
  userId: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  name?: string | null;
}

export async function signJWT(payload: SessionPayload): Promise<string> {
  const secret = getSecretKey();
  return await new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyJWT(token: string): Promise<SessionPayload | null> {
  try {
    const secret = getSecretKey();
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}
