USE OnlineLibrary;
GO

/*
    Report-friendly seed data for the Online Library project.
    Demo logins kept for the app:
    - admin@demo.local / Admin123
    - student@demo.local / Member123
*/

INSERT INTO dbo.[Role] (role_name, max_download_per_day)
SELECT source.role_name, source.max_download_per_day
FROM (
    VALUES
        (N'Quản trị viên', 999),
        (N'Biên tập viên', 100),
        (N'Giảng viên', 20),
        (N'Thành viên VIP', 15),
        (N'Thành viên Thường', 5),
        (N'Khách vãng lai', 0)
) AS source(role_name, max_download_per_day)
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.[Role] target
    WHERE target.role_name = source.role_name
);
GO

INSERT INTO dbo.Author (author_name, bio)
SELECT source.author_name, source.bio
FROM (
    VALUES
        (N'Nguyễn Du', N'Đại thi hào dân tộc Việt Nam, tác giả của kiệt tác Truyện Kiều.'),
        (N'Nam Cao', N'Nhà văn hiện thực tiêu biểu với nhiều tác phẩm phản ánh sâu sắc đời sống xã hội.'),
        (N'Nguyễn Nhật Ánh', N'Tác giả quen thuộc với nhiều đầu sách dành cho tuổi học trò.'),
        (N'Tô Hoài', N'Tác giả nổi tiếng với các tác phẩm thiếu nhi giàu giá trị giáo dục.'),
        (N'Dale Carnegie', N'Tác giả của nhiều đầu sách kỹ năng sống và giao tiếp nổi tiếng.'),
        (N'J.K. Rowling', N'Nhà văn Anh nổi tiếng với loạt tiểu thuyết Harry Potter.'),
        (N'Paulo Coelho', N'Tác giả Nhà Giả Kim, được nhiều độc giả trẻ yêu thích.'),
        (N'Robert Kiyosaki', N'Tác giả các đầu sách về tư duy tài chính cá nhân và đầu tư.'),
        (N'Nguyễn Hà Anh', N'Tác giả biên soạn tài liệu về SQL Server và hệ quản trị cơ sở dữ liệu.'),
        (N'Lê Bảo Châu', N'Tác giả tập trung vào thiết kế giao diện, bố cục và trải nghiệm người dùng.')
) AS source(author_name, bio)
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.Author target
    WHERE target.author_name = source.author_name
);
GO

INSERT INTO dbo.Category (category_name)
SELECT source.category_name
FROM (
    VALUES
        (N'Văn học Việt Nam'),
        (N'Tiểu thuyết nước ngoài'),
        (N'Kỹ năng sống'),
        (N'Kinh tế - Tài chính'),
        (N'Thiếu nhi'),
        (N'Công nghệ thông tin'),
        (N'Cơ sở dữ liệu'),
        (N'Thiết kế giao diện'),
        (N'Thơ ca')
) AS source(category_name)
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.Category target
    WHERE target.category_name = source.category_name
);
GO

INSERT INTO dbo.Book (
    title,
    Publisher_name,
    Published_year,
    total_page,
    file_format,
    isbn,
    downloadable,
    description,
    file_size,
    file_url,
    preview_url
)
SELECT
    source.title,
    source.Publisher_name,
    source.Published_year,
    source.total_page,
    source.file_format,
    source.isbn,
    source.downloadable,
    source.description,
    source.file_size,
    source.file_url,
    source.preview_url
