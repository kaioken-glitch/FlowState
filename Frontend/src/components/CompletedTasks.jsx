import React, { useState, useEffect } from 'react'
import { 
  FaCheckCircle, 
  FaTrophy, 
  FaCalendarCheck, 
  FaClock,
  FaTag,
  FaUser,
  FaTrash,
  FaUndo,
  FaTasks,
  FaChartLine
} from 'react-icons/fa'
import ApiService from '../services/api'

export default function CompletedTasks() {
  const [completedTasks, setCompletedTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState('all')

  useEffect(() => {
    fetchCompletedTasks()
  }, [])

  const fetchCompletedTasks = async () => {
    try {
      setLoading(true)
      const allTasks = await ApiService.getTasks()
      const completed = allTasks.filter(task => task.completed)
      setCompletedTasks(completed)
      setError(null)
    } catch (error) {
      console.error('Error fetching completed tasks:', error)
      setError('Failed to fetch completed tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleUndoComplete = async (taskId) => {
    try {
      const task = completedTasks.find(t => t.id === taskId)
      await ApiService.updateTask(taskId, {
        ...task,
        completed: false,
        status: 'todo'
      })
      setCompletedTasks(completedTasks.filter(t => t.id !== taskId))
    } catch (error) {
      setError('Failed to undo task completion')
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Permanently delete this completed task?')) return
    
    try {
      await ApiService.deleteTask(taskId)
      setCompletedTasks(completedTasks.filter(t => t.id !== taskId))
    } catch (error) {
      setError('Failed to delete task')
    }
  }

  const getFilteredTasks = () => {
    const now = new Date()
    
    switch (selectedPeriod) {
      case 'today':
        return completedTasks.filter(task => 
          new Date(task.updatedAt).toDateString() === now.toDateString()
        )
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return completedTasks.filter(task => 
          new Date(task.updatedAt) >= weekAgo
        )
      case 'month':
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        return completedTasks.filter(task => 
          new Date(task.updatedAt) >= monthAgo
        )
      default:
        return completedTasks
    }
  }

  const filteredTasks = getFilteredTasks()
  const completionStats = {
    total: completedTasks.length,
    today: completedTasks.filter(task => 
      new Date(task.updatedAt).toDateString() === new Date().toDateString()
    ).length,
    thisWeek: completedTasks.filter(task => 
      new Date(task.updatedAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length,
    highPriority: completedTasks.filter(task => task.priority === 'high').length
  }

  if (loading) {
    return (
      <div className="completedtasks w-full min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-white">Loading completed tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="completedtasks w-full min-h-screen bg-black text-white p-6 flex flex-col">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <FaTrophy className="text-yellow-500" />
          Completed Tasks
        </h1>
        <p className="text-neutral-400">
          Celebrate your achievements and track your productivity
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-600 text-white p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Completion Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-black border border-neutral-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">Total Completed</p>
              <p className="text-2xl font-bold text-green-400">{completionStats.total}</p>
            </div>
            <FaCheckCircle className="text-green-500 text-xl" />
          </div>
        </div>
        
        <div className="bg-black border border-neutral-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">Today</p>
              <p className="text-2xl font-bold text-blue-400">{completionStats.today}</p>
            </div>
            <FaCalendarCheck className="text-blue-500 text-xl" />
          </div>
        </div>
        
        <div className="bg-black border border-neutral-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">This Week</p>
              <p className="text-2xl font-bold text-purple-400">{completionStats.thisWeek}</p>
            </div>
            <FaChartLine className="text-purple-500 text-xl" />
          </div>
        </div>
        
        <div className="bg-black border border-neutral-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">High Priority</p>
              <p className="text-2xl font-bold text-yellow-400">{completionStats.highPriority}</p>
            </div>
            <FaTrophy className="text-yellow-500 text-xl" />
          </div>
        </div>
      </div>

      {/* Filter Period */}
      <div className="bg-black border border-neutral-700 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-4">
          <span className="text-neutral-300">Show tasks from:</span>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 bg-gray-900/30 border border-neutral-600 rounded text-white 
            focus:border-green-500 focus:outline-none"
            style={{ backgroundColor: '#111827', color: 'white' }}
          >
            <option value="all" style={{ backgroundColor: '#111827', color: 'white' }}>All Time</option>
            <option value="today" style={{ backgroundColor: '#111827', color: 'white' }}>Today</option>
            <option value="week" style={{ backgroundColor: '#111827', color: 'white' }}>This Week</option>
            <option value="month" style={{ backgroundColor: '#111827', color: 'white' }}>This Month</option>
          </select>
          <span className="text-neutral-400">({filteredTasks.length} tasks)</span>
        </div>
      </div>

      {/* Completed Tasks List */}
      <div className="bg-black border border-neutral-700 rounded-lg flex-1 flex flex-col">
        <div className="p-4 border-b border-neutral-700">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FaCheckCircle className="text-green-500" />
            Completed Tasks ({filteredTasks.length})
          </h2>
        </div>
        
        <div className="p-4 flex-1 overflow-hidden">
          {filteredTasks.length > 0 ? (
            <div className="space-y-3 h-full overflow-y-auto">
              {filteredTasks.map(task => (
                <div key={task.id} className="bg-green-900/10 border border-green-700/30 rounded-lg p-4 
                hover:border-green-600/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <FaCheckCircle className="text-green-500 mt-1" />
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-green-300 line-through">
                          {task.title}
                        </h3>
                        
                        {task.description && (
                          <p className="text-sm text-neutral-400 mt-1">{task.description}</p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-2 text-xs mt-2">
                          {task.category && (
                            <span className="bg-neutral-700 px-2 py-1 rounded flex items-center gap-1">
                              <FaTag />
                              {task.category}
                            </span>
                          )}
                          
                          <span className={`px-2 py-1 rounded font-medium ${
                            task.priority === 'high' ? 'bg-red-900 text-red-300' :
                            task.priority === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                            'bg-green-900 text-green-300'
                          }`}>
                            {task.priority} priority
                          </span>
                          
                          {task.assignedTo && (
                            <span className="bg-neutral-700 px-2 py-1 rounded flex items-center gap-1">
                              <FaUser />
                              {task.assignedTo}
                            </span>
                          )}
                        </div>
                        
                        <div className="text-xs text-neutral-500 mt-2">
                          Completed: {new Date(task.updatedAt).toLocaleDateString('en-US', {
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
                        onClick={() => handleUndoComplete(task.id)}
                        className="p-2 bg-gray-900/30 hover:bg-yellow-600 rounded transition-colors"
                        title="Mark as incomplete"
                      >
                        <FaUndo />
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
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 h-full flex flex-col items-center justify-center">
              <FaTasks className="text-6xl text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-400 text-lg">No completed tasks found</p>
              <p className="text-neutral-500 text-sm">
                Complete some tasks to see them here!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}