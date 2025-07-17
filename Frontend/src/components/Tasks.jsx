import React, { useState, useEffect } from 'react'
import { 
  FaTasks, 
  FaEdit, 
  FaTrash, 
  FaCheck, 
  FaTimes, 
  FaSearch, 
  FaFilter,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaTag,
  FaFlag,
  FaUser,
  FaSave
} from 'react-icons/fa'
import ApiService from '../services/api'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [editingTask, setEditingTask] = useState(null)
  const [editForm, setEditForm] = useState({})

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks()
  }, [])

  // Filter tasks when search term or filters change
  useEffect(() => {
    filterTasks()
  }, [tasks, searchTerm, filterStatus, filterPriority])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const data = await ApiService.getTasks()
      setTasks(data)
      setError(null)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setError('Failed to fetch tasks. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filterTasks = () => {
    let filtered = [...tasks]

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(task =>
        task.title?.toLowerCase().includes(search) ||
        task.description?.toLowerCase().includes(search) ||
        task.category?.toLowerCase().includes(search) ||
        task.tags?.toLowerCase().includes(search)
      )
    }

    // Status filter
    if (filterStatus !== 'all') {
      if (filterStatus === 'completed') {
        filtered = filtered.filter(task => task.completed)
      } else if (filterStatus === 'pending') {
        filtered = filtered.filter(task => !task.completed)
      } else {
        filtered = filtered.filter(task => task.status === filterStatus)
      }
    }

    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority)
    }

    setFilteredTasks(filtered)
  }

  const handleTaskComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId)
      const updatedTask = await ApiService.updateTask(taskId, {
        ...task,
        completed: !task.completed,
        status: !task.completed ? 'completed' : 'todo'
      })
      
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t))
    } catch (error) {
      console.error('Error updating task:', error)
      setError('Failed to update task status')
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return
    }

    try {
      await ApiService.deleteTask(taskId)
      setTasks(tasks.filter(t => t.id !== taskId))
    } catch (error) {
      console.error('Error deleting task:', error)
      setError('Failed to delete task')
    }
  }

  const handleEditStart = (task) => {
    setEditingTask(task.id)
    setEditForm({
      title: task.title,
      description: task.description,
      category: task.category,
      priority: task.priority,
      status: task.status,
      assignedTo: task.assignedTo,
      tags: task.tags,
      estimatedTime: task.estimatedTime
    })
  }

  const handleEditCancel = () => {
    setEditingTask(null)
    setEditForm({})
  }

  const handleEditSave = async () => {
    try {
      const updatedTask = await ApiService.updateTask(editingTask, editForm)
      setTasks(tasks.map(t => t.id === editingTask ? updatedTask : t))
      setEditingTask(null)
      setEditForm({})
    } catch (error) {
      console.error('Error updating task:', error)
      setError('Failed to update task')
    }
  }

  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-900 text-red-300'
      case 'medium': return 'bg-yellow-900 text-yellow-300'
      case 'low': return 'bg-green-900 text-green-300'
      default: return 'bg-neutral-700 text-neutral-300'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-900 text-green-300'
      case 'in-progress': return 'bg-blue-900 text-blue-300'
      case 'review': return 'bg-purple-900 text-purple-300'
      case 'blocked': return 'bg-red-900 text-red-300'
      case 'todo': return 'bg-neutral-700 text-neutral-300'
      default: return 'bg-neutral-700 text-neutral-300'
    }
  }

  const getStatusIcon = (task) => {
    if (task.completed) return <FaCheckCircle className="text-green-500" />
    if (task.status === 'in-progress') return <FaClock className="text-blue-500" />
    if (task.status === 'blocked') return <FaExclamationTriangle className="text-red-500" />
    return <FaTasks className="text-neutral-400" />
  }

  if (loading) {
    return (
      <div className="tasks w-full h-[716px] flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="tasks w-full min-h-[716px] bg-black text-white p-6 overflow-hidden overflow-y-auto">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <FaTasks className="text-blue-500" />
          All Tasks
        </h1>
        <p className="text-neutral-400">
          Manage and organize all your tasks in one place
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-600 text-white p-4 rounded-lg mb-4 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-white hover:text-gray-200">
            <FaTimes />
          </button>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-black border border-neutral-700 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900/30 border border-neutral-600 rounded-lg text-white 
              placeholder-neutral-400 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-3 bg-gray-900/30 border border-neutral-600 rounded-lg text-white 
            focus:border-blue-500 focus:outline-none transition-colors appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Under Review</option>
            <option value="blocked">Blocked</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="w-full px-3 py-3 bg-gray-900/30 border border-neutral-600 rounded-lg text-white 
            focus:border-blue-500 focus:outline-none transition-colors appearance-none cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={fetchTasks}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors 
            flex items-center justify-center gap-2"
          >
            <FaFilter />
            Refresh
          </button>
        </div>
      </div>

      {/* Tasks Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-black border border-neutral-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">Total</p>
              <p className="text-2xl font-bold">{tasks.length}</p>
            </div>
            <FaTasks className="text-blue-500 text-xl" />
          </div>
        </div>
        
        <div className="bg-black border border-neutral-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">Completed</p>
              <p className="text-2xl font-bold text-green-400">
                {tasks.filter(t => t.completed).length}
              </p>
            </div>
            <FaCheckCircle className="text-green-500 text-xl" />
          </div>
        </div>
        
        <div className="bg-black border border-neutral-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">In Progress</p>
              <p className="text-2xl font-bold text-blue-400">
                {tasks.filter(t => t.status === 'in-progress').length}
              </p>
            </div>
            <FaClock className="text-blue-500 text-xl" />
          </div>
        </div>
        
        <div className="bg-black border border-neutral-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">High Priority</p>
              <p className="text-2xl font-bold text-red-400">
                {tasks.filter(t => t.priority === 'high').length}
              </p>
            </div>
            <FaExclamationTriangle className="text-red-500 text-xl" />
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-black border border-neutral-700 rounded-lg">
        <div className="p-6 border-b border-neutral-700">
          <h2 className="text-xl font-semibold">
            Tasks ({filteredTasks.length})
          </h2>
        </div>
        
        <div className="p-6">
          {filteredTasks.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredTasks.map(task => (
                <div key={task.id} className="bg-black border border-neutral-600 rounded-lg p-4 
                hover:border-neutral-500 transition-colors">
                  
                  {editingTask === task.id ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-300 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            name="title"
                            value={editForm.title}
                            onChange={handleEditInputChange}
                            className="w-full p-2 bg-gray-900/30 border border-neutral-600 rounded text-white 
                            focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-neutral-300 mb-1">
                            Category
                          </label>
                          <input
                            type="text"
                            name="category"
                            value={editForm.category}
                            onChange={handleEditInputChange}
                            className="w-full p-2 bg-gray-900/30 border border-neutral-600 rounded text-white 
                            focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={editForm.description}
                          onChange={handleEditInputChange}
                          rows="2"
                          className="w-full p-2 bg-gray-900/30 border border-neutral-600 rounded text-white 
                          focus:border-blue-500 focus:outline-none resize-none"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-300 mb-1">
                            Priority
                          </label>
                          <select
                            name="priority"
                            value={editForm.priority}
                            onChange={handleEditInputChange}
                            className="w-full p-2 bg-gray-900/30 border border-neutral-600 rounded text-white 
                            focus:border-blue-500 focus:outline-none"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-neutral-300 mb-1">
                            Status
                          </label>
                          <select
                            name="status"
                            value={editForm.status}
                            onChange={handleEditInputChange}
                            className="w-full p-2 bg-gray-900/30 border border-neutral-600 rounded text-white 
                            focus:border-blue-500 focus:outline-none"
                          >
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="review">Under Review</option>
                            <option value="blocked">Blocked</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-neutral-300 mb-1">
                            Assigned To
                          </label>
                          <input
                            type="text"
                            name="assignedTo"
                            value={editForm.assignedTo}
                            onChange={handleEditInputChange}
                            className="w-full p-2 bg-gray-900/30 border border-neutral-600 rounded text-white 
                            focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={handleEditSave}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded flex items-center gap-2 transition-colors"
                        >
                          <FaSave />
                          Save
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="px-4 py-2 bg-gray-900/60 hover:bg-gray-800 rounded flex items-center gap-2 transition-colors"
                        >
                          <FaTimes />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleTaskComplete(task.id)}
                          className="w-4 h-4 mt-1 border-neutral-500 bg-neutral-600 
                          checked:bg-blue-600 checked:border-blue-500 transition-colors cursor-pointer"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusIcon(task)}
                            <h3 className={`font-medium ${task.completed ? 'line-through text-neutral-500' : ''}`}>
                              {task.title}
                            </h3>
                          </div>
                          
                          {task.description && (
                            <p className="text-sm text-neutral-400 mb-2">{task.description}</p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            {task.category && (
                              <span className="bg-neutral-700 px-2 py-1 rounded flex items-center gap-1">
                                <FaTag />
                                {task.category}
                              </span>
                            )}
                            
                            <span className={`px-2 py-1 rounded font-medium ${getPriorityColor(task.priority)}`}>
                              <FaFlag className="inline mr-1" />
                              {task.priority}
                            </span>
                            
                            <span className={`px-2 py-1 rounded ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                            
                            {task.assignedTo && (
                              <span className="bg-neutral-700 px-2 py-1 rounded flex items-center gap-1">
                                <FaUser />
                                {task.assignedTo}
                              </span>
                            )}
                            
                            {task.estimatedTime && (
                              <span className="bg-neutral-700 px-2 py-1 rounded">
                                {task.estimatedTime}h
                              </span>
                            )}
                          </div>
                          
                          {task.tags && (
                            <div className="flex gap-1 mt-2">
                              {task.tags.split(',').map((tag, index) => (
                                <span key={index} className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded">
                                  {tag.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <div className="text-xs text-neutral-500 mt-2">
                            Due: {new Date(task.dueDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEditStart(task)}
                          className="p-2 bg-gray-900/30 hover:bg-blue-600 rounded transition-colors"
                          title="Edit task"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-2 bg-gray-900/30 hover:bg-red-600 rounded transition-colors"
                          title="Delete task"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaTasks className="text-6xl text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-400 text-lg">No tasks found</p>
              <p className="text-neutral-500 text-sm">
                {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first task to get started'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}