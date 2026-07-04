import { apiClient } from "@/lib/api/api-client";

export type SchoolLogoutResponse = {
  success: boolean;
  message: string;
};

async function logout(): Promise<SchoolLogoutResponse> {
  const response = await apiClient.post({
    url: "/schools/logout",
  });
  return response.data as SchoolLogoutResponse;
}

export { logout };
