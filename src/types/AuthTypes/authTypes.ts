export interface UserHasRoles {
  id: string;
  createdAt: string;
  updatedAt: string;
  RoleId: string;
  UserId: string;
}

export interface Role {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  UserHasRoles?: UserHasRoles;
}

export interface UserMeResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  fullname: string;
  email: string;
  gender: string;
  birthDate: string;
  profilePicture: string | null;
  roles: Role[];
  accessToken?: string;
}

export interface AuthResponse {
  uid: string;
  fullname: string;
  email: string;
  RoleIds: string[]
  accessToken?: string;
  expiresAt?: string;
  expiresIn?: number
}

export interface LoginPayload {
  email: string;
  RoleId?: string
  password: string;
}

export interface LoginResidentPayload {
  nik: string,
  password: string
}

export interface RegisterPayload {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: "m" | "f";
  profession: string;
  birthDate: string;
  MarriageStatusId: string;
  RukunWargaId: string;
  RukunTetanggaId: string;
  EducationId: string;
  SalaryRangeId: string;
  nik: string;
  phoneNumber: number;
}