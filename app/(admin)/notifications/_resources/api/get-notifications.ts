import { apiClient } from "@/lib/api/api-client";
import { Pagination } from "@/types";

export type Notification = {
  id: string;
  paymentId: string;
  channel: string;
  recipient: string;
  message: string;
  status: string;
  type: string;
  sentAt: string;
  createdAt: string;
};

export type GetNotificationsResponse = {
  success: true;
  data: Notification[];
  pagination: Pagination;
};

type GetNotificationRequestParams = {
  page?: number;
  limit?: number;
};

async function getNotifications({
  page = 1,
  limit = 10,
}: GetNotificationRequestParams = {}): Promise<GetNotificationsResponse> {
  const response = await apiClient.get({
    url: `/notifications?page=${page}&limit=${limit}`,
  });
  return response.data as GetNotificationsResponse;
}

export { getNotifications };
