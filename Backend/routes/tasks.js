const express = require('express')
const router = express.Router()
const fs = require('fs').promises
const path = require('path')

// Path to tasks.json file
const TASKS_FILE = path.join(__dirname, '../data/tasks.json')

// Helper functions
const ensureDataDirectory = async () => {
  const dataDir = path.dirname(TASKS_FILE)
  try {
    await fs.access(dataDir)
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(dataDir, { recursive: true })
    }
  }
}

const readTasks = async () => {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(TASKS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeTasks([])
      return []
    }
    throw error
  }
}

const writeTasks = async (tasks) => {
  try {
    await ensureDataDirectory()
    await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2))
  } catch (error) {
    console.error('Error writing tasks file:', error)
    throw error
  }
}

// Routes in proper order
console.log('Loading tasks routes...')

// Statistics route FIRST
router.get('/stats/overview', async (req, res) => {
  console.log('Stats route hit')
  try {
    const tasks = await readTasks()
    const stats = {
      total: tasks.length,
      completed: tasks.filter(task => task.completed).length,
      pending: tasks.filter(task => !task.completed).length
    }
    res.json(stats)
  } catch (error) {
    console.error('Stats error:', error)
    res.status(500).json({ error: 'Failed to fetch statistics' })
  }
})

// Get all tasks
router.get('/', async (req, res) => {
  console.log('Get all tasks route hit')
  try {
    const tasks = await readTasks()
    res.json(tasks)
  } catch (error) {
    console.error('Get tasks error:', error)
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
})

// Create task
router.post('/', async (req, res) => {
  console.log('Create task route hit')
  try {
    const { title, description = '', dueDate, priority = 'medium' } = req.body

    if (!title || !dueDate) {
      return res.status(400).json({ error: 'Title and due date are required' })
    }

    const tasks = await readTasks()
    const id = tasks.length > 0 ? Math.max(...tasks.map(t => t.id || 0)) + 1 : 1

    const newTask = {
      id,
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      status: 'todo',
      completed: false,
      createdAt: new Date().toISOString()
    }

    tasks.push(newTask)
    await writeTasks(tasks)
    
    console.log('Task created:', newTask.id)
    res.status(201).json(newTask)
  } catch (error) {
    console.error('Create task error:', error)
    res.status(500).json({ error: 'Failed to create task' })
  }
})

// Get single task by ID (LAST)
router.get('/:id', async (req, res) => {
  console.log('Get single task route hit:', req.params.id)
  try {
    const tasks = await readTasks()
    const task = tasks.find(t => t.id === parseInt(req.params.id))
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }
    
    res.json(task)
  } catch (error) {
    console.error('Get task error:', error)
    res.status(500).json({ error: 'Failed to fetch task' })
  }
})

// Update task
router.put('/:id', async (req, res) => {
  console.log('Update task route hit:', req.params.id)
  try {
    const tasks = await readTasks()
    const index = tasks.findIndex(task => task.id === parseInt(req.params.id))
    
    if (index === -1) {
      return res.status(404).json({ error: 'Task not found' })
    }
    
    tasks[index] = { ...tasks[index], ...req.body, updatedAt: new Date().toISOString() }
    await writeTasks(tasks)
    
    res.json(tasks[index])
  } catch (error) {
    console.error('Update task error:', error)
    res.status(500).json({ error: 'Failed to update task' })
  }
})

// Delete task
router.delete('/:id', async (req, res) => {
  console.log('Delete task route hit:', req.params.id)
  try {
    const tasks = await readTasks()
    const filteredTasks = tasks.filter(task => task.id !== parseInt(req.params.id))
    
    if (filteredTasks.length === tasks.length) {
      return res.status(404).json({ error: 'Task not found' })
    }
    
    await writeTasks(filteredTasks)
    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Delete task error:', error)
    res.status(500).json({ error: 'Failed to delete task' })
  }
})

console.log('Tasks routes loaded successfully')
module.exports = router