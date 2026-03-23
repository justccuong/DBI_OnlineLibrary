USE OnlineLibrary;
GO

INSERT INTO dbo.[Role] (role_name, max_download_per_day)
SELECT N'admin', 999
WHERE NOT EXISTS (SELECT 1 FROM dbo.[Role] WHERE role_name = N'admin');

INSERT INTO dbo.[Role] (role_name, max_download_per_day)
SELECT N'member', 5
WHERE NOT EXISTS (SELECT 1 FROM dbo.[Role] WHERE role_name = N'member');

INSERT INTO dbo.[Role] (role_name, max_download_per_day)
SELECT N'lecturer', 20
WHERE NOT EXISTS (SELECT 1 FROM dbo.[Role] WHERE role_name = N'lecturer');
GO

INSERT INTO dbo.Author (author_name, bio)
SELECT N'Nguyen Ha Anh', N'Writes practical introductions to SQL Server, data modeling, and student information systems.'
WHERE NOT EXISTS (SELECT 1 FROM dbo.Author WHERE author_name = N'Nguyen Ha Anh');

INSERT INTO dbo.Author (author_name, bio)
SELECT N'Tran Minh Quan', N'Focuses on web application architecture and API design for university projects.'
WHERE NOT EXISTS (SELECT 1 FROM dbo.Author WHERE author_name = N'Tran Minh Quan');

INSERT INTO dbo.Author (author_name, bio)
SELECT N'Le Bao Chau', N'UX-oriented writer covering interface design, research, and accessibility.'
WHERE NOT EXISTS (SELECT 1 FROM dbo.Author WHERE author_name = N'Le Bao Chau');
GO

INSERT INTO dbo.Category (category_name)
SELECT N'Database'
WHERE NOT EXISTS (SELECT 1 FROM dbo.Category WHERE category_name = N'Database');

INSERT INTO dbo.Category (category_name)
SELECT N'Technology'
WHERE NOT EXISTS (SELECT 1 FROM dbo.Category WHERE category_name = N'Technology');

INSERT INTO dbo.Category (category_name)
SELECT N'Education'
WHERE NOT EXISTS (SELECT 1 FROM dbo.Category WHERE category_name = N'Education');

INSERT INTO dbo.Category (category_name)
SELECT N'UX Design'
WHERE NOT EXISTS (SELECT 1 FROM dbo.Category WHERE category_name = N'UX Design');
GO

INSERT INTO dbo.Book (
    title,
    Publisher_name,
    Published_year,
    total_page,
    file_format,
    isbn,
    description,
    file_size,
    file_url,
    preview_url
)
SELECT
    N'SQL Server Fundamentals',
    N'Campus Press',
    2025,
    320,
    'PDF',
    '978-100000001',
    N'A beginner-friendly guide to tables, joins, keys, views, and parameterized queries in Microsoft SQL Server.',
    '12 MB',
    N'https://example.local/files/sql-server-fundamentals.pdf',
    N'https://example.local/previews/sql-server-fundamentals'
WHERE NOT EXISTS (SELECT 1 FROM dbo.Book WHERE isbn = '978-100000001');

INSERT INTO dbo.Book (
    title,
    Publisher_name,
    Published_year,
    total_page,
    file_format,
    isbn,
    description,
    file_size,
    file_url,
    preview_url
)
SELECT
    N'Building Data-Driven Web Apps',
    N'FPT Digital Lab',
    2026,
    280,
    'PDF',
    '978-100000002',
    N'Combines frontend delivery, backend APIs, and SQL-backed business logic for team-based coursework.',
    '9 MB',
    N'https://example.local/files/data-driven-web-apps.pdf',
    N'https://example.local/previews/data-driven-web-apps'
WHERE NOT EXISTS (SELECT 1 FROM dbo.Book WHERE isbn = '978-100000002');

INSERT INTO dbo.Book (
    title,
    Publisher_name,
    Published_year,
    total_page,
    file_format,
    isbn,
    description,
    file_size,
    file_url,
    preview_url
)
SELECT
    N'Campus Information Systems',
    N'Academic Systems House',
    2024,
    245,
    'PDF',
    '978-100000003',
    N'Explains roles, access logs, relationships, and reporting patterns for a university library system.',
    '8 MB',
    N'https://example.local/files/campus-information-systems.pdf',
    N'https://example.local/previews/campus-information-systems'
