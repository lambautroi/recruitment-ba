# Job Seeker Backend - Hệ thống Tuyển dụng Việc làm

## 📋 Tổng quan

Backend API của hệ thống tuyển dụng việc làm được xây dựng bằng Node.js và Express.js, cung cấp RESTful APIs cho việc quản lý ứng viên, nhà tuyển dụng và tin tuyển dụng.

## 🚀 Tính năng chính

### 🔐 Authentication & Authorization

-   **JWT-based authentication** với role-based access control
-   **Multi-role system**: Candidate, Employer, Admin
-   **Protected routes** với middleware xác thực
-   **Session management** và token refresh

### 👤 Quản lý Ứng viên (Candidates)

-   **Profile management**: CRUD operations cho thông tin cá nhân
-   **File upload**: Avatar (2MB) và CV (5MB) với validation
-   **Job applications**: Ứng tuyển với cover letter
-   **Saved jobs**: Lưu và quản lý công việc yêu thích
-   **Application tracking**: Theo dõi trạng thái ứng tuyển

### 🏢 Quản lý Nhà tuyển dụng (Employers)

-   **Company profile**: Quản lý thông tin doanh nghiệp
-   **Job posting**: Tạo, chỉnh sửa, xóa tin tuyển dụng
-   **Applicant management**: Xem và quản lý ứng viên
-   **Status control**: Cập nhật trạng thái tin tuyển dụng và ứng tuyển
-   **Logo upload**: Upload và quản lý logo công ty

### ⚙️ Quản trị hệ thống (Admin)

-   **User management**: CRUD operations cho users
-   **Statistics**: Thống kê tổng quan hệ thống
-   **Homepage settings**: Cấu hình nội dung trang chủ
-   **Data analytics**: Báo cáo và phân tích

## 🛠 Công nghệ sử dụng

-   **Runtime**: Node.js 16+
-   **Framework**: Express.js 4.18.0
-   **Database**: MongoDB với Mongoose ODM
-   **Authentication**: JSON Web Tokens (JWT)
-   **File Upload**: Multer middleware
-   **Security**: bcryptjs, CORS
-   **Development**: Faker.js cho mock data

## 📁 Cấu trúc thư mục

```
src/
├── app.js                  # Main application setup
├── config/
│   └── config.js          # Database và environment config
├── controllers/           # Business logic controllers
├── middleware/
│   └── auth.js           # JWT authentication middleware
├── models/               # MongoDB schemas
│   ├── userModel.js      # User authentication
│   ├── candidateModel.js # Candidate profiles
│   ├── employerModel.js  # Employer profiles
│   ├── jobModel.js       # Job postings
│   ├── applicationModel.js # Job applications
│   └── ...               # Other models
├── routes/               # API routes
│   ├── auth.js          # Authentication endpoints
│   ├── candidateRoutes.js # Candidate APIs
│   ├── employerJobs.js   # Employer job management
│   ├── employerProfile.js # Employer profile
│   ├── jobpage.js        # Public job listings
│   ├── stats.js          # Statistics APIs
│   └── ...               # Other routes
├── mock-data/            # Mock data generation
│   ├── db.js            # Database connection
│   ├── populateDB.js    # Data population script
│   └── mock*.js         # Mock data generators
├── services/             # Business services
├── utils/                # Utility functions
└── uploads/              # File storage
    ├── candidates/       # Candidate files
    │   ├── avatars/     # Profile pictures
    │   └── cvs/         # Resume files
    └── logos/           # Company logos
```

## 🚦 Cài đặt và Chạy dự án

### Yêu cầu hệ thống

-   Node.js >= 16.0.0
-   MongoDB >= 4.4
-   npm >= 8.0.0

### Cài đặt

```bash
# Clone repository
git clone [repository-url]
cd recruitment-ba

# Cài đặt dependencies
npm install
```

### Cấu hình Environment

Tạo file `.env` trong thư mục root:

```env
# Database
MONGO_URI=mongodb://localhost:27017/recruitment

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Server
PORT=3001
NODE_ENV=development

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### Chạy ứng dụng

```bash
# Development mode
npm start

# Development với nodemon
npm run dev

# Production mode
NODE_ENV=production npm start
```

Server sẽ chạy trên `http://localhost:3001`

## 📊 Database Schema

### Core Collections

#### Users

```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  role: String (enum: ['user', 'employer', 'admin']),
  createdAt: Date,
  updatedAt: Date
}
```

#### Candidates

```javascript
{
  _id: ObjectId,
  full_name: String,
  email: String (ref: Users),
  phone: String,
  address: String,
  birth_date: Date,
  gender: String,
  profile_picture: String,
  resume_file: String,
  location_id: ObjectId (ref: Locations),
  position_id: ObjectId (ref: Positions),
  category_id: ObjectId (ref: Categories),
  skills: [String],
  status: String (enum: ['active', 'inactive'])
}
```

