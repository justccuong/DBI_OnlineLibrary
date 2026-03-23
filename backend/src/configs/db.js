const forceMockData = String(process.env.USE_MOCK_DATA || "false").toLowerCase() === "true"
const useTrustedConnection = String(process.env.DB_TRUSTED_CONNECTION || "false").toLowerCase() === "true"
const sql = useTrustedConnection ? require("mssql/msnodesqlv8") : require("mssql")

const config = useTrustedConnection
    ? {
        driver: process.env.DB_ODBC_DRIVER || "ODBC Driver 17 for SQL Server",
        server: process.env.DB_SERVER || ".",
        database: process.env.DB_NAME || "OnlineLibrary",
        options: {
            trustedConnection: true,
            trustServerCertificate: true,
        },
    }
    : {
        user: process.env.DB_USER || "sa",
        password: process.env.DB_PASSWORD || "123",
        server: process.env.DB_SERVER || "localhost",
        database: process.env.DB_NAME || "OnlineLibrary",
        port: Number(process.env.DB_PORT || 1433),
        options: {
            encrypt: false,
            trustServerCertificate: true,
        },
    }

let pool

const connectDB = async () => {
    if (forceMockData) {
        console.log("USE_MOCK_DATA is enabled. Skipping SQL Server connection.")
        return null
    }

    if (pool) {
        return pool
    }

    try {
        pool = await sql.connect(config)
        console.log(`Connected to SQL Server using ${useTrustedConnection ? "Windows authentication" : "SQL authentication"}`)
        return pool
    } catch (error) {
        console.log("SQL Server is not available right now. Falling back to mock library data.")
        console.log(`Connection detail: ${error.message}`)
        return null
    }
}

const getPool = () => {
    if (!pool) {
        throw new Error("Database connection has not been initialized yet")
    }

    return pool
}

const hasDbConnection = () => Boolean(pool)
const getDataMode = () => (hasDbConnection() ? "sql" : "mock")

module.exports = { sql, pool: getPool, connectDB, hasDbConnection, getDataMode }
