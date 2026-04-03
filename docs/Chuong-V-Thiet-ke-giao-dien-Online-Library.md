# CHƯƠNG V. THIẾT KẾ GIAO DIỆN

## 5.1. Nguyên tắc thiết kế giao diện

### 5.1.1. Nguyên tắc chung trong thiết kế giao diện

Khi thiết kế giao diện cho hệ thống Online Library Management System, nhóm ưu tiên xây dựng một giao diện hiện đại, rõ ràng và dễ sử dụng đối với người học trong môi trường đại học. Mục tiêu chính của giao diện là giúp người dùng tìm kiếm tài liệu nhanh, xem thông tin sách đầy đủ, đăng nhập thuận tiện, theo dõi lịch sử sử dụng và thao tác quản trị một cách trực quan.

Nguyên tắc đầu tiên được áp dụng là sự đơn giản và dễ sử dụng. Mỗi màn hình chỉ tập trung vào một nhóm chức năng chính để tránh gây rối mắt. Trang chủ tập trung cho việc tìm kiếm và khám phá sách; trang chi tiết sách tập trung hiển thị metadata, đọc thử, tải xuống và đánh giá; trang quản trị tập trung cho việc thêm, sửa và quản lý dữ liệu. Cách tổ chức này giúp người dùng dễ hiểu luồng thao tác ngay từ lần đầu sử dụng.

Nguyên tắc thứ hai là tính đồng bộ và nhất quán. Toàn bộ hệ thống sử dụng cùng một phong cách màu sắc, bố cục thẻ nội dung, kiểu nút bấm, kiểu biểu mẫu và cách hiển thị tiêu đề. Thanh điều hướng, khu vực nội dung và các hành động chính như tìm kiếm, đăng nhập, lưu dữ liệu, quay lại hay chỉnh sửa đều được trình bày thống nhất trên các trang. Sự nhất quán này giúp người dùng hình thành thói quen sử dụng nhanh hơn và hạn chế nhầm lẫn khi di chuyển giữa các màn hình.

Nguyên tắc tiếp theo là phản hồi tức thời với hành động của người dùng. Khi người dùng đăng nhập, tìm kiếm, lưu biểu mẫu, gửi đánh giá hoặc cập nhật dữ liệu sách, hệ thống cần có phản hồi rõ ràng dưới dạng trạng thái loading, thông báo thành công, thông báo lỗi hoặc xác nhận thao tác. Điều này giúp người dùng biết hệ thống đã tiếp nhận yêu cầu và giảm cảm giác chờ đợi không rõ nguyên nhân.

Bên cạnh đó, nhóm chú trọng tối ưu hóa thao tác sử dụng. Những công việc thường xuyên như tìm sách theo tên, lọc theo tác giả hoặc thể loại, xem chi tiết, tải tài liệu và quản lý sách được thiết kế theo số bước tối thiểu. Người dùng không cần mở quá nhiều màn hình trung gian để hoàn thành mục tiêu của mình. Đối với quản trị viên, biểu mẫu thêm và sửa sách được gom vào cùng một khu vực để giảm thời gian nhập liệu và thao tác quản trị.

An toàn và kiểm soát dữ liệu cũng là nguyên tắc quan trọng. Các thao tác có khả năng làm thay đổi dữ liệu như cập nhật hoặc xóa thông tin cần được kiểm soát bằng xác thực người dùng, kiểm tra vai trò và kiểm tra dữ liệu đầu vào. Biểu mẫu nhập liệu cần có validation để tránh nhập thiếu, sai định dạng hoặc trùng lặp dữ liệu quan trọng như email, ISBN hay tên danh mục. Với các hành động nhạy cảm, giao diện cần thể hiện cảnh báo rõ ràng để người dùng nhận biết hậu quả trước khi thao tác.

Hệ thống cũng được định hướng theo nguyên tắc responsive design. Giao diện phải hiển thị tốt trên máy tính để bàn, laptop, máy tính bảng và điện thoại. Các thành phần như thanh tìm kiếm, bộ lọc, lưới sách, bảng lịch sử truy cập và biểu mẫu quản trị cần co giãn phù hợp theo chiều rộng màn hình, đảm bảo người dùng vẫn thao tác thuận tiện trên các thiết bị khác nhau.

