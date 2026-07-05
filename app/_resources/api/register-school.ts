import { apiClient } from "@/lib/api/api-client";

export type School = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
};

export type ResponseData = {
  token: string;
  school: School;
};

export type Error = {
  origin: string;
  code: string;
  format?: string;
  pattern?: string;
  minimum?: number;
  inclusive?: boolean;
  path: string[];
  message: string;
};

export type ResponseError = {
  errors: Error[];
};

export type SchoolRegistrationResponse = {
  success: boolean;
  data?: ResponseData;
  errors?: ResponseError;
};

type RegistrationDetails = {
  name: string;
  email: string;
  phone?: string;
  password?: string;
};

async function RegisterSchool({
  name,
  email,
  phone,
  password,
}: RegistrationDetails): Promise<SchoolRegistrationResponse> {
  const response = await apiClient.post({
    url: "/schools",
    payload: { name, email, phone, password },
  });
  return response.data as SchoolRegistrationResponse;
}

export { RegisterSchool };
