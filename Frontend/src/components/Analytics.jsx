import React, { useState, useEffect } from 'react'
import { 
  FaChartLine, 
  FaRobot, 
  FaBrain,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLightbulb,
  FaTasks,
  FaFire,
  FaChartPie,
  FaChartBar,
  FaAward,
  FaSync
} from 'react-icons/fa'
import ApiService from '../services/api'

export default function Analytics() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const data = await ApiService.getTasks()
      setTasks(data)
      setError(null)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setError('Failed to fetch analytics data')
    } finally {
      setLoading(false)
    }
  }

  // Calculate analytics data
  const getAnalytics = () => {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

    const completed = tasks.filter(task => task.completed)
    const pending = tasks.filter(task => !task.completed)
    const overdue = tasks.filter(task => 
      new Date(task.dueDate) < now && !task.completed
    )

    // Weekly stats
    const thisWeekCompleted = completed.filter(task => 
      new Date(task.updatedAt) >= weekAgo
    )
    const lastWeekCompleted = completed.filter(task => {
      const twoWeeksAgo = new Date(weekAgo.getTime() - 7 * 24 * 60 * 60 * 1000)
      return new Date(task.updatedAt) >= twoWeeksAgo && new Date(task.updatedAt) < weekAgo
    })

    // Priority distribution
    const priorityStats = {
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length
    }

    // Category distribution
    const categoryStats = {}
    tasks.forEach(task => {
      const category = task.category || 'Uncategorized'
      categoryStats[category] = (categoryStats[category] || 0) + 1
    })

    // Productivity metrics
    const completionRate = tasks.length > 0 ? (completed.length / tasks.length) * 100 : 0
    const weeklyTrend = lastWeekCompleted.length > 0 
      ? ((thisWeekCompleted.length - lastWeekCompleted.length) / lastWeekCompleted.length) * 100
      : thisWeekCompleted.length > 0 ? 100 : 0

    return {
      total: tasks.length,
      completed: completed.length,
      pending: pending.length,
      overdue: overdue.length,
      completionRate: Math.round(completionRate),
      weeklyTrend: Math.round(weeklyTrend),
      thisWeekCompleted: thisWeekCompleted.length,
      lastWeekCompleted: lastWeekCompleted.length,
      priorityStats,
      categoryStats,
      avgTasksPerDay: Math.round(completed.length / 30) // Last 30 days estimate
    }
  }

  // AI Recommendations Engine
  const getAIRecommendations = (analytics) => {
    const recommendations = []

    // Completion rate analysis
    if (analytics.completionRate < 50) {
      recommendations.push({
        type: 'warning',
        title: 'Low Completion Rate Detected',
        message: 'Your task completion rate is below 50%. Consider breaking down large tasks into smaller, manageable chunks.',
        action: 'Focus on completing 2-3 small tasks daily to build momentum.'
      })
    } else if (analytics.completionRate > 80) {
      recommendations.push({
        type: 'success',
        title: 'Excellent Productivity!',
        message: 'You\'re maintaining a high completion rate. Great job staying focused!',
        action: 'Consider taking on more challenging projects or helping team members.'
      })
    }

    // Weekly trend analysis
    if (analytics.weeklyTrend < -20) {
      recommendations.push({
        type: 'alert',
        title: 'Productivity Decline',
        message: 'Your task completion has decreased by more than 20% this week.',
        action: 'Review your schedule and eliminate distractions. Consider time-blocking techniques.'
      })
    } else if (analytics.weeklyTrend > 20) {
      recommendations.push({
        type: 'success',
        title: 'Upward Trend!',
        message: 'You\'re completing more tasks than last week. Keep up the great work!',
        action: 'Document what\'s working well and maintain these productive habits.'
      })
    }

    // Overdue tasks analysis
    if (analytics.overdue > 5) {
      recommendations.push({
        type: 'urgent',
        title: 'Too Many Overdue Tasks',
        message: `You have ${analytics.overdue} overdue tasks. This can impact your productivity and stress levels.`,
        action: 'Prioritize overdue tasks and consider rescheduling less critical ones.'
      })
    }

    // Priority distribution analysis
    const highPriorityRatio = analytics.priorityStats.high / analytics.total
    if (highPriorityRatio > 0.4) {
      recommendations.push({
        type: 'info',
        title: 'High Priority Overload',
        message: 'Over 40% of your tasks are marked as high priority. This might lead to burnout.',
        action: 'Re-evaluate task priorities. Not everything can be urgent.'
      })
    }

    // Productivity patterns
    if (analytics.avgTasksPerDay < 1) {
      recommendations.push({
        type: 'tip',
        title: 'Consistency Opportunity',
        message: 'You\'re completing less than 1 task per day on average.',
        action: 'Set a goal to complete at least 1-2 small tasks daily for better momentum.'
      })
    }

    // Category diversity analysis
    const categoryCount = Object.keys(analytics.categoryStats).length
    if (categoryCount < 3) {
      recommendations.push({
        type: 'tip',
        title: 'Diversify Your Tasks',
        message: 'You\'re focusing on limited categories. Consider balancing work and personal tasks.',
        action: 'Add tasks from different life areas for better work-life balance.'
      })
    }

    return recommendations.length > 0 ? recommendations : [{
      type: 'success',
      title: 'You\'re Doing Great!',
      message: 'Your productivity metrics look healthy. Keep maintaining your current workflow.',
      action: 'Continue with your current approach and gradually increase your task completion goals.'
    }]
  }

  const analytics = getAnalytics()
  const aiRecommendations = getAIRecommendations(analytics)

  if (loading) {
    return (
      <div className="analytics w-full min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Analyzing your productivity data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="analytics w-full min-h-screen bg-black text-white p-6 flex flex-col">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <FaChartLine className="text-blue-500" />
          Analytics & AI Insights
        </h1>
        <p className="text-neutral-400">
          Discover productivity patterns and get AI-powered recommendations
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-600 text-white p-4 rounded-lg mb-4 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchTasks} className="text-white hover:text-gray-200">
            <FaSync />
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-black border border-neutral-700 rounded-lg mb-6">
        <div className="flex border-b border-neutral-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'overview' 
                ? 'bg-blue-600 text-white' 
                : 'text-neutral-400 hover:text-white hover:bg-gray-900/30'
            }`}
          >
            <FaChartBar className="inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'trends' 
                ? 'bg-blue-600 text-white' 
                : 'text-neutral-400 hover:text-white hover:bg-gray-900/30'
            }`}
          >
            <FaArrowUp className="inline mr-2" />
            Trends
          </button>
          <button
            onClick={() => setActiveTab('ai-insights')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'ai-insights' 
                ? 'bg-blue-600 text-white' 
                : 'text-neutral-400 hover:text-white hover:bg-gray-900/30'
            }`}
          >
            <FaRobot className="inline mr-2" />
            AI Insights
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-black border border-neutral-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-400 text-sm">Total Tasks</p>
                    <p className="text-2xl font-bold">{analytics.total}</p>
                  </div>
                  <FaTasks className="text-blue-500 text-xl" />
                </div>
              </div>
              
              <div className="bg-black border border-neutral-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-400 text-sm">Completion Rate</p>
                    <p className="text-2xl font-bold text-green-400">{analytics.completionRate}%</p>
                  </div>
                  <FaCheckCircle className="text-green-500 text-xl" />
                </div>
              </div>
              
              <div className="bg-black border border-neutral-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-400 text-sm">Weekly Change</p>
                    <p className={`text-2xl font-bold ${
                      analytics.weeklyTrend >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {analytics.weeklyTrend >= 0 ? '+' : ''}{analytics.weeklyTrend}%
                    </p>
                  </div>
                  {analytics.weeklyTrend >= 0 ? 
                    <FaArrowUp className="text-green-500 text-xl" /> :
                    <FaArrowDown className="text-red-500 text-xl" />
                  }
                </div>
              </div>
              
              <div className="bg-black border border-neutral-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-400 text-sm">Overdue</p>
                    <p className="text-2xl font-bold text-red-400">{analytics.overdue}</p>
                  </div>
                  <FaExclamationTriangle className="text-red-500 text-xl" />
                </div>
              </div>
            </div>

            {/* Priority Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-black border border-neutral-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FaChartPie className="text-purple-500" />
                  Priority Distribution
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      High Priority
                    </span>
                    <span className="font-medium">{analytics.priorityStats.high}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                      Medium Priority
                    </span>
                    <span className="font-medium">{analytics.priorityStats.medium}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      Low Priority
                    </span>
                    <span className="font-medium">{analytics.priorityStats.low}</span>
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="bg-black border border-neutral-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FaChartBar className="text-green-500" />
                  Category Breakdown
                </h3>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {Object.entries(analytics.categoryStats).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-neutral-300">{category}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div className="space-y-6">
            
            {/* Weekly Comparison */}
            <div className="bg-black border border-neutral-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaCalendarAlt className="text-blue-500" />
                Weekly Performance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-neutral-400 text-sm">This Week</p>
                  <p className="text-3xl font-bold text-blue-400">{analytics.thisWeekCompleted}</p>
                  <p className="text-sm text-neutral-500">tasks completed</p>
                </div>
                <div className="text-center">
                  <p className="text-neutral-400 text-sm">Last Week</p>
                  <p className="text-3xl font-bold text-neutral-400">{analytics.lastWeekCompleted}</p>
                  <p className="text-sm text-neutral-500">tasks completed</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className={`text-lg font-medium ${
                  analytics.weeklyTrend >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {analytics.weeklyTrend >= 0 ? '↗' : '↘'} {Math.abs(analytics.weeklyTrend)}% change
                </p>
              </div>
            </div>

            {/* Productivity Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black border border-neutral-700 rounded-lg p-4 text-center">
                <FaFire className="text-orange-500 text-2xl mx-auto mb-2" />
                <p className="text-neutral-400 text-sm">Daily Average</p>
                <p className="text-xl font-bold">{analytics.avgTasksPerDay}</p>
                <p className="text-xs text-neutral-500">tasks per day</p>
              </div>
              
              <div className="bg-black border border-neutral-700 rounded-lg p-4 text-center">
                <FaAward className="text-yellow-500 text-2xl mx-auto mb-2" />
                <p className="text-neutral-400 text-sm">Success Rate</p>
                <p className="text-xl font-bold">{analytics.completionRate}%</p>
                <p className="text-xs text-neutral-500">completion rate</p>
              </div>
              
              <div className="bg-black border border-neutral-700 rounded-lg p-4 text-center">
                <FaClock className="text-purple-500 text-2xl mx-auto mb-2" />
                <p className="text-neutral-400 text-sm">Pending Tasks</p>
                <p className="text-xl font-bold">{analytics.pending}</p>
                <p className="text-xs text-neutral-500">active tasks</p>
              </div>
            </div>
          </div>
        )}

        {/* AI Insights Tab */}
        {activeTab === 'ai-insights' && (
          <div className="space-y-6">
            
            {/* AI Header */}
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <FaBrain className="text-blue-400 text-2xl" />
                <h3 className="text-xl font-semibold">AI Productivity Assistant</h3>
              </div>
              <p className="text-neutral-300">
                Based on your task patterns, here are personalized insights and recommendations to boost your productivity.
              </p>
            </div>

            {/* AI Recommendations */}
            <div className="space-y-4">
              {aiRecommendations.map((rec, index) => (
                <div key={index} className={`border rounded-lg p-6 ${
                  rec.type === 'success' ? 'bg-green-900/10 border-green-700/30' :
                  rec.type === 'warning' ? 'bg-yellow-900/10 border-yellow-700/30' :
                  rec.type === 'alert' ? 'bg-red-900/10 border-red-700/30' :
                  rec.type === 'urgent' ? 'bg-red-900/20 border-red-600/50' :
                  'bg-blue-900/10 border-blue-700/30'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      rec.type === 'success' ? 'bg-green-600' :
                      rec.type === 'warning' ? 'bg-yellow-600' :
                      rec.type === 'alert' || rec.type === 'urgent' ? 'bg-red-600' :
                      'bg-blue-600'
                    }`}>
                      {rec.type === 'success' ? <FaCheckCircle /> :
                       rec.type === 'warning' ? <FaExclamationTriangle /> :
                       rec.type === 'alert' || rec.type === 'urgent' ? <FaExclamationTriangle /> :
                       <FaLightbulb />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2">{rec.title}</h4>
                      <p className="text-neutral-300 mb-3">{rec.message}</p>
                      <div className="bg-black/30 border border-neutral-600 rounded-lg p-3">
                        <p className="text-sm text-blue-300">
                          <strong>💡 Recommendation:</strong> {rec.action}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Score */}
            <div className="bg-black border border-neutral-700 rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-4">Overall Productivity Score</h3>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="w-full h-full rounded-full border-8 border-neutral-700"></div>
                <div 
                  className="absolute top-0 left-0 w-full h-full rounded-full border-8 border-blue-500"
                  style={{
                    clipPath: `polygon(0 0, ${analytics.completionRate}% 0, ${analytics.completionRate}% 100%, 0 100%)`
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{analytics.completionRate}%</span>
                </div>
              </div>
              <p className="text-neutral-400">
                {analytics.completionRate >= 80 ? 'Excellent! You\'re highly productive.' :
                 analytics.completionRate >= 60 ? 'Good work! Room for improvement.' :
                 analytics.completionRate >= 40 ? 'Making progress. Stay consistent.' :
                 'Focus on completing smaller tasks first.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}