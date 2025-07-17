import React, { useState, useEffect } from 'react'
import { FaPlus, FaTasks, FaCheckCircle, FaClock, FaExclamationTriangle, FaCalendarAlt, FaTimes, FaFlag, FaUser, FaTag } from 'react-icons/fa'
import apiService from '../services/api'

export default function Dashboard({ user }) {
  const [tasks, setTasks] = useState([])
  const [showAddTask, setShowAddTask] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    dueDate: '',
    estimatedTime: '',
    assignedTo: '',
    tags: '',
    status: 'todo',
    completed: false
  })

  // Fetch tasks from backend on component mount
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await apiService.getTasks()
      setTasks(data)
      
    } catch (err) {
      setError('Failed to load tasks. Please try again.')
      console.error('Error fetching tasks:', err)
      
      // Fallback to mock data if backend is unavailable
      const mockTasks = [
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
          createdAt: new Date().toISOString()
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
          createdAt: new Date().toISOString()
        }
      ]
      setTasks(mockTasks)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewTask(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newTask.title || !newTask.dueDate) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        category: newTask.category,
        priority: newTask.priority,
        dueDate: newTask.dueDate,
        estimatedTime: newTask.estimatedTime,
        assignedTo: newTask.assignedTo || 'Self',
        tags: newTask.tags,
        status: newTask.status,
        completed: false
      }

      const createdTask = await apiService.createTask(taskData)
      setTasks(prev => [...prev, createdTask])
      
      // Reset form
      setNewTask({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        dueDate: '',
        estimatedTime: '',
        assignedTo: '',
        tags: '',
        status: 'todo',
        completed: false
      })
      
      setShowAddTask(false)
      
    } catch (err) {
      setError('Failed to create task. Please try again.')
      console.error('Error creating task:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setNewTask({
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      dueDate: '',
      estimatedTime: '',
      assignedTo: '',
      tags: '',
      status: 'todo',
      completed: false
    })
    setShowAddTask(false)
    setError(null)
  }

  const handleTaskComplete = async (taskId) => {
    try {
      const updatedTask = await apiService.completeTask(taskId)
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ))
    } catch (err) {
      console.error('Error updating task:', err)
      setError('Failed to update task')
    }
  }

  // Filter tasks based on current date and completion status
  const today = new Date()
  const todayString = today.toISOString().split('T')[0]
  
  const todaysTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate).toISOString().split('T')[0]
    return !task.completed && (taskDate === todayString || new Date(task.dueDate) <= today)
  })
  
  const completedTasks = tasks.filter(task => task.completed)
  const overdueTasks = tasks.filter(task => new Date(task.dueDate) < new Date() && !task.completed)

  return (
    <div className="dashboard w-full min-h-screen bg-black text-white p-6
    overflow-hidden overflow-y-auto relative">
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-600 text-white p-4 rounded-lg mb-4 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-white hover:text-gray-200">
            <FaTimes />
          </button>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-800 rounded-lg p-6 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span>Loading...</span>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <div className="welcome-section mb-8">
        <h1 className="text-3xl font-bold mb-2">Good morning, {user?.name || 'User'}!</h1>
        <p className="text-neutral-400">Here's what you have planned for today.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat-card bg-black p-6 rounded-lg border border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">Total Tasks</p>
              <p className="text-2xl font-bold">{tasks.length}</p>
            </div>
            <FaTasks className="text-blue-500 text-2xl" />
          </div>
        </div>

        <div className="stat-card bg-black p-6 rounded-lg border border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">Completed</p>
              <p className="text-2xl font-bold text-green-400">{completedTasks.length}</p>
            </div>
            <FaCheckCircle className="text-green-500 text-2xl" />
          </div>
        </div>

        <div className="stat-card bg-black p-6 rounded-lg border border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">Today's Tasks</p>
              <p className="text-2xl font-bold text-yellow-400">{todaysTasks.length}</p>
            </div>
            <FaClock className="text-yellow-500 text-2xl" />
          </div>
        </div>

        <div className="stat-card bg-black p-6 rounded-lg border border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">Overdue</p>
              <p className="text-2xl font-bold text-red-400">{overdueTasks.length}</p>
            </div>
            <FaExclamationTriangle className="text-red-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="main-content grid grid-cols-1 lg:grid-cols-3 gap-6 
      overflow-hidden overflow-y-auto h-full">
        
        {/* Today's Tasks */}
        <div className="todays-tasks lg:col-span-2 bg-black rounded-lg border border-neutral-700">
          <div className="p-6 border-b border-neutral-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaCalendarAlt className="text-blue-500" />
                Today's Tasks
              </h2>
              <button 
                onClick={() => setShowAddTask(true)}
                disabled={loading}
                className="bg-black hover:bg-blue-800 rounded-lg 
                flex flex-row items-center gap-1 transition-colors border border-white/20
                cursor-pointer w-[110px] h-[30px] text-[12px] 
                text-neutral-300 justify-evenly disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPlus className="text-[12px]" />
                Add Task
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {todaysTasks.length > 0 ? (
              <div className="space-y-4">
                {todaysTasks.slice(0, 5).map(task => (
                  <div key={task.id} className="task-item bg-black p-4 rounded-lg border border-neutral-600 hover:border-neutral-500 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={task.completed}
                          onChange={() => handleTaskComplete(task.id)}
                          className="w-4 h-4 border-neutral-500 bg-neutral-600
                          checked:bg-blue-600 checked:border-blue-500 transition-colors cursor-pointer"
                        />
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          {task.description && (
                            <p className="text-sm text-neutral-400">{task.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-neutral-500">
                              Due: {new Date(task.dueDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {task.estimatedTime && <span className="text-xs text-neutral-500">• {task.estimatedTime}h</span>}
                            {task.category && <span className="text-xs bg-neutral-700 px-2 py-1 rounded">{task.category}</span>}
                          </div>
                          {task.tags && (
                            <div className="flex gap-1 mt-1">
                              {task.tags.split(',').map((tag, index) => (
                                <span key={index} className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded">
                                  {tag.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          task.priority === 'high' ? 'bg-red-900 text-red-300' :
                          task.priority === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                          'bg-green-900 text-green-300'
                        }`}>
                          {task.priority}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          task.status === 'todo' ? 'bg-neutral-700 text-neutral-300' :
                          task.status === 'in-progress' ? 'bg-blue-900 text-blue-300' :
                          task.status === 'review' ? 'bg-purple-900 text-purple-300' :
                          'bg-red-900 text-red-300'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-neutral-400">No tasks for today. Great job!</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar space-y-6 overflow-hidden overflow-y-auto h-full bg-black p-6">
          
          {/* Quick Actions */}
          <div className="quick-actions bg-black rounded-lg border border-neutral-700 p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => setShowAddTask(true)}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-left transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create New Task
              </button>
              <button 
                onClick={fetchTasks}
                className="w-full bg-black border border-gray-700 hover:bg-gray-800/50 p-3 rounded-lg text-left transition-colors"
              >
                Refresh Tasks
              </button>
              <button className="w-full bg-black border border-gray-700 hover:bg-gray-800/50 p-3 rounded-lg text-left transition-colors">
                Generate Report
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="recent-activity bg-black rounded-lg border border-neutral-700 p-6">
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {tasks.slice(0, 3).map(task => (
                <div key={task.id} className="activity-item">
                  <p className="text-sm text-neutral-300">
                    {task.completed ? 'Completed' : 'Created'} "{task.title}"
                  </p>
                  <p className="text-xs text-neutral-500">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Chart */}
          <div className="progress-chart bg-black rounded-lg border border-neutral-700 p-6">
            <h3 className="font-semibold mb-4">This Week's Progress</h3>
            <div className="space-y-3">
              <div className="progress-bar">
                <div className="flex justify-between text-sm mb-1">
                  <span>Completed</span>
                  <span>{tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-neutral-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Comprehensive Add Task Modal */}
      {showAddTask && (
        <div className="absolute inset-0 bg-transparent bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-black rounded-lg border border-neutral-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <FaPlus className="text-blue-500" />
                Create New Task
              </h3>
              <button 
                onClick={handleCancel}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Basic Info Section */}
              <div className="border-b border-neutral-700 pb-6">
                <h4 className="text-lg font-medium text-neutral-200 mb-4">Basic Information</h4>
                
                {/* Task Title */}
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-neutral-300 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newTask.title}
                    onChange={handleInputChange}
                    className="w-full h-[40px] p-3 bg-gray-900/30 border border-neutral-600 rounded-lg text-white 
                    placeholder-neutral-400 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Enter a clear, descriptive task title..."
                    required
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-neutral-300 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newTask.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-3 bg-gray-900/30 border border-neutral-600 rounded-lg text-white 
                    placeholder-neutral-400 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                    placeholder="Provide additional details about the task..."
                  />
                </div>

                {/* Category and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-neutral-300 mb-2">
                      <FaTag className="inline mr-1" />
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={newTask.category}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900/30 border border-neutral-600 rounded-lg text-white 
                      focus:border-blue-500 focus:outline-none transition-colors
                      px-3 py-3 appearance-none cursor-pointer"
                    >
                      <option value="">Select Category</option>
                      <option value="Work">Work</option>
                      <option value="Personal">Personal</option>
                      <option value="Health">Health</option>
                      <option value="Learning">Learning</option>
                      <option value="Finance">Finance</option>
                      <option value="Home">Home</option>
                      <option value="Social">Social</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-neutral-300 mb-2">
                      <FaFlag className="inline mr-1" />
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={newTask.priority}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900/30 border border-neutral-600 rounded-lg text-white 
                      focus:border-blue-500 focus:outline-none transition-colors
                      px-3 py-3 appearance-none cursor-pointer"
                    >
                      <option value="low">🟢 Low</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="high">🔴 High</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Scheduling Section */}
              <div className="border-b border-neutral-700 pb-6">
                <h4 className="text-lg font-medium text-neutral-200 mb-4">Scheduling</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Due Date */}
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-neutral-300 mb-2">
                      <FaClock className="inline mr-1" />
                      Due Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      id="dueDate"
                      name="dueDate"
                      value={newTask.dueDate}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-900/30 border border-neutral-600 rounded-lg text-white 
                      focus:border-blue-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  {/* Estimated Time */}
                  <div>
                    <label htmlFor="estimatedTime" className="block text-sm font-medium text-neutral-300 mb-2">
                      Estimated Hours
                    </label>
                    <input
                      type="number"
                      id="estimatedTime"
                      name="estimatedTime"
                      value={newTask.estimatedTime}
                      onChange={handleInputChange}
                      min="0.5"
                      step="0.5"
                      className="w-full p-3 bg-gray-900/30 border border-neutral-600 rounded-lg text-white 
                      placeholder-neutral-400 focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="2.5"
                    />
                  </div>
                </div>
              </div>

              {/* Assignment Section */}
              <div className="border-b border-neutral-700 pb-6">
                <h4 className="text-lg font-medium text-neutral-200 mb-4">Assignment & Organization</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Assigned To */}
                  <div>
                    <label htmlFor="assignedTo" className="block text-sm font-medium text-neutral-300 mb-2">
                      <FaUser className="inline mr-1" />
                      Assigned To
                    </label>
                    <input
                      type="text"
                      id="assignedTo"
                      name="assignedTo"
                      value={newTask.assignedTo}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-900/30 border border-neutral-600 rounded-lg text-white 
                      placeholder-neutral-400 focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="Enter name or leave empty for 'Self'"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-neutral-300 mb-2">
                      Initial Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={newTask.status}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900/30 border border-neutral-600 rounded-lg text-white 
                      focus:border-blue-500 focus:outline-none transition-colors
                      px-3 py-3 appearance-none cursor-pointer"
                    >
                      <option value="todo">📋 To Do</option>
                      <option value="in-progress">⚡ In Progress</option>
                      <option value="review">👀 Under Review</option>
                      <option value="blocked">🚫 Blocked</option>
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-4">
                  <label htmlFor="tags" className="block text-sm font-medium text-neutral-300 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={newTask.tags}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-900/30 border border-neutral-600 rounded-lg text-white 
                    placeholder-neutral-400 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="urgent, meeting, client, design..."
                  />
                  <p className="text-xs text-neutral-500 mt-1">Add tags to help organize and search for tasks</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg 
                  font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
                  flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <FaPlus className="text-sm" />
                      Create Task
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 bg-gray-900/60 hover:bg-gray-800 text-white py-3 px-4 rounded-lg 
                  font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500
                  disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}