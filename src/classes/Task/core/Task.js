/**
 * Base Task class - Abstract base class for all task types
 */
export default class Task {
  constructor(id, config = {}) {
    this.id = id;
    this.type = config.type || 'basic';
    this.title = config.title || 'Untitled Task';
    this.description = config.description || '';
    this.priority = config.priority || 0;
    this.requirements = config.requirements || {};
    this.rewards = config.rewards || {};
    this.status = 'active'; // active, completed, failed, locked
    this.progress = {};
    this.metadata = config.metadata || {};
    this.onComplete = config.onComplete || null;
    this.onProgress = config.onProgress || null;
    
    // Track creation and completion times
    this.createdAt = Date.now();
    this.completedAt = null;
    
    // Validation
    this.validate();
  }

  /**
   * Validate task configuration
   */
  validate() {
    if (!this.id) {
      throw new Error('Task must have an ID');
    }
    if (!this.title) {
      throw new Error('Task must have a title');
    }
  }

  /**
   * Update task progress - to be overridden by specific task types
   * @param {Object} data - Progress data
   * @returns {boolean} - Whether task is completed after this update
   */
  updateProgress(data) {
    // Base implementation
    Object.assign(this.progress, data);
    
    const completed = this.checkCompletion();
    if (completed && this.status !== 'completed') {
      this.complete();
    }
    
    if (this.onProgress) {
      this.onProgress(this.progress, this);
    }
    
    return completed;
  }

  /**
   * Check if task is completed - to be overridden by specific task types
   * @returns {boolean}
   */
  checkCompletion() {
    // Base implementation - override in subclasses
    return false;
  }

  /**
   * Mark task as completed
   */
  complete() {
    if (this.status === 'completed') return;
    
    this.status = 'completed';
    this.completedAt = Date.now();
    
    if (this.onComplete) {
      this.onComplete(this);
    }
  }

  /**
   * Mark task as failed
   */
  fail() {
    this.status = 'failed';
  }

  /**
   * Reset task progress
   */
  reset() {
    this.status = 'active';
    this.progress = {};
    this.completedAt = null;
  }

  /**
   * Get task progress percentage
   * @returns {number} - Progress percentage (0-100)
   */
  getProgressPercentage() {
    return 0; // Override in subclasses
  }

  /**
   * Get human-readable progress string
   * @returns {string}
   */
  getProgressString() {
    return `${this.getProgressPercentage()}%`;
  }

  /**
   * Check if task is active
   * @returns {boolean}
   */
  isActive() {
    return this.status === 'active';
  }

  /**
   * Check if task is completed
   * @returns {boolean}
   */
  isCompleted() {
    return this.status === 'completed';
  }

  /**
   * Check if task is failed
   * @returns {boolean}
   */
  isFailed() {
    return this.status === 'failed';
  }

}