Ngoài ra, ngôn ngữ sử dụng trong giao diện cần đơn giản, gần gũi và dễ hiểu đối với sinh viên, giảng viên và quản trị viên. Các nhãn như "Tìm kiếm", "Xem trước", "Tải xuống", "Lịch sử truy cập", "Quản lý sách", "Lưu thay đổi" được ưu tiên sử dụng thay cho những cụm từ quá kỹ thuật. Điều này giúp giao diện thân thiện hơn và phù hợp với nhiều nhóm người dùng trong hệ thống.

Cuối cùng, giao diện phải phản ánh đúng nghiệp vụ thực tế của hệ thống thư viện điện tử. Với người dùng cuối, trọng tâm là tra cứu, xem trước, tải tài liệu, đánh giá sách và theo dõi lịch sử sử dụng. Với quản trị viên, trọng tâm là quản lý sách, tác giả, thể loại, vai trò và kiểm soát dữ liệu hiển thị trên hệ thống. Việc tổ chức giao diện theo đúng luồng nghiệp vụ giúp hệ thống vừa dễ dùng vừa dễ mở rộng về sau.

### 5.1.2. Nguyên tắc thiết kế cơ sở dữ liệu hỗ trợ giao diện (SQL Server)

Song song với phần giao diện, cơ sở dữ liệu Microsoft SQL Server được thiết kế để hỗ trợ việc hiển thị và xử lý dữ liệu một cách ổn định, chính xác và có khả năng mở rộng. Hệ thống sử dụng các bảng chính gồm Role, User, Author, Category, Book, Access_log, Rate, Book_Author và Book_Category. Cấu trúc này phản ánh đúng các thành phần cốt lõi của thư viện điện tử như người dùng, sách, tác giả, thể loại, lịch sử truy cập và đánh giá.

Nguyên tắc đầu tiên trong thiết kế cơ sở dữ liệu là chuẩn hóa dữ liệu. Các thông tin về tác giả, thể loại, vai trò và sách được tách thành các bảng riêng, liên kết với nhau thông qua khóa chính và khóa ngoại. Việc chuẩn hóa theo các mức 1NF, 2NF và 3NF giúp hạn chế dư thừa dữ liệu, tránh lặp lại thông tin nhiều lần và làm cho việc cập nhật dữ liệu nhất quán hơn.

Định nghĩa khóa chính và khóa ngoại được xây dựng rõ ràng cho từng bảng. Ví dụ, bảng Book sử dụng book_id làm khóa chính, bảng User sử dụng user_id, bảng Role sử dụng role_id, còn các bảng liên kết nhiều - nhiều như Book_Author và Book_Category sử dụng khóa chính ghép để đảm bảo không bị trùng cặp dữ liệu. Bảng Rate cũng sử dụng khóa chính ghép giữa user_id và book_id để đảm bảo một người dùng chỉ đánh giá một cuốn sách một lần. Những ràng buộc này giúp giao diện truy vấn và cập nhật dữ liệu chính xác hơn.

Để phục vụ cho các màn hình tìm kiếm và lọc dữ liệu, hệ thống cần chú trọng tối ưu truy vấn. Những cột thường được tra cứu như title, author_name, category_name, email, user_code hoặc các khóa ngoại liên quan đến book_id, user_id nên được đánh chỉ mục phù hợp. Điều này đặc biệt quan trọng ở các màn hình có số lượng bản ghi lớn như danh sách sách, danh sách đánh giá hoặc lịch sử truy cập của người dùng.

Tính toàn vẹn dữ liệu được đảm bảo bằng các ràng buộc CHECK, DEFAULT, UNIQUE và FOREIGN KEY. Ví dụ, điểm đánh giá được giới hạn trong khoảng từ 1 đến 5, email phải là duy nhất, isbn phải là duy nhất, các khóa ngoại phải tồn tại trước khi ghi dữ liệu liên quan. Những ràng buộc này giúp hệ thống từ chối các dữ liệu sai ngay từ tầng cơ sở dữ liệu thay vì đợi đến khi lỗi xuất hiện trên giao diện.

