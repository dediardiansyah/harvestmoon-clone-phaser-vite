import TaskManager from "./TaskManager.js";
import TaskUI from "./TaskUI.js";
import { TaskConfigManager } from "../../config/task-config.js";

/**
 * Task System Integration
 * Provides seamless integration between old and new task systems
 * Maintains backward compatibility while offering modern features
 */
export default class TaskSystemIntegration {
  constructor(scene) {
    this.scene = scene;

    // Core components
    this.taskManager = null;
    this.taskUI = null;
    this.configManager = null;
    this.indicators = new Map();
    this.objectLoader = null; // Reference to ObjectLoader for indicator management

    this.initialize();
  }

  /**
   * Initialize the task system
   */
  initialize() {
    // Initialize configuration manager
    this.configManager = new TaskConfigManager();

    this.initializeSystem();

    // Setup integration hooks
    this.setupIntegrationHooks();
  }

  /**
   * Setup task event listeners for indicator updates
   */
  setupTaskEventListeners() {
    // Listen for task progress and completion events
    this.taskManager.on("task:progress", (task, progress) => {
      this.onTaskStatusChanged(task);
    });

    this.taskManager.on("task:completed", (task) => {
      this.onTaskStatusChanged(task);
    });

    this.taskManager.on("animal:interaction", (animalName, action, task) => {
      this.onTaskStatusChanged(task);
    });
  }

  /**
   * Initialize modern task system
   */
  initializeSystem() {
    // Create modern task manager
    this.taskManager = new TaskManager(this.scene, {
      enableLogging: true,
      maxCompletedTasks: 50,
    });

    // Set up event listeners for indicator updates
    this.setupTaskEventListeners();

    // Create modern UI
    this.taskUI = new TaskUI(this.scene, this.taskManager, {
      position: { x: "right", y: "top" },
      width: 320,
      maxVisibleTasks: 8,
      showProgress: true,
    });

    // Load default tasks for new games
    this.loadDefaultTasks();
  }

  /**
   * Load default tasks for new games
   */
  loadDefaultTasks() {
    if (this.taskManager.tasks.size > 0) return; // Already has tasks

    const starterTaskIds = this.configManager.getStarterTasks();
    const starterTasks = this.configManager.createTasksFromConfig(starterTaskIds);

    starterTasks.forEach((task) => {
      this.taskManager.addTask(task);
      this.createTaskIndicator(task);
    });

    console.log(`Loaded ${starterTasks.length} starter tasks`);
  }


  /**
   * Setup integration hooks for backward compatibility
   */
  setupIntegrationHooks() {
    // Expose task system on scene for easy access
    this.scene._TASKS = {
      manager: this.createManagerProxy(),
      ui: this.createUIProxy(),
    };

    // Setup event forwarding
    this.setupEventForwarding();
  }

  /**
   * Create manager proxy for backward compatibility
   */
  createManagerProxy() {
    return {
      // Animal task handling
      handleAnimalTask: (animalName) => {
        const task = this.taskManager.getTask(animalName);
        if (task && task.type === "animal") {
          // Determine next action needed
          const remainingActions = task.getRemainingActions();
          if (remainingActions.length > 0) {
            const nextAction = remainingActions[0];
            return this.taskManager.handleAnimalInteraction(
              animalName,
              nextAction
            );
          }
        }
        return false;
      },

      // Direct animal interaction method
      handleAnimalInteraction: (animalName, action = null) => {
        return this.handleAnimalInteraction(animalName, action);
      },

      // Progress getter
      getProgress: () => {
        return this.taskManager.getOverallProgress();
      },

      // Active tasks getter
      getActiveTasks: () => {
        return this.taskManager.getTasksForDisplay({
          maxTasks: 20,
          includeCompleted: false,
        });
      },

      // Check if target has active tasks
      hasActiveTasksForTarget: (targetName) => {
        return this.taskManager.hasActiveTasksForTarget(targetName);
      },

      // Animal tasks getter
      get animalTasks() {
        const animalTasksProxy = {};
        this.taskManager.getTasksByType("animal").forEach((task) => {
          animalTasksProxy[task.id] = {
            feed: task.isActionCompleted("feed"),
            talk: task.isActionCompleted("talk"),
          };
        });
        return animalTasksProxy;
      },

      // Helper methods
      areAllAnimalsComplete: () => {
        const animalTasks = this.taskManager.getTasksByType("animal");
        return animalTasks.every((task) => task.isCompleted());
      },

      showMessage: (message) => {
        this.showTaskMessage(message);
      },

      removeIndicator: (taskId) => {
        this.removeTaskIndicator(taskId);
      },

      updateScene: (sceneName) => {
        this.taskManager.updateScene(sceneName);
      },

      destroy: () => {
        this.destroy();
      },
    };
  }

