import { apiClient } from "@/lib/api/api-client";

export type School = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type ResponseData = {
  token: string;
  school: School;
};

// export type Error = {
//   origin: string;
//   code: string;
//   minimum: number;
//   inclusive: true;
//   path: string[];
//   message: string;
// };

// export type ResponseError = {
//   errors: Error[];
// };

export type ValidationError = {
  origin: string;
  code: string;
  format?: string;
  pattern?: string;
  minimum?: number;
  inclusive?: boolean;
  path: string[];
  message: string;
};

export type SchoolLoginResponse = {
  success: boolean;
  data?: ResponseData;
  errors?: ValidationError[];
  message?: string;
};

export type LoginDetails = {
  email: string;
  password: string;
};

async function login({
  email,
  password,
}: LoginDetails): Promise<SchoolLoginResponse> {
  const response = await apiClient.post({
    url: "/schools/login",
    payload: { email, password },
  });
  return response.data as SchoolLoginResponse;
}

export { login };
