const express = require("express")
const AuthRouter = express.Router()
const { Register,Login } = require("../services/authService")

AuthRouter.post("/register", async (req, res) => {
    try {
        const { UserName, Email, Password } = req.body;
        let result = await Register(UserName, Email, Password);
        res.status(200).json({
            result: result.recordset,
            mess: "register success "
        })
    } catch (error) {
        res.status(500).json("Loi he thong");
        console.log("Error When Register: ", error)
    }

})
AuthRouter.post("/login", async (req, res) => {
    try {
        const { Email, Password } = req.body;
        let result = await Login(Email, Password);

        if (!result) throw new Error("Result is undefine");

        res.status(200).json({
            Token: result,
            mess: "login success "
        })
    } catch (error) {
        res.status(500).json("Loi he thong");
        console.log("Error When Login: ", error)
    }

})


module.exports = AuthRouter