WHERE NOT EXISTS (SELECT 1 FROM dbo.Book WHERE isbn = '978-100000003');

INSERT INTO dbo.Book (
    title,
    Publisher_name,
    Published_year,
    total_page,
    file_format,
    isbn,
    description,
    file_size,
    file_url,
    preview_url
)
SELECT
    N'Human-Centered Interface Design',
    N'Studio North',
    2023,
    198,
    'PDF',
    '978-100000004',
    N'Focused on layout, readability, user trust, and designing cleaner admin dashboards.',
    '7 MB',
    N'https://example.local/files/human-centered-interface-design.pdf',
    N'https://example.local/previews/human-centered-interface-design'
WHERE NOT EXISTS (SELECT 1 FROM dbo.Book WHERE isbn = '978-100000004');
GO

INSERT INTO dbo.Book_Category (book_id, category_id)
SELECT b.book_id, c.category_id
FROM dbo.Book b
JOIN dbo.Category c ON c.category_name = N'Database'
WHERE b.isbn = '978-100000001'
  AND NOT EXISTS (
      SELECT 1
      FROM dbo.Book_Category bc
      WHERE bc.book_id = b.book_id
        AND bc.category_id = c.category_id
  );

INSERT INTO dbo.Book_Category (book_id, category_id)
SELECT b.book_id, c.category_id
FROM dbo.Book b
JOIN dbo.Category c ON c.category_name = N'Technology'
WHERE b.isbn = '978-100000002'
  AND NOT EXISTS (
      SELECT 1
      FROM dbo.Book_Category bc
      WHERE bc.book_id = b.book_id
        AND bc.category_id = c.category_id
  );

INSERT INTO dbo.Book_Category (book_id, category_id)
SELECT b.book_id, c.category_id
FROM dbo.Book b
JOIN dbo.Category c ON c.category_name = N'Education'
WHERE b.isbn = '978-100000003'
  AND NOT EXISTS (
      SELECT 1
      FROM dbo.Book_Category bc
      WHERE bc.book_id = b.book_id
        AND bc.category_id = c.category_id
  );

INSERT INTO dbo.Book_Category (book_id, category_id)
SELECT b.book_id, c.category_id
FROM dbo.Book b
JOIN dbo.Category c ON c.category_name = N'UX Design'
WHERE b.isbn = '978-100000004'
  AND NOT EXISTS (
      SELECT 1
      FROM dbo.Book_Category bc
      WHERE bc.book_id = b.book_id
        AND bc.category_id = c.category_id
  );
GO

INSERT INTO dbo.Book_Author (book_id, author_id)
SELECT b.book_id, a.author_id
FROM dbo.Book b
JOIN dbo.Author a ON a.author_name = N'Nguyen Ha Anh'
WHERE b.isbn = '978-100000001'
  AND NOT EXISTS (
      SELECT 1
      FROM dbo.Book_Author ba
      WHERE ba.book_id = b.book_id
        AND ba.author_id = a.author_id
  );

INSERT INTO dbo.Book_Author (book_id, author_id)
SELECT b.book_id, a.author_id
FROM dbo.Book b
JOIN dbo.Author a ON a.author_name = N'Tran Minh Quan'
WHERE b.isbn = '978-100000002'
  AND NOT EXISTS (
      SELECT 1
      FROM dbo.Book_Author ba
      WHERE ba.book_id = b.book_id
        AND ba.author_id = a.author_id
  );

INSERT INTO dbo.Book_Author (book_id, author_id)
SELECT b.book_id, a.author_id
FROM dbo.Book b
JOIN dbo.Author a ON a.author_name = N'Nguyen Ha Anh'
WHERE b.isbn = '978-100000003'
  AND NOT EXISTS (
      SELECT 1
      FROM dbo.Book_Author ba
      WHERE ba.book_id = b.book_id
        AND ba.author_id = a.author_id
  );

