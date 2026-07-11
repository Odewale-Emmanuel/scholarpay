import { apiClient } from "@/lib/api/api-client";
import { StudentInfo } from "./create-student";

export type GetStudentByIdResponse = {
  success: true;
  data: StudentInfo;
};

async function getStudentById(id: string): Promise<GetStudentByIdResponse> {
  const response = await apiClient.get({
    url: `/students/${id}`,
  });
  return response.data as GetStudentByIdResponse;
}

export { getStudentById };
