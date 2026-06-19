# ☁️ CloudShare — Cloud-Based File Upload & Sharing System

A full-stack web application for uploading, managing, and sharing files securely using **AWS S3** cloud storage.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![AWS S3](https://img.shields.io/badge/AWS-S3-FF9900?logo=amazon-s3&logoColor=white)

---

## ✨ Features

- **User Authentication** — Register & login with JWT-based auth
- **File Upload** — Drag & drop or click to upload files (up to 10 MB)
- **File Management** — View, rename, and delete uploaded files
- **File Download** — Secure downloads via AWS S3 presigned URLs
- **File Sharing** — Generate shareable links for public files
- **Privacy Control** — Toggle file visibility between private & public
- **File Metadata** — Track file size, upload date, type, and owner
- **Search** — Filter files by name from the dashboard
- **Toast Notifications** — Elegant UI feedback for all actions
- **Responsive Design** — Works on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|:------|:-----------|
| **Frontend** | React 19 + Vite |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **File Storage** | AWS S3 |
| **Authentication** | JWT + bcrypt |
| **File Handling** | Multer (memory storage) |
| **Styling** | Vanilla CSS (dark theme) |

---

## 📁 Project Structure

```
FileSharing System/
├── server/                     # Backend API
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── s3.js               # AWS S3 client
│   ├── models/
│   │   ├── User.js             # User schema
│   │   └── File.js             # File metadata schema
│   ├── middleware/
│   │   ├── auth.js             # JWT verification
│   │   └── upload.js           # Multer config
│   ├── controllers/
│   │   ├── authController.js   # Auth logic
│   │   ├── fileController.js   # File CRUD logic
│   │   └── shareController.js  # Share link logic
│   ├── routes/
│   │   ├── auth.js
│   │   ├── files.js
│   │   └── share.js
│   ├── server.js               # Express entry point
│   ├── .env.example            # Environment template
│   └── package.json
│
├── client/                     # React Frontend
│   ├── public/
│   │   └── favicon.svg         # Custom app icon
│   ├── src/
│   │   ├── api/axios.js        # Axios instance
│   │   ├── context/AuthContext.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── FileCard.jsx
│   │   │   ├── UploadModal.jsx
│   │   │   ├── ConfirmModal.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── SharedFile.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher — [Download](https://nodejs.org/)
- **MongoDB Atlas** account (free tier) — [Sign up](https://www.mongodb.com/cloud/atlas)
- **AWS Account** with S3 access — [Sign up](https://aws.amazon.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/filesharing-system.git
cd filesharing-system
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create the `.env` file from the template:

```bash
cp .env.example .env
```

Fill in your credentials in `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://your_user:your_pass@cluster0.xxxxx.mongodb.net/filesharing
JWT_SECRET=any_long_random_string

AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=your-bucket-name
```

### 3. Setup Frontend

```bash
cd ../client
npm install
```

### 4. Run the Application

Open **two terminals**:

```bash
# Terminal 1 — Start Backend
cd server
npm run dev
```

```bash
# Terminal 2 — Start Frontend
cd client
npm run dev
```

### 5. Open in Browser

Visit **http://localhost:5173** and start using CloudShare!

---

## 🔑 AWS S3 Setup Guide

1. Go to [AWS Console](https://console.aws.amazon.com/) → Search **S3** → **Create bucket**
2. Choose a unique bucket name and your preferred region
3. Go to **IAM** → **Users** → **Create user**
4. Attach the **AmazonS3FullAccess** policy
5. Go to **Security credentials** → **Create access key**
6. Select **"Application running outside AWS"**
7. Copy the **Access Key ID** and **Secret Access Key** into your `.env`

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Login & receive JWT |
| GET | `/api/auth/me` | Get current user info |

### File Operations

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| GET | `/api/files` | List user's files |
| POST | `/api/files/upload` | Upload a file |
| GET | `/api/files/download/:id` | Get download URL |
| DELETE | `/api/files/:id` | Delete a file |
| PATCH | `/api/files/:id/rename` | Rename a file |
| PATCH | `/api/files/:id/visibility` | Toggle public/private |

### File Sharing

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| GET | `/api/share/:shareToken` | Access shared file |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Nikhil Vaghela**

---

> Built with ❤️ using Node.js, React, AWS S3, and MongoDB
