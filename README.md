# 🎯 FlowState - Task Management Application

<div align="center">
  <img src="./Frontend/src/assets/logo.svg" alt="Duo Logo" width="100" height="100">
  
  **A modern, intuitive task management application built with React and Node.js**
  
  [![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-16.x-green.svg)](https://nodejs.org/)
  [![Express](https://img.shields.io/badge/Express-4.x-black.svg)](https://expressjs.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38bdf8.svg)](https://tailwindcss.com/)
</div>

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

**Duo** is a comprehensive task management application designed to help individuals and teams organize, track, and complete their tasks efficiently. With a sleek dark-themed interface and powerful analytics, Duo provides insights into productivity patterns while maintaining simplicity and ease of use.

### ✨ Key Highlights

- 🎨 **Modern Dark UI** - Sleek, professional interface with smooth animations
- 📊 **AI-Powered Analytics** - Get intelligent insights about your productivity
- 🏆 **Achievement Tracking** - Celebrate completed tasks and milestones
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- ⚡ **Real-time Updates** - Instant synchronization across all operations

---

## 🚀 Features

### 📋 Task Management
- ✅ Create, edit, and delete tasks
- 🏷️ Categorize tasks with custom categories
- 🎯 Set priority levels (High, Medium, Low)
- 📅 Due date tracking with overdue indicators
- 👤 Task assignment capabilities
- ✔️ Mark tasks as complete/incomplete

### 📈 Analytics & Insights
- 📊 **Productivity Dashboard** - View completion rates and trends
- 📅 **Weekly Performance** - Track progress over time
- 🤖 **AI Recommendations** - Get personalized productivity tips
- 📈 **Visual Charts** - Priority distribution and category breakdown
- 🎯 **Performance Score** - Overall productivity rating

### 🏆 Achievement System
- 🎉 **Completed Tasks View** - Celebrate your accomplishments
- 📊 **Completion Statistics** - Daily, weekly, and monthly metrics
- 🔄 **Task Recovery** - Undo completion if needed
- 🗑️ **Archive Management** - Clean up completed tasks

### 🎨 User Experience
- 🌙 **Dark Theme** - Easy on the eyes with professional aesthetics
- 📱 **Responsive Layout** - Perfect on all screen sizes
- ⚡ **Fast Performance** - Optimized for speed and efficiency
- 🔍 **Smart Filtering** - Find tasks quickly with multiple filters

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern JavaScript library for building user interfaces
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **React Icons** - Comprehensive icon library
- **React Router** - Client-side routing for single-page application

### Backend
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Fast, unopinionated web framework
- **File System Storage** - JSON-based data persistence
- **CORS** - Cross-origin resource sharing configuration

### Development Tools
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and quality enforcement
- **Git** - Version control system

---

## 🏁 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v16.0 or higher)
- **npm** (v7.0 or higher)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/duo.git
   cd duo
   ```

2. **Install Backend Dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../Frontend
   npm install
   ```

4. **Set Up Environment Variables**
   
   Create a `.env` file in the Frontend directory:
   ```properties
   REACT_APP_API_URL=http://localhost:5000/api
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd Backend
   npm start
   ```
   The backend will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd Frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

3. **Open your browser** and navigate to `http://localhost:3000`

### Build for Production

```bash
cd Frontend
npm run build
```

---

## 📁 Project Structure

```
Duo/
├── Frontend/                 # React frontend application
│   ├── public/              # Static assets
│   │   └── favicon.ico      # App logo/icon
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Tasks.jsx    # Main task management
│   │   │   ├── Analytics.jsx # Analytics dashboard
│   │   │   └── CompletedTasks.jsx # Achievement view
│   │   ├── services/        # API service layer
│   │   │   └── api.js       # API communication
│   │   └── App.jsx          # Main application component
│   └── package.json         # Frontend dependencies
├── Backend/                 # Node.js backend API
│   ├── data/               # JSON data storage
│   │   └── tasks.json      # Task data persistence
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── .env                    # Environment variables
└── README.md              # Project documentation
```

---

## 🔌 API Endpoints

### Tasks Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Retrieve all tasks |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:id` | Update an existing task |
| `DELETE` | `/api/tasks/:id` | Delete a task |

### Example API Usage

**Create a new task:**
```javascript
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API docs",
  "priority": "high",
  "category": "Work",
  "dueDate": "2024-01-15",
  "assignedTo": "John Doe"
}
```

**Response:**
```javascript
{
  "id": "uuid-string",
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API docs",
  "priority": "high",
  "category": "Work",
  "dueDate": "2024-01-15",
  "assignedTo": "John Doe",
  "completed": false,
  "createdAt": "2024-01-10T10:00:00.000Z",
  "updatedAt": "2024-01-10T10:00:00.000Z"
}
```

---

## 🚀 Deployment

### Deploy to Render

1. **Backend Deployment**
   - Create a new Web Service on [Render](https://render.com)
   - Connect your GitHub repository
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Add environment variables as needed

2. **Frontend Deployment**
   - Create a new Static Site on Render
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Add environment variable: `REACT_APP_API_URL=https://your-backend.onrender.com/api`

3. **Update CORS Configuration**
   ```javascript
   // In Backend/server.js
   app.use(cors({
     origin: [
       'http://localhost:3000',
       'https://your-frontend.onrender.com' // Add your deployed frontend URL
     ],
     credentials: true
   }))
   ```

### Environment Variables for Production

```properties
# Frontend (.env)
REACT_APP_API_URL=https://your-backend.onrender.com/api

# Backend (Render Dashboard)
NODE_ENV=production
FRONTEND_URL=https://your-frontend.onrender.com
```

---

## 🤝 Contributing

We welcome contributions to Duo! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Test your changes thoroughly before submitting
- Update documentation if needed

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React Team** - For the amazing React library
- **Tailwind CSS** - For the utility-first CSS framework
- **React Icons** - For the comprehensive icon library
- **Express.js** - For the fast and minimal web framework

---

## 📞 Support

If you have any questions, suggestions, or issues:

- 🐛 **Report bugs** by opening an issue
- 💡 **Request features** through GitHub issues
- 📧 **Contact** the development team

---

<div align="center">
  <p>Made with ❤️ by the Duo Team</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>