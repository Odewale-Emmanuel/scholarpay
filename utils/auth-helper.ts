const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const authHelper = {
  // Access Token
  setAccessToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  getAccessToken(): string | null {
    if (typeof window === "undefined") {
      return null;
    }

    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  removeAccessToken(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  // Refresh Token
  setRefreshToken(token: string): void {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  removeRefreshToken(): void {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
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
