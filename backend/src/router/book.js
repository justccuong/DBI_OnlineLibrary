const express = require("express")
const BookRouter = express.Router()
const {sql,pool} = require("../configs/db")
const {authMiddleware,admin} = require("../middleware/auth")

BookRouter.get("/", async(req,res)=>{

    const result = await pool.request().query(`
        SELECT b.Id,b.Title,b.ISBN,b.Description,
        c.Name as Category
        FROM Books b
        LEFT JOIN BookCategory bc ON b.Id=bc.IdBook
        LEFT JOIN Categories c ON c.Id=bc.IdCategory
    `)

    res.json(result.recordset)
});
BookRouter.post("/",authMiddleware,admin, async(req,res)=>{

    const {title,isbn,description} = req.body

    await pool.request()
    .input("title",sql.NVarChar,title)
    .input("isbn",sql.NVarChar,isbn)
    .input("desc",sql.NVarChar,description)
    .query(`
        INSERT INTO Books(Title,ISBN,Description)
        VALUES(@title,@isbn,@desc)
    `)

    res.send("Book added")
});
BookRouter.put("/:id",authMiddleware,admin, async(req,res)=>{

    const {title,description} = req.body
    const id = req.params.id

    await pool.request()
    .input("id",sql.Int,id)
    .input("title",sql.NVarChar,title)
    .input("desc",sql.NVarChar,description)
    .query(`
        UPDATE Books
        SET Title=@title,
            Description=@desc
        WHERE Id=@id
    `)

    res.send("Book updated")
});

BookRouter.delete("/:id",authMiddleware,admin, async(req,res)=>{

    const id = req.params.id

    await pool.request()
    .input("id",sql.Int,id)
    .query("DELETE FROM Books WHERE Id=@id")

    res.send("Book deleted")
});

BookRouter.post("/borrow",authMiddleware, async(req,res)=>{

    const {bookId} = req.body

    await pool.request()
    .input("userId",sql.Int,req.user.userId)
    .input("bookId",sql.Int,bookId)
    .input("type",sql.NVarChar,"borrow")
    .query(`
        INSERT INTO AccessLogs(IdUser,IdBook,AccessType)
        VALUES(@userId,@bookId,@type)
    `)

    res.send("Borrow success")
});
BookRouter.get("/my-books",authMiddleware, async(req,res)=>{

    const result = await pool.request()
    .input("userId",sql.Int,req.user.userId)
    .query(`
        SELECT b.Title,a.AccessType
        FROM AccessLogs a
        JOIN Books b ON a.IdBook=b.Id
        WHERE a.IdUser=@userId
    `)

    res.json(result.recordset)
})

module.exports = BookRouter