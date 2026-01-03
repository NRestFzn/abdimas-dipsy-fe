import type { Education, MarriageStatus, RukunTetangga, RukunWarga, SalaryRange } from "../masterDataTypes";
import type { UserMe } from "../profileTypes"

export interface UserDetail {
    id: string;
    nik: string;
    profession: string
    phoneNumber: string
    gender: string,
    birthDate: string
    UserId: string
    RukunWargaId: string
    RukunTetanggaId: string
    MarriageStatusId: string
    EducationId: string
    SalaryRangeId: string
    rukunWarga: RukunWarga
    rukunTetangga: RukunTetangga
    marriageStatus: MarriageStatus
    education: Education
    salaryRange: SalaryRange
    createdAt: string
    updatedAt: string
}

export interface ResidentMe extends UserMe {
    userDetail: UserDetail
}

export interface UpdateProfileResidentPayload {
    phoneNumber: string;
    SalaryRangeId: string;
    newPassword?: string;
    confirmNewPassword?: string;
}