const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://flowstate-backend.onrender.com/api'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error)
      throw error
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health')
  }

  // Task operations
  async getTasks(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    const endpoint = queryParams ? `/tasks?${queryParams}` : '/tasks'
    return this.request(endpoint)
  }

  async getTask(id) {
    return this.request(`/tasks/${id}`)
  }

  async createTask(taskData) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    })
  }

  async updateTask(id, updates) {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async deleteTask(id) {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE',
    })
  }

  async completeTask(id) {
    return this.updateTask(id, { completed: true, status: 'completed' })
  }

  async searchTasks(query) {
    return this.getTasks({ search: query })
  }

  async getTaskStats() {
    return this.request('/tasks/stats/overview')
  }

  // Utility methods
  async filterTasks(filters) {
    return this.getTasks(filters)
  }

  async getTasksByCategory(category) {
    return this.getTasks({ category })
  }

  async getTasksByPriority(priority) {
    return this.getTasks({ priority })
  }

  async getTasksByStatus(status) {
    return this.getTasks({ status })
  }

  async getCompletedTasks() {
    return this.getTasks({ completed: 'true' })
  }

  async getPendingTasks() {
    return this.getTasks({ completed: 'false' })
  }
}

// Create and export singleton instance
const apiService = new ApiService()

export default apiService

// Export individual methods for convenience
export const {
  healthCheck,
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  searchTasks,
  getTaskStats,
  filterTasks,
  getTasksByCategory,
  getTasksByPriority,
  getTasksByStatus,
  getCompletedTasks,
  getPendingTasks
} = apiService