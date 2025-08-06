import AnimalTask from "../classes/Task/core/AnimalTask.js";
import TaskFactory from "../classes/Task/core/TaskFactory.js";

/**
 * Enhanced Task Configuration
 * Provides a more flexible and extensible task configuration system
 */
const modernTaskConfig = {
  // Configuration metadata
  version: "2.0.0",
  lastUpdated: Date.now(),

  // Global task settings
  settings: {
    enableNotifications: true,
    enableSounds: true,
    maxActiveTasksPerType: 10,
    enableTaskPriorities: true,
    enableTaskCategories: true,
  },

  // Task categories for organization
  categories: {
    animals: {
      name: "Animal Care",
      color: 0x795548,
      icon: "🐄",
      description: "Taking care of farm animals",
    },
  },

  // Priority levels
  priorities: {
    low: { value: 1, name: "Low", color: 0x9e9e9e },
    normal: { value: 2, name: "Normal", color: 0x2196f3 },
    high: { value: 3, name: "High", color: 0xff9800 },
    urgent: { value: 4, name: "Urgent", color: 0xf44336 },
    critical: { value: 5, name: "Critical", color: 0x9c27b0 },
  },

  // Reward types
  rewardTypes: {
    gold: { name: "Gold", icon: "💰" },
    items: { name: "Items", icon: "📦" },
    experience: { name: "Experience", icon: "⭐" },
    reputation: { name: "Reputation", icon: "❤️" },
    unlocks: { name: "Unlocks", icon: "🔓" },
  },

  // Animal task templates
  animalTasks: {
    // Basic animal care tasks
    animalCare: {
      cow1: {
        type: "animal",
        animalName: "cow1",
        title: "Care for Cow #1",
        description: "Feed and talk to the first cow",
        category: "animals",
        priority: "normal",
        requiredActions: ["feed", "talk"],
        location: "cow-shed",
        rewards: {
          gold: 50,
          experience: 10,
          reputation: 5,
        },
        metadata: {
          estimatedTime: 2, // minutes
          difficulty: "easy",
        },
      },
      cow2: {
        type: "animal",
        animalName: "cow2",
        title: "Care for Cow #2",
        description: "Feed and talk to the second cow",
        category: "animals",
        priority: "normal",
        requiredActions: ["feed", "talk"],
        location: "cow-shed",
        rewards: {
          gold: 50,
          experience: 10,
          reputation: 5,
        },
        metadata: {
          estimatedTime: 2,
          difficulty: "easy",
        },
      },
      cow3: {
        type: "animal",
        animalName: "cow3",
        title: "Care for Cow #3",
        description: "Feed and talk to the third cow",
        category: "animals",
        priority: "normal",
        requiredActions: ["feed", "talk"],
        location: "cow-shed",
        rewards: {
          gold: 50,
          experience: 10,
          reputation: 5,
        },
        metadata: {
          estimatedTime: 2,
          difficulty: "easy",
        },
      },
      cowBaby: {
        type: "animal",
        animalName: "cowBaby",
        title: "Care for Baby Cow",
        description: "Feed and talk to the baby cow",
        category: "animals",
        priority: "high", // Babies need more attention
        requiredActions: ["feed", "talk", "pet"],
        location: "cow-shed",
        rewards: {
          gold: 75,
          experience: 15,
          reputation: 10,
        },
        metadata: {
          estimatedTime: 3,
          difficulty: "easy",
        },
      },
      chicken1: {
        type: "animal",
        animalName: "chicken1",
        title: "Care for Chicken #1",
        description: "Feed and talk to the first chicken",
        category: "animals",
        priority: "normal",
        requiredActions: ["feed", "talk"],
        location: "chicken-coop",
        rewards: {
          gold: 30,
          experience: 8,
          reputation: 3,
        },
        metadata: {
          estimatedTime: 1,
          difficulty: "easy",
        },
      },
      chicken2: {
        type: "animal",
        animalName: "chicken2",
        title: "Care for Chicken #2",
        description: "Feed and talk to the second chicken",
        category: "animals",
        priority: "normal",
        requiredActions: ["feed", "talk"],
        location: "chicken-coop",
        rewards: {
          gold: 30,
          experience: 8,
          reputation: 3,
        },
        metadata: {
          estimatedTime: 1,
          difficulty: "easy",
        },
      },
      chicken3: {
        type: "animal",
        animalName: "chicken3",
        title: "Care for Chicken #3",
        description: "Feed and talk to the third chicken",
        category: "animals",
        priority: "normal",
        requiredActions: ["feed", "talk"],
        location: "chicken-coop",
        rewards: {
          gold: 30,
          experience: 8,
          reputation: 3,
        },
        metadata: {
          estimatedTime: 1,
          difficulty: "easy",
        },
      },
      chicken4: {
        type: "animal",
        animalName: "chicken4",
        title: "Care for Chicken #4",
        description: "Feed and talk to the fourth chicken",
        category: "animals",
        priority: "normal",
        requiredActions: ["feed", "talk"],
        location: "chicken-coop",
        rewards: {
          gold: 30,
          experience: 8,
          reputation: 3,
        },
        metadata: {
          estimatedTime: 1,
          difficulty: "easy",
        },
      },
    },
  },

};

