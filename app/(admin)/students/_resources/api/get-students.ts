import { apiClient } from "@/lib/api/api-client";
import { StudentInfo } from "./create-student";
import { Pagination } from "@/types";

export type GetStudentsResponse = {
  success: true;
  data: StudentInfo[];
  pagination: Pagination;
};

type GetStudentsRequestParams = {
  page?: number;
  limit?: number;
};

async function getStudents({
  page = 1,
  limit = 10,
}: GetStudentsRequestParams = {}): Promise<GetStudentsResponse> {
  const response = await apiClient.get({
    url: `/students?page=${page}&limit=${limit}`,
  });
  return response.data as GetStudentsResponse;
}

export { getStudents };
