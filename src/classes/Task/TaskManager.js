import TaskEventEmitter from './core/TaskEventEmitter.js';
import TaskFactory from './core/TaskFactory.js';

/**
 *  Task Manager - Handles all task-related operations
 * Following SOLID principles and clean architecture
 */
export default class TaskManager extends TaskEventEmitter {
  constructor(scene, config = {}) {
    super();
    
    this.scene = scene;
    this.config = {
      maxCompletedTasks: 100,
      enableLogging: true,
      ...config
    };

    // Task collections
    this.tasks = new Map(); // Active tasks
    this.completedTasks = new Map(); // Completed tasks
    this.taskQueue = []; // Tasks waiting to be activated
    
    // State management
    this.isInitialized = false;
    this.currentScene = null;
    this.statistics = {
      totalTasksCreated: 0,
      totalTasksCompleted: 0,
      totalTasksFailed: 0
    };
    
    this.initialize();
  }

  /**
   * Initialize the task manager
   */
  initialize() {
    if (this.isInitialized) return;
    
    this.isInitialized = true;
    this.emit('manager:initialized', this);
    
    this.log('Task Manager initialized');
  }

  /**
   * Add a new task
   * @param {Task|Object} task - Task instance or task configuration
   * @returns {Task}
   */
  addTask(task) {
    let taskInstance;
    
    if (task.constructor.name === 'Object') {
      // Create task from configuration
      taskInstance = TaskFactory.createTask(task.type, task.id, task);
    } else {
      // Use existing task instance
      taskInstance = task;
    }

    // Setup task event listeners
    this.setupTaskListeners(taskInstance);
    
    // Add to active tasks
    this.tasks.set(taskInstance.id, taskInstance);
    this.statistics.totalTasksCreated++;
    
    this.emit('task:added', taskInstance);
    this.log(`Task added: ${taskInstance.id} (${taskInstance.type})`);
    
    return taskInstance;
  }

  /**
   * Remove a task
   * @param {string} taskId - Task ID
   * @returns {boolean}
   */
  removeTask(taskId) {
    const task = this.tasks.get(taskId);
    if (!task) {
      this.log(`Task not found for removal: ${taskId}`, 'warn');
      return false;
    }

    this.tasks.delete(taskId);
    this.emit('task:removed', task);
    this.log(`Task removed: ${taskId}`);
    
    return true;
  }

  /**
   * Get a task by ID
   * @param {string} taskId - Task ID
   * @returns {Task|null}
   */
  getTask(taskId) {
    return this.tasks.get(taskId) || null;
  }

  /**
   * Get all active tasks
   * @returns {Array<Task>}
   */
  getActiveTasks() {
    return Array.from(this.tasks.values()).filter(task => task.isActive());
  }

  /**
   * Get all tasks (active and inactive)
   * @returns {Array<Task>}
   */
  getAllTasks() {
    return Array.from(this.tasks.values());
  }

  /**
   * Get all completed tasks
   * @returns {Array<Task>}
   */
  getCompletedTasks() {
    return Array.from(this.completedTasks.values());
  }

  /**
   * Check if target has active tasks
   * @param {string} targetName - Target name (animal name, object name, etc.)
   * @returns {boolean}
   */
  hasActiveTasksForTarget(targetName) {
    const task = this.getTask(targetName);
    return task && task.isActive();
  }

  /**
   * Get tasks by type
   * @param {string} type - Task type
   * @returns {Array<Task>}
   */
  getTasksByType(type) {
    return Array.from(this.tasks.values()).filter(task => task.type === type);
  }

  /**
   * Update task progress
   * @param {string} taskId - Task ID
   * @param {Object} progressData - Progress data
   * @returns {boolean}
   */
  updateTaskProgress(taskId, progressData) {
    const task = this.getTask(taskId);
    if (!task) {
      this.log(`Task not found for progress update: ${taskId}`, 'warn');
      return false;
    }

    const wasCompleted = task.updateProgress(progressData);
    this.emit('task:progress', task, progressData);
    
    return wasCompleted;
  }

  /**
   * Handle animal interaction
   * @param {string} animalName - Animal name
   * @param {string} action - Action performed (feed, talk, etc.)
   * @returns {boolean}
   */
  handleAnimalInteraction(animalName, action) {
    const task = this.getTask(animalName);
    if (!task || task.type !== 'animal') {
      this.log(`Animal task not found: ${animalName}`, 'warn');
      return false;
    }

    const completed = task.performAction(action);
    this.emit('animal:interaction', animalName, action, task);
    
    return completed;
  }

  /**
   * Handle item collection
   * @param {string} taskId - Task ID
   * @param {string|Object} item - Item collected
   * @param {number} amount - Amount collected
   * @param {string} location - Location where collected
   * @returns {boolean}
   */
  handleItemCollection(taskId, item, amount = 1, location = null) {
    const task = this.getTask(taskId);
    if (!task || task.type !== 'collection') {
      this.log(`Collection task not found: ${taskId}`, 'warn');
      return false;
    }

    const completed = task.collectItem(item, amount, location);
    this.emit('item:collected', taskId, item, amount, location, task);
    
    return completed;
  }