Về mặt bảo mật, cơ sở dữ liệu chỉ nên cấp các quyền cần thiết cho ứng dụng backend. Ứng dụng web chủ yếu sử dụng các quyền như SELECT, INSERT, UPDATE và chỉ thực hiện thao tác thông qua các truy vấn có tham số hóa. Trong hệ thống hiện tại, backend Node.js sử dụng thư viện mssql và truyền dữ liệu vào câu lệnh SQL thông qua request.input(...), từ đó giảm rủi ro SQL Injection và tăng độ an toàn cho dữ liệu.

Việc tổ chức dữ liệu cũng hỗ trợ trực tiếp cho thiết kế giao diện. Trang chủ cần lấy dữ liệu từ bảng Book kết hợp với Author và Category để hiển thị danh sách tài liệu và bộ lọc. Trang chi tiết sách cần truy xuất đầy đủ metadata như nhà xuất bản, năm xuất bản, số trang, định dạng tệp, kích thước tệp, file xem trước, số lượt tải và điểm đánh giá trung bình. Trang hồ sơ cá nhân cần kết hợp User với Access_log để hiển thị lịch sử sử dụng. Trang quản trị cần lấy dữ liệu tổng hợp từ nhiều bảng để phục vụ thêm mới, cập nhật và kiểm soát danh mục sách.

Đối với các danh sách dài, hệ thống cần định hướng phân trang và giới hạn số lượng dữ liệu trả về trong từng lần truy vấn để tránh gây chậm giao diện. Backend không nên sử dụng SELECT * một cách tùy tiện mà chỉ lấy các cột thực sự cần thiết cho từng màn hình. Cách tiếp cận này làm giảm dữ liệu truyền giữa SQL Server và frontend, từ đó cải thiện hiệu năng hiển thị.

Trong các nghiệp vụ có nhiều bước cập nhật liên quan với nhau, việc sử dụng transaction là cần thiết để đảm bảo tính nhất quán dữ liệu. Ví dụ, nếu sau này mở rộng hệ thống để xử lý quy trình mượn - trả đầy đủ, việc tạo bản ghi lịch sử, cập nhật trạng thái tài liệu và ghi log truy cập nên được thực hiện trong cùng một transaction để khi có lỗi xảy ra hệ thống có thể rollback toàn bộ.

## 5.2. Công cụ và công nghệ sử dụng

### 5.2.1. Công nghệ lập trình Backend và kết nối SQL Server

Node.js kết hợp với Express.js được sử dụng để xây dựng tầng backend cho hệ thống. Đây là môi trường phù hợp với các ứng dụng web hiện đại vì hỗ trợ lập trình bất đồng bộ, triển khai API nhanh và dễ tích hợp với frontend React. Trong dự án này, backend đảm nhiệm các chức năng như xác thực người dùng, phân quyền theo vai trò, truy vấn dữ liệu sách, ghi nhận lịch sử truy cập, tiếp nhận đánh giá và hỗ trợ quản trị dữ liệu.

Thư viện mssql được sử dụng để kết nối trực tiếp tới Microsoft SQL Server. Thông qua thư viện này, backend có thể thực hiện các thao tác CRUD với dữ liệu sách, tác giả, thể loại, người dùng và lịch sử truy cập. Việc sử dụng truy vấn tham số hóa giúp tăng tính an toàn khi truyền dữ liệu từ giao diện xuống cơ sở dữ liệu.

Ngoài ra, hệ thống còn sử dụng JWT để xác thực phiên đăng nhập và bcrypt để mã hóa mật khẩu người dùng. Cách tổ chức này giúp backend phù hợp với những hệ thống web quản lý dữ liệu có yêu cầu phân quyền rõ ràng như thư viện điện tử, cổng thông tin học tập hoặc hệ thống quản lý nội bộ trong trường đại học.

### 5.2.2. Công nghệ lập trình giao diện Frontend

ReactJS được sử dụng để xây dựng giao diện người dùng theo mô hình Single Page Application. Công nghệ này cho phép chuyển trang mượt mà, tái sử dụng component tốt và dễ tổ chức giao diện theo từng chức năng như trang chủ, trang chi tiết sách, trang hồ sơ cá nhân và trang quản trị.

