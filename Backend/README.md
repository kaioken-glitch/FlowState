# FlowState Backend

A lightweight, JSON-based backend server for the FlowState task management application. This backend provides RESTful APIs for task management without requiring a database setup, making it perfect for development and small-scale deployments.

## 🚀 Features

- **JSON File Storage**: Simple file-based data persistence
- **RESTful API**: Clean REST endpoints for task operations
- **CORS Enabled**: Frontend-backend communication ready
- **Minimal Dependencies**: Lightweight setup with essential packages only
- **Development Ready**: Hot reload with nodemon
- **Extensible**: Easy to migrate to database when needed

## 📁 Project Structure

```
Backend/
├── data/                   # JSON data storage
│   ├── tasks.json         # Task data storage
│   └── users.json         # User data storage (future use)
├── utils/                 # Utility functions
│   └── fileHandler.js     # JSON file operations handler
├── routes/                # API route definitions
│   ├── tasks.js          # Task-related endpoints
│   └── auth.js           # Authentication endpoints (future use)
├── middleware/            # Express middleware
│   └── auth.js           # Authentication middleware (future use)
├── .env                  # Environment variables
├── server.js             # Main server file
├── package.json          # Project dependencies and scripts
└── README.md             # Project documentation
```

## 📄 File Descriptions

### Core Files

#### `server.js`
The main entry point of the application. Sets up the Express server, configures middleware (CORS, JSON parsing), defines routes, and starts the server on the specified port.

#### `package.json`
Defines project metadata, dependencies, and npm scripts. Contains minimal dependencies required for a JSON-based backend including Express, CORS, and development tools.

#### `.env`
Environment configuration file containing:
- `PORT`: Server port number (default: 5000)
- `JWT_SECRET`: Secret key for authentication (future use)
- `NODE_ENV`: Environment mode (development/production)

### Data Layer

#### `data/tasks.json`
JSON file that stores all task data. Each task contains:
- `id`: Unique identifier
- `title`: Task description
- `priority`: Task priority (high/medium/low)
- `dueDate`: Task deadline in ISO format
- `completed`: Boolean completion status
- `createdAt`: Creation timestamp
- `updatedAt`: Last modification timestamp

#### `data/users.json`
Reserved for future user authentication data storage.

### Utilities

#### `utils/fileHandler.js`
A utility class that handles all JSON file operations:
- **`read()`**: Reads and parses JSON data from file
- **`write(data)`**: Writes data to JSON file with formatting
- **`append(newItem)`**: Adds new item with auto-generated ID
- **`update(id, updates)`**: Updates existing item by ID
- **`delete(id)`**: Removes item by ID

Handles file creation, error handling, and maintains data integrity.

### API Routes

#### `routes/tasks.js`
Defines all task-related API endpoints:
- **`GET /api/tasks`**: Retrieve all tasks
- **`POST /api/tasks`**: Create a new task
- **`PUT /api/tasks/:id`**: Update existing task
- **`DELETE /api/tasks/:id`**: Delete task by ID

Each endpoint includes proper error handling and HTTP status codes.

#### `routes/auth.js`
Reserved for future authentication endpoints (login, register, logout).

### Middleware

#### `middleware/auth.js`
Reserved for future JWT authentication middleware to protect routes.

## 🛠 Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Start production server:**
   ```bash
   npm start
   ```

## 📡 API Endpoints

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### Example Usage

**Create Task:**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "priority": "high",
    "dueDate": "2025-07-20T15:00:00",
    "completed": false
  }'
```

**Get All Tasks:**
```bash
curl http://localhost:5000/api/tasks
```

## 🔧 Configuration

### Environment Variables

- `PORT`: Server port (default: 5000)
- `JWT_SECRET`: Secret for JWT tokens
- `NODE_ENV`: Environment mode

### Data Format

Tasks follow this schema:
```json
{
  "id": 1,
  "title": "Task description",
  "priority": "high|medium|low",
  "dueDate": "ISO date string",
  "completed": false,
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

## 🚀 Future Enhancements

- [ ] User authentication system
- [ ] Task categories and tags
- [ ] File attachments
- [ ] Task comments and notes
- [ ] Database migration (MongoDB/PostgreSQL)
- [ ] Real-time updates with WebSockets
- [ ] Task notifications and reminders

## 📝 Development Notes

This backend is designed to be:
- **Simple**: Minimal setup with JSON storage
- **Scalable**: Easy to migrate to database
- **Maintainable**: Clean code structure
- **Testable**: Modular design for easy testing

Perfect for prototyping, development, and small-scale deployments before scaling to a full database solution.