  /**
   * Create UI proxy for backward compatibility
   */
  createUIProxy() {
    return {
      toggle: () => this.taskUI.toggle(),
      show: () => this.taskUI.show(),
      hide: () => this.taskUI.hide(),
      getVisibility: () => this.taskUI.getVisibility(),
      destroy: () => this.taskUI.destroy(),
    };
  }

  /**
   * Setup event forwarding between systems
   */
  setupEventForwarding() {
    // Forward modern events to scene for legacy compatibility
    this.taskManager.on("task:completed", (task) => {
      this.scene.events.emit("task_completed", task);
      this.removeTaskIndicator(task.id);
    });

    this.taskManager.on("task:progress", (task, progress) => {
      this.scene.events.emit("task_progress", task, progress);
      this.updateTaskIndicator(task.id);
    });

    this.taskManager.on("animal:interaction", (animalName, action, task) => {
      this.scene.events.emit("animal_interaction", animalName, action, task);
    });
  }

  /**
   * Create task indicator for a task
   * @param {Task} task - Task instance
   * @param {boolean} shouldGlow - Whether indicator should glow (default: true for active tasks, false for completed)
   */
  createTaskIndicator(task, shouldGlow = null) {
    const sprite = this.scene._SPRITES && this.scene._SPRITES[task.id];
    if (!sprite) return;

    // Determine if should glow based on task status
    if (shouldGlow === null) {
      shouldGlow = task.status === "active";
    }

    // Use TaskIndicatorManager to create indicator
    if (this.indicatorManager) {
      this.indicatorManager.createIndicator(task.id, sprite.x, sprite.y - 20, {
        glowing: shouldGlow,
        taskType: task.type,
      });
    }

    return true;
  }

  /**
   * Update task indicator
   * @param {string} taskId - Task ID
   */
  updateTaskIndicator(taskId) {
    const task = this.taskManager.getTask(taskId);
    if (!task || !this.indicatorManager) return;

    // If task is completed, stop glowing
    if (task.status === "completed") {
      this.indicatorManager.setIndicatorGlowing(taskId, false);
    } else {
      // Update color based on progress
      const progress = task.getProgressPercentage();
      let color = 0xffff00; // Default yellow

      if (progress >= 75) {
        color = 0xffd700; // Gold for >75% progress
      } else if (progress >= 50) {
        color = 0xffa500; // Orange for >50% progress
      }

      this.indicatorManager.updateIndicator(taskId, {
        color: color,
        glowing: true,
      });
    }
  }

  /**
   * Remove task indicator
   * @param {string} taskId - Task ID
   */
  removeTaskIndicator(taskId) {
    if (this.indicatorManager) {
      this.indicatorManager.removeIndicator(taskId);
    }
  }

  /**
   * Show task message
   * @param {string} message - Message to show
   * @param {string} type - Message type (info, success, warning, error)
   */
  showTaskMessage(message, type = "info") {
    const colors = {
      info: "#ffffff",
      success: "#4CAF50",
      warning: "#FF9800",
      error: "#F44336",
    };

    const text = this.scene.add.text(
      this.scene.cameras.main.centerX,
      100,
      message,
      {
        fontSize: "16px",
        fill: colors[type],
        backgroundColor: "#000000",
        padding: { x: 12, y: 6 },
        borderRadius: 4,
      }
    );

    text.setOrigin(0.5);
    text.setScrollFactor(0);
    text.setDepth(1000);

    // Animation
    text.setScale(0.8);
    text.setAlpha(0);

    this.scene.tweens.add({
      targets: text,
      scale: 1,
      alpha: 1,
      duration: 300,
      ease: "Back.easeOut",
    });

    this.scene.time.delayedCall(3000, () => {
      this.scene.tweens.add({
        targets: text,
        alpha: 0,
        scale: 0.8,
        duration: 300,
        ease: "Back.easeIn",
        onComplete: () => text.destroy(),
      });
    });
  }

