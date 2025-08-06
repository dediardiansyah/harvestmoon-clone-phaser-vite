import Task from './Task.js';
import AnimalTask from './AnimalTask.js';

/**
 * Task Factory - Creates tasks of different types
 */
export default class TaskFactory {
  static taskTypes = new Map([
    ['basic', Task],
    ['animal', AnimalTask]
  ]);

  /**
   * Register a new task type
   * @param {string} type - Task type name
   * @param {Class} TaskClass - Task class
   */
  static registerTaskType(type, TaskClass) {
    if (!(TaskClass.prototype instanceof Task)) {
      throw new Error('Task class must extend the base Task class');
    }
    this.taskTypes.set(type, TaskClass);
  }

  /**
   * Create a task of specified type
   * @param {string} type - Task type
   * @param {string} id - Task ID
   * @param {Object} config - Task configuration
   * @returns {Task}
   */
  static createTask(type, id, config = {}) {
    const TaskClass = this.taskTypes.get(type);
    
    if (!TaskClass) {
      throw new Error(`Unknown task type: ${type}`);
    }
    
    return new TaskClass(id, { ...config, type });
  }

  /**
   * Create an animal task
   * @param {string} animalName - Name of the animal
   * @param {Object} config - Task configuration
   * @returns {AnimalTask}
   */
  static createAnimalTask(animalName, config = {}) {
    return this.createTask('animal', animalName, {
      animalName,
      title: `Care for ${animalName}`,
      description: `Feed and talk to ${animalName}`,
      requiredActions: ['feed', 'talk'],
      ...config
    });
  }

  /**
   * Create tasks from configuration array
   * @param {Array} taskConfigs - Array of task configurations
   * @returns {Array<Task>}
   */
  static createTasksFromConfig(taskConfigs) {
    return taskConfigs.map(config => {
      const { type, id, ...taskConfig } = config;
      return this.createTask(type, id, taskConfig);
    });
  }

  /**
   * Get all registered task types
   * @returns {Array<string>}
   */
  static getRegisteredTypes() {
    return Array.from(this.taskTypes.keys());
  }

  /**
   * Check if task type is registered
   * @param {string} type - Task type
   * @returns {boolean}
   */
  static isTypeRegistered(type) {
    return this.taskTypes.has(type);
  }

  /**
   * Get task class for type
   * @param {string} type - Task type
   * @returns {Class|null}
   */
  static getTaskClass(type) {
    return this.taskTypes.get(type) || null;
  }
}
