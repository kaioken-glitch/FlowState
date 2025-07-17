const express = require('express')
const cors = require('cors')
const fs = require('fs').promises
const path = require('path')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

// Path to tasks.json file
const TASKS_FILE = path.join(__dirname, 'data', 'tasks.json')

// CORS Configuration
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:5173', 
    'http://127.0.0.1:5173',
    'https://flowstate-1.onrender.com', // Your actual frontend URL
    process.env.FRONTEND_URL || 'https://flowstate-1.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

// Handle preflight requests
app.options('*', cors())

// Middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// File system helper functions
const ensureDataDirectory = async () => {
  const dataDir = path.dirname(TASKS_FILE)
  try {
    await fs.access(dataDir)
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(dataDir, { recursive: true })
      console.log('Created data directory:', dataDir)
    }
  }
}

const getSampleTasks = () => [
  {
    id: 1,
    title: "Complete project proposal",
    description: "Write comprehensive project proposal for Q2",
    category: "Work",
    priority: "high",
    dueDate: "2025-07-20T15:30",
    estimatedTime: "4",
    assignedTo: "John Doe",
    tags: "project,urgent,proposal",
    status: "in-progress",
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Review team feedback",
    description: "Go through team feedback on last sprint",
    category: "Work",
    priority: "medium",
    dueDate: "2025-07-18T10:00",
    estimatedTime: "2",
    assignedTo: "Self",
    tags: "review,team",
    status: "todo",
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const readTasks = async () => {
  try {
    await ensureDataDirectory()
    
    // Check if file exists
    try {
      await fs.access(TASKS_FILE)
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('Tasks file does not exist, creating with sample data...')
        const sampleTasks = getSampleTasks()
        await writeTasks(sampleTasks)
        return sampleTasks
      }
    }
    
    // Read file content
    const data = await fs.readFile(TASKS_FILE, 'utf8')
    
    // Check if file is empty or contains only whitespace
    if (!data || data.trim().length === 0) {
      console.log('Tasks file is empty, initializing with sample data...')
      const sampleTasks = getSampleTasks()
      await writeTasks(sampleTasks)
      return sampleTasks
    }
    
    // Try to parse JSON
    try {
      const tasks = JSON.parse(data)
      
      // Validate that it's an array
      if (!Array.isArray(tasks)) {
        console.log('Tasks file contains invalid data, reinitializing...')
        const sampleTasks = getSampleTasks()
        await writeTasks(sampleTasks)
        return sampleTasks
      }
      
      return tasks
    } catch (parseError) {
      console.log('Tasks file contains invalid JSON, reinitializing...')
      console.log('Parse error:', parseError.message)
      const sampleTasks = getSampleTasks()
      await writeTasks(sampleTasks)
      return sampleTasks
    }
    
  } catch (error) {
    console.error('Error reading tasks file:', error.message)
    // If all else fails, return sample tasks
    console.log('Falling back to sample data...')
    const sampleTasks = getSampleTasks()
    await writeTasks(sampleTasks)
    return sampleTasks
  }
}

const writeTasks = async (tasks) => {
  try {
    await ensureDataDirectory()
    
    // Validate input
    if (!Array.isArray(tasks)) {
      throw new Error('Tasks must be an array')
    }
    
    // Write to temporary file first, then rename (atomic operation)
    const tempFile = TASKS_FILE + '.tmp'
    await fs.writeFile(tempFile, JSON.stringify(tasks, null, 2), 'utf8')
    await fs.rename(tempFile, TASKS_FILE)
    
    console.log(`✅ Successfully wrote ${tasks.length} tasks to file`)
  } catch (error) {
    console.error('Error writing tasks file:', error)
    throw error
  }
}

// Basic routes
app.get('/', (req, res) => {
  res.json({
    message: 'FlowState API is running!',
    version: '1.0.0',
    endpoints: {
      tasks: '/api/tasks',
      health: '/api/health',
      stats: '/api/tasks/stats/overview'
    }
  })
})

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    tasksFile: TASKS_FILE
  })
})

// Tasks statistics endpoint (MUST be before /:id route)
app.get('/api/tasks/stats/overview', async (req, res) => {
  console.log('GET /api/tasks/stats/overview called')
  try {
    const tasks = await readTasks()
    
    const stats = {
      total: tasks.length,
      completed: tasks.filter(task => task.completed).length,
      pending: tasks.filter(task => !task.completed).length,
      overdue: tasks.filter(task => 
        new Date(task.dueDate) < new Date() && !task.completed
      ).length,
      byPriority: {
        high: tasks.filter(task => task.priority === 'high').length,
        medium: tasks.filter(task => task.priority === 'medium').length,
        low: tasks.filter(task => task.priority === 'low').length
      },
      byStatus: {
        todo: tasks.filter(task => task.status === 'todo').length,
        'in-progress': tasks.filter(task => task.status === 'in-progress').length,
        review: tasks.filter(task => task.status === 'review').length,
        blocked: tasks.filter(task => task.status === 'blocked').length,
        completed: tasks.filter(task => task.status === 'completed').length
      },
      byCategory: {}
    }

    // Calculate category distribution
    tasks.forEach(task => {
      const category = task.category || 'Uncategorized'
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1
    })
    
    res.json(stats)
  } catch (error) {
    console.error('Error fetching statistics:', error)
    res.status(500).json({ 
      error: 'Failed to fetch statistics',
      message: error.message 
    })
  }
})