/**
 * Task Configuration Manager
 * Provides methods to work with task configurations
 */
class TaskConfigManager {
  constructor() {
    this.config = modernTaskConfig;
  }

  /**
   * Get all animal task configurations
   * @returns {Object}
   */
  getAnimalTaskConfigs() {
    return this.config.animalTasks.animalCare;
  }

  /**
   * Get task configuration by ID
   * @param {string} taskId - Task ID
   * @returns {Object|null}
   */
  getTaskConfig(taskId) {
    // Search in animal task category only
    const animalTasks = this.config.animalTasks.animalCare;
    
    if (animalTasks[taskId]) {
      return animalTasks[taskId];
    }

    return null;
  }

  /**
   * Get tasks by category
   * @param {string} categoryName - Category name
   * @returns {Array}
   */
  getTasksByCategory(categoryName) {
    const tasks = [];
    
    // Only search in animal tasks now
    if (categoryName === 'animals') {
      const allTasks = this.config.animalTasks.animalCare;
      
      Object.entries(allTasks).forEach(([id, taskConfig]) => {
        if (taskConfig.category === categoryName) {
          tasks.push({ id, ...taskConfig });
        }
      });
    }

    return tasks;
  }

  /**
   * Get tasks by priority
   * @param {string} priority - Priority level
   * @returns {Array}
   */
  getTasksByPriority(priority) {
    const tasks = [];
    
    // Only search in animal tasks now
    const allTasks = this.config.animalTasks.animalCare;

    Object.entries(allTasks).forEach(([id, taskConfig]) => {
      if (taskConfig.priority === priority) {
        tasks.push({ id, ...taskConfig });
      }
    });

    return tasks;
  }

  /**
   * Create tasks from configuration
   * @param {Array<string>} taskIds - Task IDs to create
   * @returns {Array<Task>}
   */
  createTasksFromConfig(taskIds) {
    const tasks = [];

    taskIds.forEach((taskId) => {
      const config = this.getTaskConfig(taskId);

      if (config) {
        try {
          const task = TaskFactory.createTask(config.type, taskId, config);
          tasks.push(task);
        } catch (error) {
          console.error(`Failed to create task ${taskId}:`, error);
        }
      } else {
        console.warn(`Task configuration not found: ${taskId}`);
      }
    });

    return tasks;
  }

  /**
   * Get starter tasks for new players
   * @returns {Array}
   */
  getStarterTasks() {
    return [
      "cow1",
      "cow2",
      "cow3",
      "cowBaby",
      "chicken1",
      "chicken2",
      "chicken3",
      "chicken4",
    ];
  }

  /**
   * Validate task configuration
   * @param {Object} taskConfig - Task configuration
   * @returns {boolean}
   */
  validateTaskConfig(taskConfig) {
    const required = ["type", "title", "description", "category"];
    return required.every((field) => taskConfig.hasOwnProperty(field));
  }

  /**
   * Get category information
   * @param {string} categoryName - Category name
   * @returns {Object|null}
   */
  getCategoryInfo(categoryName) {
    return this.config.categories[categoryName] || null;
  }

  /**
   * Get priority information
   * @param {string} priorityName - Priority name
   * @returns {Object|null}
   */
  getPriorityInfo(priorityName) {
    return this.config.priorities[priorityName] || null;
  }

  /**
   * Get settings
   * @returns {Object}
   */
  getSettings() {
    return this.config.settings;
  }
}

// Export the default configuration and manager
export default modernTaskConfig;
export { TaskConfigManager };