FROM (
    VALUES
        (N'Truyện Kiều', N'NXB Văn Học', 1820, 3254, 'PDF', 'ISBN001', 1, N'Tác phẩm thơ truyện kinh điển của văn học Việt Nam, có giá trị lớn về nội dung và nghệ thuật.', '10 MB', N'https://example.local/files/truyen-kieu.pdf', N'https://example.local/previews/truyen-kieu'),
        (N'Chí Phèo', N'NXB Trẻ', 1941, 150, 'EPUB', 'ISBN002', 1, N'Tác phẩm hiện thực phê phán tiêu biểu, phản ánh sâu sắc số phận con người trong xã hội cũ.', '2 MB', N'https://example.local/files/chi-pheo.epub', N'https://example.local/previews/chi-pheo'),
        (N'Cho tôi xin một vé đi tuổi thơ', N'NXB Trẻ', 2008, 200, 'PDF', 'ISBN003', 1, N'Tác phẩm nhẹ nhàng, trong sáng, tái hiện thế giới tuổi thơ qua góc nhìn hồn nhiên và gần gũi.', '5 MB', N'https://example.local/files/ve-di-tuoi-tho.pdf', N'https://example.local/previews/ve-di-tuoi-tho'),
        (N'Dế Mèn Phiêu Lưu Ký', N'NXB Kim Đồng', 1941, 180, 'MOBI', 'ISBN004', 1, N'Tác phẩm thiếu nhi nổi tiếng với nhiều bài học về tình bạn, trách nhiệm và sự trưởng thành.', '8 MB', N'https://example.local/files/de-men-phieu-luu-ky.mobi', N'https://example.local/previews/de-men-phieu-luu-ky'),
        (N'Đắc Nhân Tâm', N'NXB Tổng Hợp', 1936, 320, 'PDF', 'ISBN005', 1, N'Cuốn sách kỹ năng sống nổi tiếng giúp cải thiện giao tiếp, ứng xử và xây dựng các mối quan hệ tích cực.', '4 MB', N'https://example.local/files/dac-nhan-tam.pdf', N'https://example.local/previews/dac-nhan-tam'),
        (N'Harry Potter và Hòn Đá Phù Thủy', N'Bloomsbury', 1997, 309, 'PDF', 'ISBN006', 1, N'Cuốn tiểu thuyết giả tưởng mở đầu cho thế giới Harry Potter, rất được yêu thích trong thư viện số.', '11 MB', N'https://example.local/files/harry-potter-1.pdf', N'https://example.local/previews/harry-potter-1'),
        (N'Nhà Giả Kim', N'NXB Hội Nhà Văn', 1988, 227, 'PDF', 'ISBN007', 1, N'Tác phẩm nổi tiếng về hành trình theo đuổi ước mơ, phù hợp với độc giả sinh viên và người trẻ.', '3 MB', N'https://example.local/files/nha-gia-kim.pdf', N'https://example.local/previews/nha-gia-kim'),
        (N'Cha Giàu Cha Nghèo', N'NXB Trẻ', 1997, 336, 'PDF', 'ISBN008', 1, N'Cuốn sách phổ biến về tư duy tài chính và quản lý tiền bạc dành cho người mới bắt đầu.', '6 MB', N'https://example.local/files/cha-giau-cha-ngheo.pdf', N'https://example.local/previews/cha-giau-cha-ngheo'),
        (N'Cơ sở dữ liệu SQL Server', N'FPT Academic Press', 2025, 420, 'PDF', 'ISBN009', 1, N'Tài liệu nền tảng về SQL Server, phù hợp cho sinh viên học môn cơ sở dữ liệu và xây dựng hệ thống thư viện trực tuyến.', '12 MB', N'https://example.local/files/co-so-du-lieu-sql-server.pdf', N'https://example.local/previews/co-so-du-lieu-sql-server'),
        (N'Thiết kế giao diện người dùng hiện đại', N'Digital Design House', 2024, 260, 'PDF', 'ISBN010', 1, N'Tài liệu tham khảo về thiết kế UI/UX, bố cục giao diện và các nguyên tắc xây dựng trải nghiệm người dùng hiện đại.', '7 MB', N'https://example.local/files/thiet-ke-giao-dien-hien-dai.pdf', N'https://example.local/previews/thiet-ke-giao-dien-hien-dai')
) AS source(title, Publisher_name, Published_year, total_page, file_format, isbn, downloadable, description, file_size, file_url, preview_url)
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.Book target
    WHERE target.isbn = source.isbn
);
GO

