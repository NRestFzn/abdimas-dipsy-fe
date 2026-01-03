export interface Role {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserMe {
    id: string;
    fullname: string;
    email: string;
    RoleId: string;
    role: Role;
    profilePicture: string;
    createdAt: string;
    updatedAt: string;
}