React Router được dùng để điều hướng giữa các màn hình trong hệ thống. Nhờ đó, ứng dụng có thể phân chia rõ các khu vực như trang chủ, đăng nhập, about, trang hồ sơ, trang sách chi tiết và trang admin mà không cần tải lại toàn bộ trang web.

Tailwind CSS được sử dụng để xây dựng giao diện theo hướng utility-first, giúp kiểm soát tốt màu sắc, khoảng cách, kiểu chữ, kích thước và responsive. Điều này hỗ trợ nhóm triển khai giao diện nhanh hơn, đồng thời tạo được phong cách đồng bộ giữa các khu vực của hệ thống.

Vite được sử dụng làm công cụ build và môi trường phát triển frontend. Vite có tốc độ khởi động nhanh, hỗ trợ hot reload tốt và phù hợp với quá trình phát triển giao diện bằng React hiện đại. Ngoài ra, JavaScript được dùng để xử lý các tương tác như tìm kiếm, lọc dữ liệu, gửi biểu mẫu, hiển thị trạng thái loading và phản hồi kết quả từ API.

### 5.2.3. Công cụ hỗ trợ lập trình và vận hành

SQL Server Management Studio là công cụ chính dùng để tạo cơ sở dữ liệu, viết script, kiểm tra dữ liệu, theo dõi bảng và thực thi các câu lệnh SQL trong quá trình phát triển dự án.

Visual Studio Code được sử dụng làm môi trường lập trình chính cho cả frontend lẫn backend. Công cụ này phù hợp với dự án do hỗ trợ tốt JavaScript, React, Node.js và có hệ sinh thái extension phong phú.

Postman hỗ trợ kiểm thử API trong giai đoạn phát triển backend, giúp kiểm tra tính đúng đắn của các request như đăng nhập, lấy danh sách sách, xem chi tiết sách, gửi đánh giá và cập nhật dữ liệu quản trị.

Git và GitHub được sử dụng để quản lý phiên bản mã nguồn, hỗ trợ làm việc nhóm, lưu lịch sử thay đổi và đồng bộ source code giữa các thành viên.

NPM được dùng để quản lý thư viện và script chạy dự án. Thông qua các lệnh npm run dev, npm run build hoặc npm run check, nhóm có thể cài đặt phụ thuộc, chạy thử hệ thống và kiểm tra trạng thái source code một cách thuận tiện.

## 5.3. Thiết kế giao diện tổng quan

### 5.3.1. Mô tả tổng quan về giao diện hệ thống

Hệ thống thư viện điện tử được xây dựng nhằm phục vụ nhu cầu tra cứu, học tập và khai thác tài nguyên số trong môi trường đại học. Giao diện được thiết kế theo phong cách hiện đại, thân thiện với người dùng và ưu tiên hiển thị thông tin rõ ràng. Toàn bộ hệ thống hướng tới việc hỗ trợ người dùng tìm đúng tài liệu trong thời gian ngắn, đồng thời cung cấp cho quản trị viên một khu vực kiểm soát dữ liệu tập trung.

Về bố cục tổng thể, giao diện bao gồm thanh điều hướng ở phía trên, khu vực nội dung chính ở trung tâm và các nút thao tác nổi bật tại từng màn hình. Ở khu vực dành cho quản trị viên, giao diện bổ sung sidebar để điều hướng giữa các nhóm chức năng như quản lý sách, tác giả, thể loại và vai trò. Cách bố cục này giúp người dùng nhận diện nhanh các vùng chức năng và thao tác thuận tiện hơn.

Về mặt thẩm mỹ, hệ thống sử dụng tông màu sáng, dễ nhìn, kết hợp với các thẻ nội dung, biểu tượng và nút bấm rõ ràng. Các khối giao diện được phân tách hợp lý để tránh cảm giác chật chội. Phần typography được giữ đơn giản để phù hợp với một hệ thống học thuật và quản trị dữ liệu.

Về trải nghiệm người dùng, hệ thống hỗ trợ tìm kiếm sách theo tiêu đề, lọc theo tác giả và thể loại, xem thông tin chi tiết, tải tài liệu nếu được cho phép, đọc trước nội dung và gửi đánh giá. Sau khi đăng nhập, người dùng có thể xem thông tin tài khoản và lịch sử truy cập của mình. Đối với quản trị viên, giao diện cung cấp các công cụ để quản lý dữ liệu đầu vào của hệ thống một cách trực quan.

