# Task Manager - FlowState

A modern task management application built with React, Vite, and TailwindCSS.

## File Structure

```
Frontend/
├── public/
│   └── vite.svg                 # Vite logo
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── common/              # Generic components
│   │   │   ├── Button.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Loading.jsx
│   │   ├── layout/              # Layout components
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Footer.jsx
│   │   └── tasks/               # Task-specific components
│   │       ├── TaskList.jsx
│   │       ├── TaskItem.jsx
│   │       ├── TaskForm.jsx
│   │       ├── TaskFilter.jsx
│   │       └── TaskSearch.jsx
│   ├── pages/                   # Page components
│   │   ├── Dashboard.jsx
│   │   ├── AllTasks.jsx
│   │   ├── CompletedTasks.jsx
│   │   └── Settings.jsx
│   ├── hooks/                   # Custom React hooks
│   │   ├── useLocalStorage.js
│   │   ├── useTasks.js
│   │   └── useFilter.js
│   ├── utils/                   # Utility functions
│   │   ├── taskHelpers.js
│   │   ├── dateHelpers.js
│   │   └── constants.js
│   ├── context/                 # React context providers
│   │   └── TaskContext.jsx
│   ├── assets/                  # Static assets
│   │   ├── react.svg
│   │   └── icons/
│   ├── styles/                  # Additional CSS files
│   │   └── components.css
│   ├── App.jsx                  # Main App component
│   ├── App.css                  # App-specific styles
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── .gitignore                   # Git ignore rules
├── eslint.config.js             # ESLint configuration
├── index.html                   # HTML template
├── package.json                 # Dependencies and scripts
├── README.md                    # Project documentation
└── vite.config.js               # Vite configuration
```

## Component Hierarchy

```
App
├── Header
│   ├── TaskSearch
│   └── Settings Button
├── Sidebar
│   ├── Navigation Menu
│   └── TaskFilter
└── Main Content
    ├── Dashboard (default route)
    │   ├── TaskForm (add new task)
    │   ├── TaskList
    │   │   └── TaskItem (multiple)
    │   └── Statistics
    ├── AllTasks
    │   ├── TaskFilter
    │   └── TaskList
    ├── CompletedTasks
    │   └── TaskList
    └── Settings
        └── Configuration Options
```

## Features

- ✅ Create, edit, and delete tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Filter tasks by status, priority, or category
- ✅ Search functionality
- ✅ Local storage persistence
- ✅ Responsive design with TailwindCSS
- ✅ Dark/light theme support

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS 4** - Utility-first CSS framework
- **ESLint** - Code linting
- **Local Storage** - Data persistence

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Frontend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Task Data Structure

```javascript
{
  id: "unique-id",
  title: "Task title",
  description: "Task description",
  completed: false,
  priority: "high" | "medium" | "low",
  category: "work" | "personal" | "shopping",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  dueDate: "2024-01-01T00:00:00.000Z" // optional
}
```

## Development Guidelines

### Code Organization

- Keep components small and focused
- Use custom hooks for complex state logic
- Implement proper prop validation
- Follow consistent naming conventions
- Use TailwindCSS classes for styling

### State Management

- Use React Context for global state (tasks, filters)
- Use local state for component-specific data
- Implement custom hooks for reusable logic

### Styling

- Use TailwindCSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and typography
- Implement dark/light theme support

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

This project is licensed under the MIT License.
```