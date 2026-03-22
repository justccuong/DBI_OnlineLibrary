const sql = require("mssql")

const config = {
    user:"sa",
    password:"123",
    server:"localhost",
    database:"OnlineLibrary",
    port:1433,
    options: {
    encrypt: false,
    trustServerCertificate: true
  }
}

let pool;

const connectDB = async() =>{
    try {
        pool = await sql.connect(config);
        console.log("Connected Database")
    } catch (error) {
        console.log("Error to Database: ",error)
    }
} 

module.exports = {sql, pool: () => pool, connectDB}