INSERT INTO dbo.Book_Author (book_id, author_id)
SELECT b.book_id, a.author_id
FROM dbo.Book b
JOIN dbo.Author a ON a.author_name = N'Le Bao Chau'
WHERE b.isbn = '978-100000004'
  AND NOT EXISTS (
      SELECT 1
      FROM dbo.Book_Author ba
      WHERE ba.book_id = b.book_id
        AND ba.author_id = a.author_id
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
    'ADMIN001',
    N'admin',
    '$2b$10$bntr.hIWvlwIAkhLkFH.2uYGt9Go6abEMh/MDIguNjx25ffbkgGS.',
    N'Library Admin',
    'admin@demo.local',
    '0900000001',
    r.role_id
FROM dbo.[Role] r
WHERE r.role_name = N'admin'
  AND NOT EXISTS (SELECT 1 FROM dbo.[User] WHERE email = 'admin@demo.local');

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
    'MEM001',
    N'student',
    '$2b$10$hEPRyZqlGFxcJ1B1s.V5ouEx1MUmnekq.pt1e8n4aJHkwLkO1tC.O',
    N'Student Demo',
    'student@demo.local',
    '0900000002',
    r.role_id
FROM dbo.[Role] r
WHERE r.role_name = N'member'
  AND NOT EXISTS (SELECT 1 FROM dbo.[User] WHERE email = 'student@demo.local');
GO

INSERT INTO dbo.Access_log (access_type, device_ip, user_id, book_id)
SELECT 'borrow', '127.0.0.1', u.user_id, b.book_id
FROM dbo.[User] u
JOIN dbo.Book b ON b.isbn = '978-100000001'
WHERE u.email = 'student@demo.local'
  AND NOT EXISTS (
      SELECT 1
      FROM dbo.Access_log al
      WHERE al.user_id = u.user_id
        AND al.book_id = b.book_id
        AND al.access_type = 'borrow'
  );

INSERT INTO dbo.Access_log (access_type, device_ip, user_id, book_id)
SELECT 'view', '127.0.0.1', u.user_id, b.book_id
FROM dbo.[User] u
JOIN dbo.Book b ON b.isbn = '978-100000002'
WHERE u.email = 'student@demo.local'
  AND NOT EXISTS (
      SELECT 1
      FROM dbo.Access_log al
      WHERE al.user_id = u.user_id
        AND al.book_id = b.book_id
        AND al.access_type = 'view'
  );

INSERT INTO dbo.Access_log (access_type, device_ip, user_id, book_id)
SELECT 'download', '127.0.0.1', u.user_id, b.book_id
FROM dbo.[User] u
JOIN dbo.Book b ON b.isbn = '978-100000001'
WHERE u.email = 'admin@demo.local'
  AND NOT EXISTS (
      SELECT 1
      FROM dbo.Access_log al
      WHERE al.user_id = u.user_id
        AND al.book_id = b.book_id
        AND al.access_type = 'download'
  );
GO

INSERT INTO dbo.Rate (user_id, book_id, Rating_score, Review_text)
SELECT u.user_id, b.book_id, 5, N'Excellent reference for learning SQL Server joins and CRUD workflows.'
FROM dbo.[User] u
JOIN dbo.Book b ON b.isbn = '978-100000001'
WHERE u.email = 'student@demo.local'
  AND NOT EXISTS (
      SELECT 1
      FROM dbo.Rate r
      WHERE r.user_id = u.user_id
        AND r.book_id = b.book_id
  );

INSERT INTO dbo.Rate (user_id, book_id, Rating_score, Review_text)
SELECT u.user_id, b.book_id, 4, N'Useful for planning a team MERN plus SQL project with a cleaner architecture.'
FROM dbo.[User] u
JOIN dbo.Book b ON b.isbn = '978-100000002'
WHERE u.email = 'admin@demo.local'
  AND NOT EXISTS (
      SELECT 1
      FROM dbo.Rate r
      WHERE r.user_id = u.user_id
        AND r.book_id = b.book_id
  );
GO

UPDATE b
SET
    average_score = ISNULL(x.average_score, 0),
    total_rate = ISNULL(x.total_rate, 0),
    total_download = ISNULL(x.total_download, 0),
    total_view = ISNULL(x.total_view, 0)
FROM dbo.Book b
OUTER APPLY (
    SELECT
        CAST(AVG(CAST(r.Rating_score AS DECIMAL(5,2))) AS DECIMAL(3,2)) AS average_score,
        COUNT(r.book_id) AS total_rate,
        (
            SELECT COUNT(*)
            FROM dbo.Access_log al
            WHERE al.book_id = b.book_id
              AND al.access_type = 'download'
        ) AS total_download,
        (
            SELECT COUNT(*)
            FROM dbo.Access_log al
            WHERE al.book_id = b.book_id
              AND al.access_type = 'view'
        ) AS total_view
    FROM dbo.Rate r
    WHERE r.book_id = b.book_id
) x;
GO
