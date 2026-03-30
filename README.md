# 📄 Document Management System (DMS)

## 📌 Project Description

This is a **Document Management System (DMS)** built using the **MEAN stack (MongoDB, Express.js, Angular, Node.js)**.
It allows users to upload, search, view, and manage documents with authentication and secure access control.

---

## ✨ Features

* 📤 Upload documents (PDF, images, files)
* 🔍 Search documents using keywords
* 👤 User profile management
* 📄 View and edit documents
* 📅 Track document upload dates
* 🔐 Authentication & access control
* 📁 Organized document storage system

---

## 🛠️ Tech Stack

### Frontend

* Angular
* TypeScript
* HTML
* CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB

---

## 📂 Project Structure

```
dms-project/
│
├── frontend/        # Angular frontend
├── backend/         # Node.js backend
├── screenshots/     # Application screenshots
├── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/SAITHEJA-GUVVALA/Document-Management-System.git
cd Document-Management-System
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
node server.js
```

✅ Backend runs at:

```
http://localhost:8080
```

---

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
ng serve
```

✅ Frontend runs at:

```
http://localhost:4200
```

---

### 4️⃣ Open Application

```
http://localhost:4200
```

---

## 🔌 API Configuration

Update backend URL in:

```
src/app/services/api.service.ts
```

Example:

```ts
private baseUrl = 'http://localhost:8080/api';
```

---

## 🗄️ Database Setup

Make sure **MongoDB is running locally**

Start MongoDB:

```bash
mongod
```

Default URL:

```
mongodb://localhost:27017
```

---

## 📦 Versions Used

* Node.js v18+
* Angular v15+
* MongoDB v6+

---

## 📸 Screenshots

Screenshots of the application are stored in a separate folder:


## 🔐 Security Note

Sensitive data (API keys, secrets) are stored using **environment variables (.env)** and are not exposed in the source code.

---

## 🚀 Future Enhancements

* 📤 File sharing between users
* ☁️ Cloud storage integration
* 🔎 Advanced search filters
* 📊 Admin dashboard

---

## 👨‍💻 Author

**Saitheja Guvvala**
GitHub: https://github.com/SAITHEJA-GUVVALA

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
