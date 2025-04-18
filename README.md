# Enveave - Digital Infrastructure for Environmental Action

![Hero Banner](./client/public/home-hero-section.png)

## About Enveave

Enveave is the **Digital Infrastructure** for environmental actions on a mission to become a collective for all environmental initiatives in India. We connect civil society, individuals, expert groups, academia, the research community, and industry on a common platform to collaborate on projects related to ecology and environment.

> *"Let a Million Environment Flowers Bloom"*

## 🌿 Vision & Mission

### Vision
Our vision is that Enveave will become the platform for all environmental initiatives by the citizens and organizations in India and the main forum for anyone who wants to contribute to the environment.

### Mission
Enveave aims to get together civil society, individuals, expert groups, academia, the research community, and industry on a common platform and provide a single place to collaborate on various projects related to Ecology and Environment. We aim to ease the launch and execution of such projects, large or small.

## 🚀 How It Works

![How It Works](./client/public/how-it-works-img-1.png)

1. **Connect**: Join our platform as a volunteer or an opportunity provider
2. **Discover**: Find environmental projects that match your interests and skills
3. **Collaborate**: Work together with others passionate about environmental action
4. **Make Impact**: Contribute to meaningful change for our environment

## 💻 Technical Overview

Enveave is built with a modern tech stack:

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- Cloud-based image storage with Cloudinary
- Email services with Nodemailer
- AI-powered chatbot support

### Frontend
- React 18
- Redux Toolkit for state management
- Tailwind CSS for styling
- React Router for navigation
- Form validation with React Hook Form and Zod
- Rich text editing with React Quill

## 🛠️ Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Getting Started

1. **Clone the repository**
   ```
   git clone https://github.com/SDOS-2025/Enveave.git
   cd enveave
   ```

2. **Install dependencies**
   ```
   npm install
   cd client && npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # Authentication
   JWT_SECRET=your_jwt_secret
   
   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Email (for notifications)
   EMAIL_SERVICE=your_email_service
   EMAIL_USER=your_email_user
   EMAIL_PASSWORD=your_email_password
   ```

4. **Run the development servers**

   Backend:
   ```
   npm run dev
   ```
   
   Frontend:
   ```
   cd client && npm run dev
   ```

5. **Seed the database (optional)**
   ```
   npm run seed
   ```

## 📱 Key Features

- **Environmental Project Discovery**: Browse and search for environmental initiatives
- **Volunteer Management**: Register, apply, and track participation in projects
- **Organization Tools**: Create and manage environmental opportunities
- **Success Stories**: Showcase impactful environmental projects
- **Authentication System**: Secure login and account management
- **Interactive Dashboard**: For volunteers, organizations, and admins
- **AI-Powered Support**: Chatbot for answering environmental queries

## 🧪 Testing

```
npm test
```

## 🤝 Contributing

We welcome contributions to Enveave! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the Apache License - see the LICENSE file for details.

---

<p align="center">
  <img src="./client/public/footer-background.png" alt="Enveave Footer" width="300">
  <br>
  <em>Building a sustainable future, together.</em>
</p>