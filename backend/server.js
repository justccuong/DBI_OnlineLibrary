const express = require("express")
const app = express()
const { sql, connectDB } = require("./src/configs/db")
const AuthRouter = require("./src/router/authRouter")
const PORT = 3000;
require('dotenv').config();
app.use(express.json());

app.get("/user",async(req,res)=>{
    try {
        const result = await sql.query(`select * from Users`)
        res.status(200).json({
            result : result.recordset,
            message:'tets'
        })
    } catch (error) {
        res.status(500).json("LOI O DAU DO");
        console.log("error when get all user :",error)
    }
});

app.use("/books",require("./src/router/book"))

app.use("/auth",AuthRouter);


    (async () => {
        try {
            await connectDB()
            app.listen(PORT, () => {
                console.log("server is running")
            })
        } catch (error) {
            console.log("error when connect db: ", error)
        }
    })()