// Get all tasks with optional filtering
app.get('/api/tasks', async (req, res) => {
  console.log('GET /api/tasks called with query:', req.query)
  try {
    const { search, category, priority, status, completed } = req.query
    let tasks = await readTasks()

    // Apply filters
    if (search) {
      const searchTerm = search.toLowerCase()
      tasks = tasks.filter(task => 
        task.title?.toLowerCase().includes(searchTerm) ||
        task.description?.toLowerCase().includes(searchTerm) ||
        task.tags?.toLowerCase().includes(searchTerm) ||
        task.category?.toLowerCase().includes(searchTerm)
      )
    }

    if (category) {
      tasks = tasks.filter(task => task.category === category)
    }

    if (priority) {
      tasks = tasks.filter(task => task.priority === priority)
    }

    if (status) {
      tasks = tasks.filter(task => task.status === status)
    }

    if (completed !== undefined) {
      const isCompleted = completed === 'true'
      tasks = tasks.filter(task => task.completed === isCompleted)
    }

    // Sort by creation date (newest first)
    tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    console.log(`Returning ${tasks.length} tasks`)
    res.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({ 
      error: 'Failed to fetch tasks',
      message: error.message 
    })
  }
})

// Get single task by ID
app.get('/api/tasks/:id', async (req, res) => {
  console.log('GET /api/tasks/:id called with:', req.params.id)
  try {
    const tasks = await readTasks()
    const task = tasks.find(t => t.id === parseInt(req.params.id))
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }
    
    res.json(task)
  } catch (error) {
    console.error('Error fetching task:', error)
    res.status(500).json({ 
      error: 'Failed to fetch task',
      message: error.message 
    })
  }
})

// Create new task
app.post('/api/tasks', async (req, res) => {
  console.log('POST /api/tasks called with:', req.body)
  try {
    const {
      title,
      description = '',
      category = '',
      priority = 'medium',
      dueDate,
      estimatedTime = '',
      assignedTo = 'Self',
      tags = '',
      status = 'todo',
      completed = false
    } = req.body

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Task title is required' })
    }

    if (!dueDate) {
      return res.status(400).json({ error: 'Due date is required' })
    }

    // Validate priority
    const validPriorities = ['low', 'medium', 'high']
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority. Must be low, medium, or high' })
    }

    // Validate status
    const validStatuses = ['todo', 'in-progress', 'review', 'blocked', 'completed']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const tasks = await readTasks()
    const id = tasks.length > 0 ? Math.max(...tasks.map(task => task.id || 0)) + 1 : 1

    const newTask = {
      id,
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      priority,
      dueDate,
      estimatedTime,
      assignedTo: assignedTo.trim() || 'Self',
      tags: tags.trim(),
      status,
      completed: Boolean(completed),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    tasks.push(newTask)
    await writeTasks(tasks)
    
    console.log('Task created successfully:', newTask.id)
    res.status(201).json(newTask)
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({ 
      error: 'Failed to create task',
      message: error.message 
    })
  }
})

// Update task
app.put('/api/tasks/:id', async (req, res) => {
  console.log('PUT /api/tasks/:id called with:', req.params.id, req.body)
  try {
    const { id } = req.params
    const updates = req.body

    // Validate priority if provided
    if (updates.priority) {
      const validPriorities = ['low', 'medium', 'high']
      if (!validPriorities.includes(updates.priority)) {
        return res.status(400).json({ error: 'Invalid priority' })
      }
    }

    // Validate status if provided
    if (updates.status) {
      const validStatuses = ['todo', 'in-progress', 'review', 'blocked', 'completed']
      if (!validStatuses.includes(updates.status)) {
        return res.status(400).json({ error: 'Invalid status' })
      }
    }

    // Auto-complete task if status is set to completed
    if (updates.status === 'completed') {
      updates.completed = true
    }

    // Clean up string fields
    if (updates.title) updates.title = updates.title.trim()
    if (updates.description) updates.description = updates.description.trim()
    if (updates.category) updates.category = updates.category.trim()
    if (updates.assignedTo) updates.assignedTo = updates.assignedTo.trim()
    if (updates.tags) updates.tags = updates.tags.trim()

    const tasks = await readTasks()
    const index = tasks.findIndex(task => task.id === parseInt(id))
    
    if (index === -1) {
      return res.status(404).json({ error: 'Task not found' })
    }
    
    tasks[index] = { 
      ...tasks[index], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    }
    
    await writeTasks(tasks)
    
    console.log('Task updated successfully:', id)
    res.json(tasks[index])
  } catch (error) {
    console.error('Error updating task:', error)
    res.status(500).json({ 
      error: 'Failed to update task',
      message: error.message 
    })
  }
})

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
  console.log('DELETE /api/tasks/:id called with:', req.params.id)
  try {
    const tasks = await readTasks()
    const initialLength = tasks.length
    const filteredTasks = tasks.filter(task => task.id !== parseInt(req.params.id))
    
    if (filteredTasks.length === initialLength) {
      return res.status(404).json({ error: 'Task not found' })
    }
    
    await writeTasks(filteredTasks)
    
    console.log('Task deleted successfully:', req.params.id)
    res.json({ 
      message: 'Task deleted successfully',
      id: parseInt(req.params.id)
    })
  } catch (error) {
    console.error('Error deleting task:', error)
    res.status(500).json({ 
      error: 'Failed to delete task',
      message: error.message 
    })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Express error handler:', err.stack)
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  })
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully')
  process.exit(0)
})

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 FlowState API Server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🌐 API Base URL: http://0.0.0.0:${PORT}`)
  console.log(`📋 Tasks endpoint: http://localhost:${PORT}/api/tasks`)
  console.log(`🔄 CORS enabled for frontend ports: 3000, 5173`)
  
  // Initialize data directory and sample data
  try {
    await ensureDataDirectory()
    const tasks = await readTasks()
    console.log(`📁 Tasks file: ${TASKS_FILE}`)
    console.log(`📊 Current tasks: ${tasks.length}`)
  } catch (error) {
    console.error('❌ Error initializing data:', error.message)
  }
})

module.exports = app