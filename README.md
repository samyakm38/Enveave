# Enveave - Digital Infrastructure for Environmental Action

![Hero Banner](./client/public/home-hero-section.png)

## About Enveave

Enveave is the **Digital Infrastructure** for societal initiatives, on a mission to become the collective platform for all initiatives that benefit society in India. We connect individuals, organizations, expert groups, academia, and industry on a unified platform to collaborate on meaningful opportunities across diverse sectors—driving social impact and collective progress.

> *"Let a Million Ideas Bloom for the Greater Good"*

## 🌿 Vision & Mission

### Vision
Our vision is for Enveave to become the go-to platform for all citizen-led and organizational initiatives that aim to create positive change in society. We aspire to be the main forum for anyone who wants to contribute their time, skills, or passion toward the greater good.

### Mission
Our mission is to connect volunteers with NGOs and organizations dedicated to non-commercial initiatives that benefit society. We strive to make it easier for individuals and groups to discover, engage with, and collaborate on meaningful opportunities that drive positive impact in India.

## 🚀 How It Works

![How It Works](./client/public/how-it-works-img-1.png)

1. **Connect**: Join our platform as a volunteer or an opportunity provider
2. **Discover**: Find opportunity that match your interests and skills
3. **Collaborate**: Work together with others who are passionate about creating positive social impact.
4. **Make an Impact**: Contribute to meaningful change across various societal causes.

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

- **Environmental Project Discovery**:  Browse and search for initiatives that benefit society
- **Volunteer Management**:  Register, apply, and track participation in opportunities
- **Organization Tools**: Create and manage opportunities for social impact
- **Success Stories**: Showcase impactful initiatives across various sectors
- **Authentication System**: Secure login and account management
- **Interactive Dashboard**: For volunteers, organizations, and admins
- **AI-Powered Support**: Chatbot for answering queries related to initiatives and opportunities

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