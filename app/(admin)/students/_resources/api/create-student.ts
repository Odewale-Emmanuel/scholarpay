import { apiClient } from "@/lib/api/api-client";

export type StudentInfo = {
  id: string;
  schoolId: string;
  firstName: string;
  lastName: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  createdAt: string;
  updatedAt: string;
};

export type StudentRegistrationInfo = {
  firstName: string;
  lastName: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
};

async function CreateStudent({
  firstName,
  lastName,
  parentName,
  parentPhone,
  parentEmail,
}: StudentRegistrationInfo): Promise<StudentInfo[]> {
  const response = await apiClient.post({
    url: "/students",
    payload: { firstName, lastName, parentName, parentPhone, parentEmail },
  });
  return response.data as StudentInfo[];
}

export { CreateStudent };
