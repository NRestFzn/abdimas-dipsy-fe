
export interface Role {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
}

export interface UserMeResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  fullname: string;
  email: string;
  RoleId: string;
  gender: string;
  birthDate: string;
  profilePicture: string | null;
  role: Role;
  accessToken?: string;
}

export interface AuthResponse {
    uid: string;
    fullname: string;
    email: string;
    role?: string;
    RoleId?: string;
    accessToken?: string;
}

export interface LoginPayload {
    email: string;
    RoleId?: string
    password: string;
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