Giao diện cũng được xây dựng theo định hướng responsive để có thể hoạt động ổn định trên nhiều kích thước màn hình. Các thành phần như lưới sách, bộ lọc, bảng lịch sử và biểu mẫu quản trị được sắp xếp linh hoạt, đảm bảo khả năng sử dụng tốt trên laptop và điện thoại.

### 5.3.2. Danh sách các màn hình chính

#### 5.3.2.1. Giao diện trang chủ

Khi truy cập hệ thống, người dùng sẽ nhìn thấy giao diện trang chủ như bên dưới. Trang này hỗ trợ tìm kiếm sách theo tên, lọc theo tác giả và thể loại, đồng thời hiển thị danh sách sách để người dùng lựa chọn nhanh.

[Chèn ảnh giao diện trang chủ tại đây]

Hình 5.1. Giao diện trang chủ của hệ thống thư viện điện tử.

#### 5.3.2.2. Giao diện đăng nhập

Sau khi bấm vào chức năng đăng nhập, hệ thống sẽ hiển thị giao diện đăng nhập như bên dưới. Người dùng nhập email và mật khẩu để truy cập vào hệ thống theo đúng vai trò được cấp.

[Chèn ảnh giao diện đăng nhập tại đây]

Hình 5.2. Giao diện đăng nhập của hệ thống.

#### 5.3.2.3. Giao diện người dùng sau khi đăng nhập

Sau khi đăng nhập thành công bằng tài khoản người dùng, hệ thống sẽ hiển thị giao diện như bên dưới để người dùng có thể tìm kiếm, xem chi tiết và lựa chọn tài liệu phù hợp với nhu cầu học tập.

[Chèn ảnh giao diện người dùng sau khi đăng nhập tại đây]

Hình 5.3. Giao diện hiển thị đối với người dùng sau khi đăng nhập.

#### 5.3.2.4. Giao diện chi tiết sách, xem trước và đánh giá

Khi người dùng chọn một đầu sách, hệ thống sẽ chuyển đến trang chi tiết như bên dưới. Tại đây người dùng có thể xem đầy đủ thông tin sách, đọc trước tài liệu, tải xuống nếu được cho phép và gửi đánh giá hoặc nhận xét cho sách.

[Chèn ảnh giao diện chi tiết sách tại đây]

Hình 5.4. Giao diện chi tiết sách và khu vực đánh giá.

#### 5.3.2.5. Giao diện hồ sơ cá nhân và lịch sử truy cập

Sau khi truy cập vào hồ sơ cá nhân, hệ thống sẽ hiển thị giao diện như bên dưới. Trang này cho phép người dùng xem thông tin tài khoản và theo dõi lịch sử truy cập, lịch sử xem hoặc tải tài liệu trên hệ thống.

[Chèn ảnh giao diện hồ sơ cá nhân tại đây]

Hình 5.5. Giao diện hồ sơ cá nhân và lịch sử truy cập.

#### 5.3.2.6. Giao diện quản trị viên

Sau khi đăng nhập bằng tài khoản quản trị viên, hệ thống sẽ hiển thị giao diện như bên dưới. Cho phép quản trị viên thực hiện các chức năng quản lý sách, tác giả, thể loại, vai trò và cập nhật dữ liệu cần thiết cho thư viện điện tử.

[Chèn ảnh giao diện quản trị viên tại đây]

Hình 5.6. Giao diện quản trị viên của hệ thống.

## Kết luận chương

Chương V đã trình bày các nguyên tắc thiết kế giao diện, nguyên tắc tổ chức cơ sở dữ liệu hỗ trợ giao diện, các công nghệ được sử dụng và mô tả tổng quan những màn hình chính của hệ thống Online Library Management System. Việc kết hợp giữa ReactJS ở frontend, Node.js và Express ở backend cùng với SQL Server ở tầng dữ liệu giúp hệ thống có giao diện trực quan, dễ mở rộng và phù hợp với bài toán quản lý thư viện điện tử trong môi trường học tập hiện nay.
