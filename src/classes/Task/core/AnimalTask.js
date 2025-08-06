import Task from './Task.js';

/**
 * Animal Task - Handles animal-specific tasks (feeding, talking, etc.)
 */
export default class AnimalTask extends Task {
  constructor(id, config = {}) {
    super(id, {
      type: 'animal',
      title: config.title || `${config.animalName || 'Animal'} Care`,
      description: config.description || `Take care of ${config.animalName || 'the animal'}`,
      ...config
    });

    this.animalName = config.animalName || id;
    this.location = config.location || null;
    this.requiredActions = config.requiredActions || ['feed', 'talk'];
    
    // Initialize progress for each required action
    this.progress = {};
    this.requiredActions.forEach(action => {
      this.progress[action] = false;
    });
  }

  /**
   * Perform an action on the animal
   * @param {string} action - Action to perform (feed, talk, etc.)
   * @returns {boolean} - Whether task is completed after this action
   */
  performAction(action) {
    if (!this.requiredActions.includes(action)) {
      console.warn(`Action "${action}" is not required for this animal task`);
      return false;
    }

    if (this.progress[action]) {
      console.warn(`Action "${action}" has already been performed on ${this.animalName}`);
      return false;
    }

    this.progress[action] = true;
    return this.updateProgress(this.progress);
  }

  /**
   * Check if all required actions are completed
   * @returns {boolean}
   */
  checkCompletion() {
    return this.requiredActions.every(action => this.progress[action]);
  }

  /**
   * Get progress percentage
   * @returns {number}
   */
  getProgressPercentage() {
    const completedActions = this.requiredActions.filter(action => this.progress[action]).length;
    return Math.round((completedActions / this.requiredActions.length) * 100);
  }

  /**
   * Get human-readable progress string
   * @returns {string}
   */
  getProgressString() {
    const remainingActions = this.requiredActions.filter(action => !this.progress[action]);
    
    if (remainingActions.length === 0) {
      return 'Completed';
    }
    
    return `${this.animalName}: ${remainingActions.join(' and ')}`;
  }

  /**
   * Get list of remaining actions
   * @returns {Array<string>}
   */
  getRemainingActions() {
    return this.requiredActions.filter(action => !this.progress[action]);
  }

  /**
   * Get list of completed actions
   * @returns {Array<string>}
   */
  getCompletedActions() {
    return this.requiredActions.filter(action => this.progress[action]);
  }

  /**
   * Check if specific action is completed
   * @param {string} action
   * @returns {boolean}
   */
  isActionCompleted(action) {
    return !!this.progress[action];
  }
}