  /**
   * Complete a task manually
   * @param {string} taskId - Task ID
   * @returns {boolean}
   */
  completeTask(taskId) {
    const task = this.getTask(taskId);
    if (!task) {
      this.log(`Task not found for completion: ${taskId}`, 'warn');
      return false;
    }

    task.complete();
    return true;
  }

  /**
   * Get overall progress statistics
   * @returns {Object}
   */
  getOverallProgress() {
    const activeTasks = this.getActiveTasks();
    const totalActiveTasks = activeTasks.length;
    const completedTasks = this.statistics.totalTasksCompleted;
    const totalTasks = totalActiveTasks + completedTasks;
    
    if (totalTasks === 0) {
      return {
        completed: completedTasks,
        total: completedTasks > 0 ? completedTasks : 1, // Avoid division by zero
        active: 0,
        percentage: completedTasks > 0 ? 100 : 0
      };
    }

    // Calculate progress based on completed tasks + partial progress of active tasks
    let totalProgressPoints = completedTasks * 100; // Each completed task = 100 points
    
    // Add partial progress from active tasks
    const activeTasksProgress = activeTasks.reduce((sum, task) => {
      return sum + task.getProgressPercentage();
    }, 0);
    
    totalProgressPoints += activeTasksProgress;
    
    // Calculate overall percentage
    const overallPercentage = totalProgressPoints / (totalTasks * 100) * 100;

    return {
      completed: completedTasks,
      total: totalTasks,
      active: totalActiveTasks,
      percentage: Math.round(overallPercentage)
    };
  }

  /**
   * Get tasks for UI display
   * @param {Object} options - Display options
   * @returns {Array<Object>}
   */
  getTasksForDisplay(options = {}) {
    const {
      includeCompleted = false,
      maxTasks = 10,
      sortBy = 'priority', // priority, createdAt, progress
      filterType = null
    } = options;

    let tasks = this.getActiveTasks();
    
    if (includeCompleted) {
      tasks = [...tasks, ...this.getCompletedTasks()];
    }

    // Filter by type if specified
    if (filterType) {
      tasks = tasks.filter(task => task.type === filterType);
    }

    // Sort tasks
    tasks.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          return b.priority - a.priority;
        case 'createdAt':
          return b.createdAt - a.createdAt;
        case 'progress':
          return b.getProgressPercentage() - a.getProgressPercentage();
        default:
          return 0;
      }
    });

    // Limit results
    tasks = tasks.slice(0, maxTasks);

    // Format for display
    return tasks.map(task => ({
      id: task.id,
      type: task.type,
      title: task.title,
      description: task.description,
      status: task.status,
      progress: task.getProgressPercentage(),
      progressString: task.getProgressString(),
      priority: task.priority
    }));
  }

  /**
   * Update current scene
   * @param {string} sceneName - Scene name
   */
  updateScene(sceneName) {
    this.currentScene = sceneName;
    this.emit('scene:changed', sceneName);
    this.log(`Scene changed to: ${sceneName}`);
  }

  /**
   * Setup task event listeners
   * @param {Task} task - Task instance
   */
  setupTaskListeners(task) {
    task.onProgress = (progress, taskInstance) => {
      this.emit('task:progress', taskInstance, progress);
    };

    task.onComplete = (taskInstance) => {
      this.handleTaskCompletion(taskInstance);
    };
  }

  /**
   * Handle task completion
   * @param {Task} task - Completed task
   */
  handleTaskCompletion(task) {
    // Move to completed tasks
    this.tasks.delete(task.id);
    this.completedTasks.set(task.id, task);
    this.statistics.totalTasksCompleted++;

    // Clean up old completed tasks if needed
    if (this.completedTasks.size > this.config.maxCompletedTasks) {
      const oldestId = Array.from(this.completedTasks.keys())[0];
      this.completedTasks.delete(oldestId);
    }

    this.emit('task:completed', task);
    this.log(`Task completed: ${task.id} (${task.type})`);
  }

  /**
   * Log message with timestamp
   * @param {string} message - Message to log
   * @param {string} level - Log level (info, warn, error)
   * @param {any} data - Additional data
   */
  log(message, level = 'info', data = null) {
    if (!this.config.enableLogging) return;

    const timestamp = new Date().toISOString();
    const logMessage = `[TaskManager ${timestamp}] ${message}`;

    switch (level) {
      case 'warn':
        console.warn(logMessage, data);
        break;
      case 'error':
        console.error(logMessage, data);
        break;
      default:
        console.log(logMessage, data);
    }
  }

  /**
   * Clean up resources
   */
  destroy() {
    // Clear all listeners
    this.removeAllListeners();

    // Clear tasks
    this.tasks.clear();
    this.completedTasks.clear();

    this.log('Task Manager destroyed');
  }
}
