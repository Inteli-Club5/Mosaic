class AgentStatsService {
  constructor() {
    this.STORAGE_PREFIX = 'agent_stats_';
    this.GLOBAL_STATS_KEY = 'global_agent_stats';
  }

  /**
   * Get agent statistics
   * @param {string} agentId - Agent blob ID
   * @returns {Object} Agent statistics
   */
  getAgentStats(agentId) {
    const statsKey = `${this.STORAGE_PREFIX}${agentId}`;
    const defaultStats = {
      // Performance metrics
      views: 0,
      purchases: 0,
      chats: 0,
      revenue: 0,
      
      // Session data
      sessions: [],
      totalSessions: 0,
      totalSessionTime: 0,
      averageSessionTime: 0,
      
      // Success metrics
      completedTasks: 0,
      successfulInteractions: 0,
      successRate: 0,
      
      // Reviews and ratings
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      
      // Time-based metrics
      responseTime: [],
      averageResponseTime: 0,
      uptime: 100, // Default uptime percentage
      
      // Temporal data for trends
      dailyViews: {},
      dailyPurchases: {},
      monthlyRevenue: {},
      
      // Metadata
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    try {
      const stored = localStorage.getItem(statsKey);
      if (stored) {
        const stats = JSON.parse(stored);
        // Ensure all required fields exist
        return { ...defaultStats, ...stats };
      }
      return defaultStats;
    } catch (error) {
      console.error('Error loading agent stats:', error);
      return defaultStats;
    }
  }

  /**
   * Update agent statistics
   * @param {string} agentId - Agent blob ID
   * @param {Object} updates - Statistics updates
   */
  updateAgentStats(agentId, updates) {
    const currentStats = this.getAgentStats(agentId);
    const updatedStats = {
      ...currentStats,
      ...updates,
      lastUpdated: new Date().toISOString()
    };

    // Recalculate derived metrics
    updatedStats.averageSessionTime = updatedStats.totalSessions > 0 
      ? updatedStats.totalSessionTime / updatedStats.totalSessions 
      : 0;

    updatedStats.successRate = updatedStats.totalSessions > 0 
      ? (updatedStats.successfulInteractions / updatedStats.totalSessions) * 100 
      : 0;

    updatedStats.averageResponseTime = updatedStats.responseTime.length > 0
      ? updatedStats.responseTime.reduce((a, b) => a + b, 0) / updatedStats.responseTime.length
      : 0;

    const statsKey = `${this.STORAGE_PREFIX}${agentId}`;
    localStorage.setItem(statsKey, JSON.stringify(updatedStats));
    
    // Update global stats
    this.updateGlobalStats(agentId, updates);
    
    return updatedStats;
  }

  /**
   * Record a view for an agent
   * @param {string} agentId - Agent blob ID
   */
  recordView(agentId) {
    const today = new Date().toISOString().split('T')[0];
    const currentStats = this.getAgentStats(agentId);
    
    const dailyViews = { ...currentStats.dailyViews };
    dailyViews[today] = (dailyViews[today] || 0) + 1;

    this.updateAgentStats(agentId, {
      views: currentStats.views + 1,
      dailyViews
    });
  }

  /**
   * Record a purchase for an agent
   * @param {string} agentId - Agent blob ID
   * @param {number} amount - Purchase amount in USDC
   */
  recordPurchase(agentId, amount) {
    const today = new Date().toISOString().split('T')[0];
    const month = new Date().toISOString().substring(0, 7);
    const currentStats = this.getAgentStats(agentId);
    
    const dailyPurchases = { ...currentStats.dailyPurchases };
    const monthlyRevenue = { ...currentStats.monthlyRevenue };
    
    dailyPurchases[today] = (dailyPurchases[today] || 0) + 1;
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + amount;

    this.updateAgentStats(agentId, {
      purchases: currentStats.purchases + 1,
      revenue: currentStats.revenue + amount,
      dailyPurchases,
      monthlyRevenue
    });
  }

  /**
   * Start a chat session
   * @param {string} agentId - Agent blob ID
   * @returns {string} Session ID
   */
  startChatSession(agentId) {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const currentStats = this.getAgentStats(agentId);
    
    const newSession = {
      id: sessionId,
      startTime: Date.now(),
      endTime: null,
      messageCount: 0,
      successful: false,
      duration: 0
    };

    const sessions = [...currentStats.sessions, newSession];

    this.updateAgentStats(agentId, {
      chats: currentStats.chats + 1,
      totalSessions: currentStats.totalSessions + 1,
      sessions
    });

    // Store current session ID for tracking
    sessionStorage.setItem('current_session_id', sessionId);
    sessionStorage.setItem('current_agent_id', agentId);

    return sessionId;
  }

  /**
   * End a chat session
   * @param {string} agentId - Agent blob ID
   * @param {string} sessionId - Session ID
   * @param {boolean} successful - Whether session was successful
   */
  endChatSession(agentId, sessionId, successful = true) {
    const currentStats = this.getAgentStats(agentId);
    const sessions = currentStats.sessions.map(session => {
      if (session.id === sessionId) {
        const duration = Date.now() - session.startTime;
        return {
          ...session,
          endTime: Date.now(),
          duration,
          successful
        };
      }
      return session;
    });

    const completedSession = sessions.find(s => s.id === sessionId);
    const totalSessionTime = currentStats.totalSessionTime + (completedSession?.duration || 0);
    const successfulInteractions = successful 
      ? currentStats.successfulInteractions + 1 
      : currentStats.successfulInteractions;

    this.updateAgentStats(agentId, {
      sessions,
      totalSessionTime,
      successfulInteractions,
      completedTasks: successful ? currentStats.completedTasks + 1 : currentStats.completedTasks
    });

    // Clear session storage
    sessionStorage.removeItem('current_session_id');
    sessionStorage.removeItem('current_agent_id');
  }

  /**
   * Record response time
   * @param {string} agentId - Agent blob ID
   * @param {number} responseTimeMs - Response time in milliseconds
   */
  recordResponseTime(agentId, responseTimeMs) {
    const currentStats = this.getAgentStats(agentId);
    const responseTime = [...currentStats.responseTime, responseTimeMs];
    
    // Keep only last 100 response times to prevent unlimited growth
    if (responseTime.length > 100) {
      responseTime.shift();
    }

    this.updateAgentStats(agentId, { responseTime });
  }

  /**
   * Update review statistics
   * @param {string} agentId - Agent blob ID
   * @param {Array} reviews - Array of reviews
   */
  updateReviewStats(agentId, reviews) {
    const totalReviews = reviews.length;
    let averageRating = 0;
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    if (totalReviews > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      averageRating = totalRating / totalReviews;

      reviews.forEach(review => {
        ratingDistribution[review.rating]++;
      });
    }

    this.updateAgentStats(agentId, {
      totalReviews,
      averageRating,
      ratingDistribution
    });
  }

  /**
   * Get formatted stats for display
   * @param {string} agentId - Agent blob ID
   * @returns {Object} Formatted statistics
   */
  getFormattedStats(agentId) {
    const stats = this.getAgentStats(agentId);
    
    return {
      revenue: this.formatCurrency(stats.revenue),
      sessions: stats.totalSessions,
      averageSession: this.formatDuration(stats.averageSessionTime),
      successRate: `${Math.round(stats.successRate)}%`,
      averageResponseTime: this.formatDuration(stats.averageResponseTime),
      uptime: `${stats.uptime.toFixed(1)}%`,
      customerSatisfaction: `${stats.averageRating.toFixed(1)}/5.0`,
      revenueChange: this.calculateRevenueChange(stats),
      sessionsChange: this.calculateSessionsChange(stats),
      views: stats.views,
      purchases: stats.purchases,
      completedTasks: stats.completedTasks
    };
  }

  /**
   * Calculate revenue change percentage
   * @param {Object} stats - Agent statistics
   * @returns {string} Formatted change percentage
   */
  calculateRevenueChange(stats) {
    const currentMonth = new Date().toISOString().substring(0, 7);
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 7);
    
    const currentRevenue = stats.monthlyRevenue[currentMonth] || 0;
    const lastRevenue = stats.monthlyRevenue[lastMonth] || 0;
    
    if (lastRevenue === 0) return '+0% from last month';
    
    const change = ((currentRevenue - lastRevenue) / lastRevenue) * 100;
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}% from last month`;
  }

  /**
   * Calculate sessions change
   * @param {Object} stats - Agent statistics
   * @returns {string} Formatted change description
   */
  calculateSessionsChange(stats) {
    const today = new Date().toISOString().split('T')[0];
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const recentSessions = stats.sessions.filter(session => {
      const sessionDate = new Date(session.startTime).toISOString().split('T')[0];
      return sessionDate >= lastWeek;
    }).length;
    
    return `+${recentSessions} this week`;
  }

  /**
   * Format currency
   * @param {number} amount - Amount to format
   * @returns {string} Formatted currency
   */
  formatCurrency(amount) {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  /**
   * Format duration from milliseconds
   * @param {number} ms - Duration in milliseconds
   * @returns {string} Formatted duration
   */
  formatDuration(ms) {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
    return `${(ms / 3600000).toFixed(1)}h`;
  }

  /**
   * Update global statistics
   * @param {string} agentId - Agent blob ID
   * @param {Object} updates - Statistics updates
   */
  updateGlobalStats(agentId, updates) {
    try {
      const globalStats = JSON.parse(localStorage.getItem(this.GLOBAL_STATS_KEY) || '{}');
      
      if (!globalStats[agentId]) {
        globalStats[agentId] = {
          lastActivity: new Date().toISOString(),
          totalInteractions: 0
        };
      }

      globalStats[agentId].lastActivity = new Date().toISOString();
      globalStats[agentId].totalInteractions += Object.keys(updates).length;

      localStorage.setItem(this.GLOBAL_STATS_KEY, JSON.stringify(globalStats));
    } catch (error) {
      console.error('Error updating global stats:', error);
    }
  }

  /**
   * Get trending agents based on recent activity
   * @param {number} limit - Number of agents to return
   * @returns {Array} Trending agent IDs
   */
  getTrendingAgents(limit = 10) {
    try {
      const globalStats = JSON.parse(localStorage.getItem(this.GLOBAL_STATS_KEY) || '{}');
      
      return Object.entries(globalStats)
        .sort(([, a], [, b]) => new Date(b.lastActivity) - new Date(a.lastActivity))
        .slice(0, limit)
        .map(([agentId]) => agentId);
    } catch (error) {
      console.error('Error getting trending agents:', error);
      return [];
    }
  }

  /**
   * Clear all statistics (for development/testing)
   * @param {string} agentId - Optional agent ID to clear specific stats
   */
  clearStats(agentId = null) {
    if (agentId) {
      localStorage.removeItem(`${this.STORAGE_PREFIX}${agentId}`);
    } else {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(this.STORAGE_PREFIX) || key === this.GLOBAL_STATS_KEY
      );
      keys.forEach(key => localStorage.removeItem(key));
    }
  }
}

export default new AgentStatsService(); 