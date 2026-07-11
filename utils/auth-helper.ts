export const ACCESS_TOKEN_KEY = process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY;
export const REFRESH_TOKEN_KEY = process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY;

export const authHelper = {
  // Access Token
  setAccessToken(token: string): void {
    localStorage.setItem(String(ACCESS_TOKEN_KEY), token);
  },

  getAccessToken(): string | null {
    if (typeof window === "undefined") {
      return null;
    }

    return localStorage.getItem(String(ACCESS_TOKEN_KEY));
  },

  removeAccessToken(): void {
    localStorage.removeItem(String(ACCESS_TOKEN_KEY));
  },

  // Refresh Token
  setRefreshToken(token: string): void {
    localStorage.setItem(String(REFRESH_TOKEN_KEY), token);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(String(REFRESH_TOKEN_KEY));
  },

  removeRefreshToken(): void {
    localStorage.removeItem(String(REFRESH_TOKEN_KEY));
  },

  // Save both tokens
  setTokens(accessToken: string, refreshToken: string): void {
    authHelper.setAccessToken(accessToken);
    authHelper.setRefreshToken(refreshToken);
  },

  // Get both tokens
  getTokens() {
    return {
      accessToken: authHelper.getAccessToken(),
      refreshToken: authHelper.getRefreshToken(),
    };
  },

  // Clear all auth tokens
  clearTokens(): void {
    authHelper.removeAccessToken();
    authHelper.removeRefreshToken();
  },

  // Check login status
  isAuthenticated: () => {
    return !!authHelper.getAccessToken();
  },
};
