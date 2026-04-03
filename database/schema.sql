IF DB_ID(N'OnlineLibrary') IS NULL
BEGIN
    CREATE DATABASE OnlineLibrary;
END
GO

USE OnlineLibrary;
GO

IF OBJECT_ID(N'dbo.Rate', N'U') IS NOT NULL DROP TABLE dbo.Rate;
IF OBJECT_ID(N'dbo.Book_Author', N'U') IS NOT NULL DROP TABLE dbo.Book_Author;
IF OBJECT_ID(N'dbo.Book_Category', N'U') IS NOT NULL DROP TABLE dbo.Book_Category;
IF OBJECT_ID(N'dbo.Access_log', N'U') IS NOT NULL DROP TABLE dbo.Access_log;
IF OBJECT_ID(N'dbo.[User]', N'U') IS NOT NULL DROP TABLE dbo.[User];
IF OBJECT_ID(N'dbo.Book', N'U') IS NOT NULL DROP TABLE dbo.Book;
IF OBJECT_ID(N'dbo.Category', N'U') IS NOT NULL DROP TABLE dbo.Category;
IF OBJECT_ID(N'dbo.Author', N'U') IS NOT NULL DROP TABLE dbo.Author;
IF OBJECT_ID(N'dbo.[Role]', N'U') IS NOT NULL DROP TABLE dbo.[Role];
GO

CREATE TABLE dbo.[Role] (
    role_id INT PRIMARY KEY IDENTITY(1,1),
    role_name NVARCHAR(100) NOT NULL UNIQUE,
    max_download_per_day INT NOT NULL CONSTRAINT DF_Role_MaxDownload DEFAULT 0
);
GO

CREATE TABLE dbo.Author (
    author_id INT PRIMARY KEY IDENTITY(1,1),
    author_name NVARCHAR(255) NOT NULL,
    bio NVARCHAR(MAX) NULL
);
GO

CREATE TABLE dbo.Category (
    category_id INT PRIMARY KEY IDENTITY(1,1),
    category_name NVARCHAR(255) NOT NULL UNIQUE
);
GO

CREATE TABLE dbo.Book (
    book_id INT PRIMARY KEY IDENTITY(1,1),
    title NVARCHAR(255) NOT NULL,
    Publisher_name NVARCHAR(255) NULL,
    Published_year INT NULL,
    total_page INT NULL,
    file_format VARCHAR(50) NULL,
    average_score DECIMAL(3,2) NOT NULL CONSTRAINT DF_Book_AverageScore DEFAULT 0.00,
    isbn VARCHAR(20) NOT NULL UNIQUE,
    total_rate INT NOT NULL CONSTRAINT DF_Book_TotalRate DEFAULT 0,
    downloadable BIT NOT NULL CONSTRAINT DF_Book_Downloadable DEFAULT 1,
    total_download INT NOT NULL CONSTRAINT DF_Book_TotalDownload DEFAULT 0,
    total_view INT NOT NULL CONSTRAINT DF_Book_TotalView DEFAULT 0,
    description NVARCHAR(MAX) NULL,
    file_size VARCHAR(50) NULL,
    file_url NVARCHAR(MAX) NULL,
    preview_url NVARCHAR(MAX) NULL
);
GO

CREATE TABLE dbo.[User] (
    user_id INT PRIMARY KEY IDENTITY(1,1),
    user_code VARCHAR(50) NOT NULL UNIQUE,
    user_name NVARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    fullname NVARCHAR(255) NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20) NULL,
    role_id INT NOT NULL,
    CONSTRAINT FK_User_Role FOREIGN KEY (role_id) REFERENCES dbo.[Role](role_id) ON DELETE NO ACTION
);
GO

CREATE TABLE dbo.Access_log (
    log_id INT PRIMARY KEY IDENTITY(1,1),
    access_type VARCHAR(100) NOT NULL,
    device_ip VARCHAR(50) NULL,
    Accessed_at DATETIME NOT NULL CONSTRAINT DF_AccessLog_AccessedAt DEFAULT GETDATE(),
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    CONSTRAINT FK_AccessLog_User FOREIGN KEY (user_id) REFERENCES dbo.[User](user_id) ON DELETE CASCADE,
    CONSTRAINT FK_AccessLog_Book FOREIGN KEY (book_id) REFERENCES dbo.Book(book_id) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.Rate (
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    Rating_score INT NOT NULL CHECK (Rating_score >= 1 AND Rating_score <= 5),
    Review_text NVARCHAR(MAX) NULL,
    Created_at DATETIME NOT NULL CONSTRAINT DF_Rate_CreatedAt DEFAULT GETDATE(),
    PRIMARY KEY (user_id, book_id),
    CONSTRAINT FK_Rate_User FOREIGN KEY (user_id) REFERENCES dbo.[User](user_id) ON DELETE CASCADE,
    CONSTRAINT FK_Rate_Book FOREIGN KEY (book_id) REFERENCES dbo.Book(book_id) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.Book_Author (
    book_id INT NOT NULL,
    author_id INT NOT NULL,
    PRIMARY KEY (book_id, author_id),
    CONSTRAINT FK_BookAuthor_Book FOREIGN KEY (book_id) REFERENCES dbo.Book(book_id) ON DELETE CASCADE,
    CONSTRAINT FK_BookAuthor_Author FOREIGN KEY (author_id) REFERENCES dbo.Author(author_id) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.Book_Category (
    book_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (book_id, category_id),
    CONSTRAINT FK_BookCategory_Book FOREIGN KEY (book_id) REFERENCES dbo.Book(book_id) ON DELETE CASCADE,
    CONSTRAINT FK_BookCategory_Category FOREIGN KEY (category_id) REFERENCES dbo.Category(category_id) ON DELETE CASCADE
);
GO

CREATE INDEX IX_User_Email ON dbo.[User](email);
CREATE INDEX IX_Book_Title ON dbo.Book(title);
CREATE INDEX IX_AccessLog_User ON dbo.Access_log(user_id, Accessed_at DESC);
CREATE INDEX IX_AccessLog_Book ON dbo.Access_log(book_id, access_type);
GO
