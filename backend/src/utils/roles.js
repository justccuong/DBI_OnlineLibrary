const ROLE_ALIASES = {
    admin: "admin",
    "quản trị viên": "admin",
    "quan tri vien": "admin",
    "biên tập viên": "admin",
    "bien tap vien": "admin",
    member: "member",
    "thành viên": "member",
    "thanh vien": "member",
    "thành viên thường": "member",
    "thanh vien thuong": "member",
    "thành viên vip": "member",
    "thanh vien vip": "member",
    "khách vãng lai": "member",
    "khach vang lai": "member",
    lecturer: "lecturer",
    "giảng viên": "lecturer",
    "giang vien": "lecturer",
}

const normalizeRole = (role) => {
    const normalized = String(role || "").trim().toLowerCase()
    return ROLE_ALIASES[normalized] || normalized || "member"
}

const isAdminRole = (role) => normalizeRole(role) === "admin"

module.exports = { normalizeRole, isAdminRole }