INSERT INTO dbo.Book_Author (book_id, author_id)
SELECT book.book_id, author.author_id
FROM (
    VALUES
        ('ISBN001', N'Nguyễn Du'),
        ('ISBN002', N'Nam Cao'),
        ('ISBN003', N'Nguyễn Nhật Ánh'),
        ('ISBN004', N'Tô Hoài'),
        ('ISBN005', N'Dale Carnegie'),
        ('ISBN006', N'J.K. Rowling'),
        ('ISBN007', N'Paulo Coelho'),
        ('ISBN008', N'Robert Kiyosaki'),
        ('ISBN009', N'Nguyễn Hà Anh'),
        ('ISBN010', N'Lê Bảo Châu')
) AS source(isbn, author_name)
JOIN dbo.Book book ON book.isbn = source.isbn
JOIN dbo.Author author ON author.author_name = source.author_name
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.Book_Author target
    WHERE target.book_id = book.book_id
      AND target.author_id = author.author_id
);
GO

INSERT INTO dbo.Book_Category (book_id, category_id)
SELECT book.book_id, category.category_id
FROM (
    VALUES
        ('ISBN001', N'Văn học Việt Nam'),
        ('ISBN001', N'Thơ ca'),
        ('ISBN002', N'Văn học Việt Nam'),
        ('ISBN003', N'Thiếu nhi'),
        ('ISBN003', N'Văn học Việt Nam'),
        ('ISBN004', N'Thiếu nhi'),
        ('ISBN005', N'Kỹ năng sống'),
        ('ISBN006', N'Tiểu thuyết nước ngoài'),
        ('ISBN006', N'Thiếu nhi'),
        ('ISBN007', N'Tiểu thuyết nước ngoài'),
        ('ISBN007', N'Kỹ năng sống'),
        ('ISBN008', N'Kinh tế - Tài chính'),
        ('ISBN009', N'Công nghệ thông tin'),
        ('ISBN009', N'Cơ sở dữ liệu'),
        ('ISBN010', N'Công nghệ thông tin'),
        ('ISBN010', N'Thiết kế giao diện')
) AS source(isbn, category_name)
JOIN dbo.Book book ON book.isbn = source.isbn
JOIN dbo.Category category ON category.category_name = source.category_name
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.Book_Category target
    WHERE target.book_id = book.book_id
      AND target.category_id = category.category_id
);
GO

INSERT INTO dbo.[User] (
    user_code,
    user_name,
    password_hash,
    fullname,
    email,
    phone_number,
    role_id
)
SELECT
    source.user_code,
    source.user_name,
    source.password_hash,
    source.fullname,
    source.email,
    source.phone_number,
    role.role_id
FROM (
    VALUES
        ('ADMIN001', N'admin_minh', '$2b$10$bntr.hIWvlwIAkhLkFH.2uYGt9Go6abEMh/MDIguNjx25ffbkgGS.', N'Nguyễn Quang Minh', 'admin@demo.local', '0901000001', N'Quản trị viên'),
        ('MEM001', N'sv_hoa', '$2b$10$hEPRyZqlGFxcJ1B1s.V5ouEx1MUmnekq.pt1e8n4aJHkwLkO1tC.O', N'Lê Thị Hoa', 'student@demo.local', '0902000002', N'Thành viên Thường'),
        ('EDT001', N'bientap_anh', '$2b$10$bntr.hIWvlwIAkhLkFH.2uYGt9Go6abEMh/MDIguNjx25ffbkgGS.', N'Hoàng Ngọc Anh', 'anh@library.com', '0903000003', N'Biên tập viên'),
        ('VIP001', N'vip_tung', '$2b$10$hEPRyZqlGFxcJ1B1s.V5ouEx1MUmnekq.pt1e8n4aJHkwLkO1tC.O', N'Trần Thanh Tùng', 'tung@vip.local', '0904000004', N'Thành viên VIP'),
        ('LEC001', N'gv_giang', '$2b$10$hEPRyZqlGFxcJ1B1s.V5ouEx1MUmnekq.pt1e8n4aJHkwLkO1tC.O', N'Phạm Mạnh Giang', 'giangvien@library.com', '0905000005', N'Giảng viên')
) AS source(user_code, user_name, password_hash, fullname, email, phone_number, role_name)
JOIN dbo.[Role] role ON role.role_name = source.role_name
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.[User] target
    WHERE target.email = source.email
);
GO

