const { randomUUID } = require("crypto")

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const { sql, pool, hasDbConnection } = require("../configs/db")
const mockLibrary = require("../data/mockLibrary")
const { normalizeRole } = require("../utils/roles")

const sanitizeUser = (user) => ({
    id: user.user_id ?? user.Id,
    userName: user.user_name ?? user.UserName,
    email: user.email ?? user.Email,
    role: normalizeRole(user.role_name ?? user.Role),
    roleLabel: user.role_name ?? user.RoleLabel ?? user.Role ?? normalizeRole(user.role_name ?? user.Role),
})

const buildUserCode = () => `USR-${randomUUID().replace(/-/g, "").slice(0, 16).toUpperCase()}`

const registerUser = async (userName, email, password) => {
    if (!userName || !email || !password) {
        const error = new Error("User name, email and password are required")
        error.statusCode = 400
        throw error
    }

    if (!hasDbConnection()) {
        const existingUser = mockLibrary.getUserByEmail(email)

        if (existingUser) {
            const error = new Error("Email already exists")
            error.statusCode = 409
            throw error
        }

        const user = mockLibrary.createUser({
            userName,
            email,
            password,
            role: "member",
        })

        return sanitizeUser(user)
    }

    const existingUserResult = await pool().request()
        .input("email", sql.NVarChar, email)
        .query("SELECT user_id FROM [User] WHERE email = @email")

    if (existingUserResult.recordset[0]) {
        const error = new Error("Email already exists")
        error.statusCode = 409
        throw error
    }

    const roleResult = await pool().request().query(`
        SELECT TOP 1 role_id, role_name
        FROM [Role]
        WHERE LOWER(role_name) IN (
            'member',
            N'thành viên',
            N'thành viên thường',
            N'thành viên vip',
            N'khách vãng lai'
        )
        ORDER BY CASE
            WHEN LOWER(role_name) = 'member' THEN 0
            WHEN LOWER(role_name) = N'thành viên thường' THEN 1
            WHEN LOWER(role_name) = N'thành viên vip' THEN 2
            WHEN LOWER(role_name) = N'thành viên' THEN 3
            WHEN LOWER(role_name) = N'khách vãng lai' THEN 4
            ELSE 100
        END
    `)

    const memberRole = roleResult.recordset[0]

    if (!memberRole) {
        const error = new Error("Member role is missing. Please run database/seed.sql first.")
        error.statusCode = 500
        throw error
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const result = await pool().request()
        .input("userCode", sql.VarChar, buildUserCode())
        .input("userName", sql.NVarChar, userName)
        .input("email", sql.NVarChar, email)
        .input("password", sql.NVarChar, hashPassword)
        .input("roleId", sql.Int, memberRole.role_id)
        .query(`
            INSERT INTO [User] (user_code, user_name, password_hash, fullname, email, role_id)
            OUTPUT INSERTED.user_id, INSERTED.user_name, INSERTED.email
            VALUES (@userCode, @userName, @password, @userName, @email, @roleId)
        `)

    return sanitizeUser({
        ...result.recordset[0],
        role_name: memberRole.role_name,
    })
}

const loginUser = async (email, password) => {
    if (!email || !password) {
        const error = new Error("Email and password are required")
        error.statusCode = 400
        throw error
    }

    if (!hasDbConnection()) {
        const user = mockLibrary.getUserByEmail(email)

        if (!user) {
            const error = new Error("User not found")
            error.statusCode = 404
            throw error
        }

        if (user.Password !== password) {
            const error = new Error("Wrong password")
            error.statusCode = 401
            throw error
        }

        const token = jwt.sign(
            {
                userId: user.Id,
                id: user.Id,
                role: user.Role || "member",
                email: user.Email,
                userName: user.UserName,
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
        )

        return {
            token,
            user: sanitizeUser(user),
        }
    }

    const result = await pool().request()
        .input("email", sql.NVarChar, email)
        .query(`
            SELECT
                u.user_id,
                u.user_name,
                u.email,
                u.password_hash,
                r.role_name
            FROM [User] u
            JOIN [Role] r ON r.role_id = u.role_id
            WHERE u.email = @email
        `)

    const user = result.recordset[0]

    if (!user) {
        const error = new Error("User not found")
        error.statusCode = 404
        throw error
    }

    const comparePassword = await bcrypt.compare(password, user.password_hash)

    if (!comparePassword) {
        const error = new Error("Wrong password")
        error.statusCode = 401
        throw error
    }

    const token = jwt.sign(
        {
            userId: user.user_id,
            id: user.user_id,
            role: normalizeRole(user.role_name),
            email: user.email,
            userName: user.user_name,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
    )

    return {
        token,
        user: sanitizeUser(user)
    }
}

const getUserById = async (userId) => {
    if (!hasDbConnection()) {
        const user = mockLibrary.getUserById(userId)

        if (!user) {
            const error = new Error("User not found")
            error.statusCode = 404
            throw error
        }

        return sanitizeUser(user)
    }

    const result = await pool().request()
        .input("userId", sql.Int, userId)
        .query(`
            SELECT
                u.user_id,
                u.user_name,
                u.email,
                r.role_name
            FROM [User] u
            JOIN [Role] r ON r.role_id = u.role_id
            WHERE u.user_id = @userId
        `)

    const user = result.recordset[0]

    if (!user) {
        const error = new Error("User not found")
        error.statusCode = 404
        throw error
    }

    return sanitizeUser(user)
}

module.exports = { registerUser, loginUser, getUserById }
