export const ROLE_ID = {
    WARGA: "b991760d-6086-4615-8240-439702b3086b",
    ADMIN_MEDIS: "b40a9513-a2bc-447a-956c-9c4d1462a1f7",
    ADMIN_DESA: "b74c04a0-9e0c-4760-8473-56107110b33",
    KADER: "bdf1ffd5-8284-404b-9026-84157d536d5a",
}

export const getRoleName = (roleId: string) => {
    switch (roleId) {
        case ROLE_ID.WARGA: return "Warga";
        case ROLE_ID.ADMIN_MEDIS: return "Admin Medis";
        case ROLE_ID.ADMIN_DESA: return "Admin Desa";
        case ROLE_ID.KADER: return "Kader";
        default: return "Unknown Role";
    }
};