#### Employers

```javascript
{
  _id: ObjectId,
  employer_name: String,
  email: String (ref: Users),
  phone: String,
  employer_logo: String,
  employer_description: String,
  contact_info: Object,
  num_job: Number,
  category_id: ObjectId (ref: Categories),
  location_id: ObjectId (ref: Locations)
}
```

#### Jobs

```javascript
{
  _id: ObjectId,
  title: String,
  employer_id: ObjectId (ref: Employers),
  category_id: ObjectId (ref: Categories),
  location_id: ObjectId (ref: Locations),
  salary_range: String,
  job_description: Object,
  expiration_date: Date,
  status: String (enum: ['active', 'inactive']),
  posted_at: Date
}
```

#### Applications

```javascript
{
  _id: ObjectId,
  job_id: ObjectId (ref: Jobs),
  candidate_id: ObjectId (ref: Candidates),
  cover_letter: String,
  applied_date: Date,
  status: String (enum: ['pending', 'applied', 'accepted', 'rejected']),
  notes: String
}
```

## 🔌 API Endpoints

### Authentication

```
POST   /api/auth/register     # Đăng ký tài khoản
POST   /api/auth/login        # Đăng nhập
GET    /api/auth/users        # Lấy danh sách users (admin)
```

### Candidates

```
GET    /api/candidate/profile           # Lấy thông tin profile
PUT    /api/candidate/profile           # Cập nhật profile
POST   /api/candidate/upload-avatar     # Upload avatar
POST   /api/candidate/upload-cv         # Upload CV
DELETE /api/candidate/delete-avatar     # Xóa avatar
DELETE /api/candidate/delete-cv         # Xóa CV
GET    /api/candidate/applied-jobs      # Lấy jobs đã ứng tuyển
POST   /api/candidate/apply-job         # Ứng tuyển job
GET    /api/candidate/saved-jobs        # Lấy jobs đã lưu
POST   /api/candidate/save-job          # Lưu job
DELETE /api/candidate/saved-jobs/:id    # Xóa job đã lưu
```

### Employers

```
GET    /api/employer/profile            # Lấy thông tin công ty
PUT    /api/employer/profile            # Cập nhật thông tin công ty
POST   /api/employer/upload-logo        # Upload logo
GET    /api/employer/jobs               # Lấy danh sách tin tuyển dụng
POST   /api/employer/jobs               # Tạo tin tuyển dụng mới
GET    /api/employer/jobs/:id           # Lấy chi tiết tin tuyển dụng
PUT    /api/employer/jobs/:id           # Cập nhật tin tuyển dụng
DELETE /api/employer/jobs/:id           # Xóa tin tuyển dụng
GET    /api/employer/jobs/:id/applicants # Lấy danh sách ứng viên
PUT    /api/employer/jobs/applications/:id/status # Cập nhật trạng thái ứng tuyển
```

### Public APIs

```
GET    /api/jobs                # Lấy danh sách công việc (có filter)
GET    /api/jobs/:id            # Lấy chi tiết công việc
GET    /api/categories          # Lấy danh mục nghề nghiệp
GET    /api/locations           # Lấy danh sách địa điểm
GET    /api/stats/overview      # Thống kê tổng quan
```

## 🔒 Authentication Flow

### 1. Registration

```javascript
// Request
POST /api/auth/register
{
  "fullName": "Nguyen Van A",
  "email": "user@example.com",
  "phone": "0123456789",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "user" // or "employer"
}

// Response
{
  "message": "Đăng ký thành công!",
  "role": "user",
  "redirect": "/candidate/dashboard"
}
```

### 2. Login

```javascript
// Request
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f...",
    "fullName": "Nguyen Van A",
    "email": "user@example.com",
    "role": "user"
  },
  "redirect": "/candidate/dashboard"
}
```

### 3. Protected Routes

```javascript
// Header required
Authorization: Bearer <token>

// Middleware validates và thêm user info vào req.user
req.user = {
  id: "64f...",
  email: "user@example.com",
  role: "user",
  fullName: "Nguyen Van A"
}
```

## 📤 File Upload

### Cấu hình Upload

```javascript
// Avatar upload
- Max size: 2MB
- Allowed types: JPEG, PNG, GIF
- Storage: /uploads/candidates/avatars/

// CV upload
- Max size: 5MB
- Allowed types: PDF, DOC, DOCX
- Storage: /uploads/candidates/cvs/

// Logo upload
- Max size: 2MB
- Allowed types: JPEG, PNG, GIF
- Storage: /uploads/logos/
```

### Upload Example