INSERT INTO dbo.Access_log (access_type, device_ip, Accessed_at, user_id, book_id)
SELECT
    source.access_type,
    source.device_ip,
    source.Accessed_at,
    [user].user_id,
    book.book_id
FROM (
    VALUES
        ('view', '192.168.1.15', CAST('2026-03-10T08:15:00' AS DATETIME), 'student@demo.local', 'ISBN001'),
        ('download', '192.168.1.15', CAST('2026-03-10T08:20:00' AS DATETIME), 'student@demo.local', 'ISBN003'),
        ('view', '10.10.1.20', CAST('2026-03-11T09:05:00' AS DATETIME), 'giangvien@library.com', 'ISBN009'),
        ('download', '10.10.1.20', CAST('2026-03-11T09:15:00' AS DATETIME), 'giangvien@library.com', 'ISBN009'),
        ('borrow', '172.16.10.8', CAST('2026-03-12T14:00:00' AS DATETIME), 'tung@vip.local', 'ISBN005'),
        ('view', '127.0.0.1', CAST('2026-03-13T07:45:00' AS DATETIME), 'admin@demo.local', 'ISBN010'),
        ('download', '127.0.0.1', CAST('2026-03-13T08:10:00' AS DATETIME), 'admin@demo.local', 'ISBN010')
) AS source(access_type, device_ip, Accessed_at, email, isbn)
JOIN dbo.[User] [user] ON [user].email = source.email
JOIN dbo.Book book ON book.isbn = source.isbn
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.Access_log target
    WHERE target.user_id = [user].user_id
      AND target.book_id = book.book_id
      AND target.access_type = source.access_type
);
GO

INSERT INTO dbo.Rate (user_id, book_id, Rating_score, Review_text)
SELECT
    [user].user_id,
    book.book_id,
    source.Rating_score,
    source.Review_text
FROM (
    VALUES
        ('student@demo.local', 'ISBN001', 5, N'Tác phẩm kinh điển, nội dung sâu sắc và rất phù hợp để tham khảo trong thư viện số.'),
        ('student@demo.local', 'ISBN003', 5, N'Cuốn sách tuổi thơ rất dễ đọc, nội dung gần gũi và tạo cảm giác thân thuộc.'),
        ('giangvien@library.com', 'ISBN009', 4, N'Bố cục rõ ràng, nội dung dễ theo dõi và rất phù hợp với sinh viên học SQL Server.'),
        ('admin@demo.local', 'ISBN010', 4, N'Nội dung về giao diện và trải nghiệm người dùng rất hữu ích cho phần viết báo cáo.'),
        ('tung@vip.local', 'ISBN005', 5, N'Đây là một trong những cuốn sách kỹ năng kinh điển, dễ đọc và ứng dụng thực tế tốt.')
) AS source(email, isbn, Rating_score, Review_text)
JOIN dbo.[User] [user] ON [user].email = source.email
JOIN dbo.Book book ON book.isbn = source.isbn
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.Rate target
    WHERE target.user_id = [user].user_id
      AND target.book_id = book.book_id
);
GO

UPDATE book
SET
    average_score = ISNULL(stats.average_score, 0),
    total_rate = ISNULL(stats.total_rate, 0),
    total_download = ISNULL(stats.total_download, 0),
    total_view = ISNULL(stats.total_view, 0)
FROM dbo.Book book
OUTER APPLY (
    SELECT
        CAST(AVG(CAST(rate.Rating_score AS DECIMAL(5,2))) AS DECIMAL(3,2)) AS average_score,
        COUNT(rate.book_id) AS total_rate,
        (
            SELECT COUNT(*)
            FROM dbo.Access_log access_log
            WHERE access_log.book_id = book.book_id
              AND access_log.access_type = 'download'
        ) AS total_download,
        (
            SELECT COUNT(*)
            FROM dbo.Access_log access_log
            WHERE access_log.book_id = book.book_id
              AND access_log.access_type = 'view'
        ) AS total_view
    FROM dbo.Rate rate
    WHERE rate.book_id = book.book_id
) AS stats;
GO