  /**
   * Handle animal interaction (backward compatibility)
   * @param {string} animalName - Animal name
   * @param {string} action - Action performed (optional, auto-determines next action)
   */
  handleAnimalInteraction(animalName, action = null) {
    const task = this.taskManager.getTask(animalName);
    if (!task || task.type !== "animal") {
      console.warn(`Animal task not found: ${animalName}`);
      return false;
    }

    // Auto-determine action if not specified (for backward compatibility)
    if (!action) {
      const remainingActions = task.getRemainingActions();
      action = remainingActions[0] || "talk";
    }

    const wasCompleted = task.performAction(action);

    // Show message
    this.showTaskMessage(`You ${action} ${animalName}!`, "success");

    // Update indicator
    this.updateTaskIndicator(animalName);

    // Remove indicator if completed (original behavior)
    if (wasCompleted) {
      this.removeTaskIndicator(animalName);
      this.showTaskMessage(`${animalName} is happy for today!`, "success");
    }

    return wasCompleted;
  }

  /**
   * Get progress data compatible with old system
   * @returns {Object}
   */
  getCompatibleProgress() {
    const modernProgress = this.taskManager.getOverallProgress();

    // Convert to old format for backward compatibility
    return {
      completed: modernProgress.completed,
      total: modernProgress.total,
      percentage: modernProgress.percentage,
    };
  }

  /**
   * Get active tasks compatible with old system
   * @returns {Array}
   */
  getCompatibleActiveTasks() {
    return this.taskManager
      .getTasksForDisplay({
        maxTasks: 20,
        includeCompleted: false,
      })
      .map((task) => ({
        id: task.id,
        instruction: task.progressString || task.title,
        type: task.type,
      }));
  }

  /**
   * Toggle task UI
   */
  toggleUI() {
    this.taskUI.toggle();
  }

  /**
   * Add new task (modern interface)
   * @param {Object} taskConfig - Task configuration
   * @returns {Task}
   */
  addTask(taskConfig) {
    const task = this.taskManager.addTask(taskConfig);
    this.createTaskIndicator(task);
    return task;
  }

  /**
   * Get task manager instance
   * @returns {TaskManager}
   */
  getTaskManager() {
    return this.taskManager;
  }

  /**
   * Get task UI instance
   * @returns {TaskUI}
   */
  getTaskUI() {
    return this.taskUI;
  }

  /**
   * Get configuration manager
   * @returns {TaskConfigManager}
   */
  getConfigManager() {
    return this.configManager;
  }

  /**
   * Check if modern system is active
   * @returns {boolean}
   */
  isSystemActive() {
    return this.taskManager instanceof TaskManager;
  }

  /**
   * Set ObjectLoader reference for indicator management
   * @param {ObjectLoader} objectLoader - ObjectLoader instance
   */
  setObjectLoader(objectLoader) {
    this.objectLoader = objectLoader;
    this.syncIndicatorsWithTasks();
  }

  /**
   * Synchronize indicators with current task states
   */
  syncIndicatorsWithTasks() {
    if (!this.objectLoader) return;

    const activeTasks = this.taskManager.getAllTasks();

    activeTasks.forEach((task) => {
      if (task.type === "animal") {
        const hasIncompleteTasks = !task.isCompleted();
        this.objectLoader.updateTaskIndicator(
          task.animalName || task.id,
          hasIncompleteTasks
        );
      }
    });
  }

  /**
   * Update indicators when task status changes
   * @param {Task} task - The task that changed
   */
  onTaskStatusChanged(task) {
    if (task.type === "animal" && this.objectLoader) {
      const hasIncompleteTasks = !task.isCompleted();
      this.objectLoader.updateTaskIndicator(
        task.animalName || task.id,
        hasIncompleteTasks
      );
    }
  }

  /**
   * Clean up and destroy the task system
   */
  destroy() {
    // Clean up ObjectLoader indicators
    if (this.objectLoader) {
      this.objectLoader.cleanupTaskIndicators();
      this.objectLoader = null;
    }

    // Destroy all indicators
    this.indicators.forEach((indicator) => indicator.destroy());
    this.indicators.clear();

    // Destroy core components
    if (this.taskManager) {
      this.taskManager.destroy();
    }

    if (this.taskUI) {
      this.taskUI.destroy();
    }

    // Clean up scene references
    if (this.scene._TASKS) {
      this.scene._TASKS = null;
    }
  }
}