```javascript
// Multipart form data
const formData = new FormData();
formData.append("avatar", file);

fetch("/api/candidate/upload-avatar", {
    method: "POST",
    headers: {
        Authorization: `Bearer ${token}`,
    },
    body: formData,
});
```

## 🎯 Business Logic

### Job Application Flow

1. **Check Authentication**: User phải đăng nhập
2. **Validate Candidate**: Tìm candidate record
3. **Check CV**: Candidate phải có CV
4. **Check Duplicate**: Không được ứng tuyển trùng lặp
5. **Create Application**: Tạo application record
6. **Return Success**: Thông báo thành công

### Employer Job Management

1. **Authentication**: Employer role required
2. **Find Employer**: Tìm employer theo email
3. **Authorization**: Chỉ được quản lý jobs của mình
4. **CRUD Operations**: Create, Read, Update, Delete
5. **Applicant Management**: Xem và cập nhật trạng thái ứng viên

## 📈 Performance & Optimization

### Database Optimization

```javascript
// Indexing
- Users: email (unique)
- Candidates: email (unique)
- Employers: email (unique)
- Applications: job_id + candidate_id (compound)

// Aggregation Pipeline
- Job statistics với applicant count
- Category statistics với job count
- Employer statistics với application count
```

### Query Optimization

```javascript
// Populate specific fields
.populate('category_id', 'category_name')
.populate('location_id', 'location_name')

// Limit và pagination
.limit(parseInt(limit))
.skip((page - 1) * limit)

// Sort options
.sort({ createdAt: -1 }) // Newest first
```

## 🗃 Mock Data Generation

### Data Generation Script

```bash
# Chạy script tạo mock data
cd src/mock-data
node populateDB.js

# Tạo từng loại data riêng biệt
node mockUsers.js
node mockEmployers.js
node mockJobs.js
node mockApplications.js
```

### Mock Data Statistics

-   **Users**: 50 users (candidates + employers + admins)
-   **Candidates**: Auto-generated từ users với role "user"
-   **Employers**: Auto-generated từ users với role "employer"
-   **Jobs**: 100+ job postings
-   **Applications**: 200+ applications với realistic data
-   **Categories**: 20 industry categories
-   **Locations**: 63 provinces của Việt Nam

## 🐛 Error Handling

### Consistent Error Response

```javascript
// Validation Error
{
  "message": "Validation error",
  "error": "Detailed error message",
  "details": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}

// Authentication Error
{
  "message": "Access denied",
  "error": "Token không hợp lệ"
}

// Server Error
{
  "message": "Server error",
  "error": "Internal server error details"
}
```

### Error Types

-   **ValidationError**: MongoDB validation fails
-   **CastError**: Invalid ObjectId format
-   **TokenExpiredError**: JWT token expired
-   **JsonWebTokenError**: Invalid JWT token
-   **MulterError**: File upload errors

## 🔧 Development Tools

### Testing

```bash
# API testing với Postman
# Import collection: recruitment-api.postman_collection.json

# Manual testing endpoints
curl -X GET http://localhost:3001/api/jobs
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Debugging

```javascript
// Environment variables
DEBUG=app:* npm start

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});
```

## 🚀 Deployment

### Production Setup

```bash
# Environment
NODE_ENV=production
PORT=3001

# Process manager
pm2 start src/app.js --name "recruitment-api"

# Nginx reverse proxy
location /api {
    proxy_pass http://localhost:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

### Docker Setup

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 📚 API Documentation

### Postman Collection

-   Import file: `recruitment-api.postman_collection.json`
-   Environment: `recruitment-local.postman_environment.json`
-   Includes: All endpoints với examples và tests

### Swagger Documentation

```javascript
// Access tại: http://localhost:3001/api-docs
// Auto-generated từ route comments
```

## 🛡 Security Best Practices

### Authentication Security

-   **Password Hashing**: bcrypt với salt rounds 10
-   **JWT Expiration**: 7 days expiry
-   **Token Storage**: Client-side localStorage
-   **Route Protection**: Middleware validation

### Input Validation

-   **File Upload**: Type và size validation
-   **Data Sanitization**: MongoDB injection prevention
-   **CORS Configuration**: Frontend origin only
-   **Rate Limiting**: API calls limitation

## 📞 Support & Documentation

### Development Team

-   **Backend Developer**: [Your Name]
-   **Database Designer**: [Your Name]
-   **API Architect**: [Your Name]

### Resources

-   **MongoDB Documentation**: https://docs.mongodb.com/
-   **Express.js Guide**: https://expressjs.com/
-   **JWT Best Practices**: https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/
-   **Multer Documentation**: https://github.com/expressjs/multer

### Issues & Support

-   **GitHub Issues**: [repository-issues-url]
-   **Email**: [support-email]
-   **Documentation**: [docs-url]

---

**Developed with ❤️ using Node.js & MongoDB**
