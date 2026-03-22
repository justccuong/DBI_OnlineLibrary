const {sql,connectDB} = require("../configs/db")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Register = async(UserName, Email,Password)=>{
    let hashPassword = await bcrypt.hash(Password,10);

    const request = new sql.Request();

    let result = await request
    .input("UserName",sql.NVarChar,UserName)
    .input("Email",sql.NVarChar,Email)
    .input("Password",sql.NVarChar,hashPassword)
    .query(`
        insert into Users (UserName,Email,Password)
        OUTPUT INSERTED.*
        values (@UserName, @Email,@Password)
        `)
    return result
}
const Login = async(Email,Password) =>{
    const request = new sql.Request();

    let result = await request
    .input("Email",sql.NVarChar,Email)
    .query(`
        select * from Users
        where Email = @Email
        `);
    let user = result.recordset[0];
    let comparePassword = bcrypt.compare(Password,user.Password);

    if (!comparePassword) throw new Error("Wrong password")
    
    const token = jwt.sign(
        {userId:user.Id, id:user.Id, role:user.Role},
        process.env.JWT_SECRET,
        {expiresIn:"15m"}
    )

    return token
}
module.exports = {Register,Login}