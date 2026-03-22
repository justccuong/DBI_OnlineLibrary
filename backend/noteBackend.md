1. khi config db can
 config = {
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
2. khi muon thuc thi query hoặc gắn parameter @userName thì dùng request
const request = new sql.Request();
request.input("UserName", sql.NVarChar, UserName);

3.bcrypt có 2 hàm:
bcrypt.hash(password, saltRounds);
bcrypt.hash(password, hash);

4.jwt co 2 ham :
    const Token = jwt.sign(
        { userId: user.Id },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );
--------------
const decoded = jwt.verify(token,process.env.JWT_SECRET);

5. Khi lay token tu req thi lay req.headers.authorization
xong roi con .split(" ")[1]

