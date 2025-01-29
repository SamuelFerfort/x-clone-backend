# X-Clone Backend

<p align="center">
  <img src="https://res.cloudinary.com/dy0av590l/image/upload/v1738120972/528shots_so_mjlvgc.png" alt="X-clone App screenshot" width="800"/>
</p>

<div align="center">
  
  ![Node.js](https://img.shields.io/badge/Node.js-18.x-43853D?style=for-the-badge&logo=node.js&logoColor=white)
  ![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
  ![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
  ![JWT](https://img.shields.io/badge/JWT-latest-000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
  ![Cloudinary](https://img.shields.io/badge/Cloudinary-latest-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
  
  <a href="https://x-social-media.vercel.app">View Demo</a>
  ·
  <a href="https://github.com/SamuelFerfort/x-clone-frontend">Frontend Repo</a>
  ·
  <a href="https://github.com/SamuelFerfort/x-clone-backend/issues">Report Bug</a>
</div>

Backend for the X-Clone application, built with Node.js and Express, managing user authentication, media uploads, and data storage with Prisma and PostgreSQL.

## 🔗 Links

- **Live Demo:** [https://x-social-media.vercel.app](https://x-social-media.vercel.app)
- **Frontend Repository:** [https://github.com/SamuelFerfort/x-clone-frontend](https://github.com/SamuelFerfort/x-clone-frontend)

## 🚀 Technologies

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JSON Web Tokens (JWT)
- **File Uploads:** Cloudinary

## 🌟 Features

- **User Authentication:** Secure registration and login using JWT.
- **Post Management:** Create, read, update, and delete posts with media attachments.
- **Media Uploads:** Handle image and GIF uploads via Cloudinary.
- **Follow System:** Enable users to follow and unfollow others.
- **Database Management:** Efficient data handling with Prisma ORM and PostgreSQL.
- **API Security:** Protect routes and ensure secure data transactions.

## 🔧 Setup

### 1. **Clone the Repository:**

```bash
git clone https://github.com/SamuelFerfort/x-clone-backend.git
cd x-clone-backend
```

### 2. **Install Dependencies:**

```bash
npm install
```

### 3. **Configure Environment Variables:**

```
DATABASE_URL=your_database_key
CLOUDINARY_API_KEY=cloudinary_api_key
CLOUDINARY_CLOUD_NAME=cloudinary_cloud_name
CLOUDINARY_API_SECRET=cloudinary_api_secret
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=your_client_url
```

### 4. **Set up the Database:**

```bash
npx prisma migrate dev --name init
```

### 5. **Start the Server:**

```bash
npm run devStart
```

The server should now be running on <http://localhost:3000>.

## 🎯 Goals

Designed to complement the X-Clone frontend, this backend project was made to practice building scalable APIs with Node.js and Express, managing databases with Prisma and PostgreSQL, handling media uploads with Cloudinary, and implementing secure authentication mechanisms using JWT.
