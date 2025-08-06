/**
 * Task Event System - Handles task-related events
 */
export default class TaskEventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  /**
   * Add event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @param {Object} context - Context for callback execution
   */
  on(event, callback, context = null) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    this.listeners.get(event).push({
      callback,
      context,
      once: false
    });
  }

  /**
   * Add one-time event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @param {Object} context - Context for callback execution
   */
  once(event, callback, context = null) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    this.listeners.get(event).push({
      callback,
      context,
      once: true
    });
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function to remove
   */
  off(event, callback) {
    if (!this.listeners.has(event)) return;
    
    const eventListeners = this.listeners.get(event);
    const index = eventListeners.findIndex(listener => listener.callback === callback);
    
    if (index !== -1) {
      eventListeners.splice(index, 1);
      
      // Clean up empty event arrays
      if (eventListeners.length === 0) {
        this.listeners.delete(event);
      }
    }
  }

  /**
   * Emit an event
   * @param {string} event - Event name
   * @param {...any} args - Arguments to pass to listeners
   */
  emit(event, ...args) {
    if (!this.listeners.has(event)) return;
    
    const eventListeners = this.listeners.get(event);
    const toRemove = [];
    
    // Execute all listeners
    eventListeners.forEach((listener, index) => {
      try {
        if (listener.context) {
          listener.callback.call(listener.context, ...args);
        } else {
          listener.callback(...args);
        }
        
        // Mark one-time listeners for removal
        if (listener.once) {
          toRemove.push(index);
        }
      } catch (error) {
        console.error(`Error in task event listener for "${event}":`, error);
      }
    });
    
    // Remove one-time listeners (in reverse order to maintain indices)
    toRemove.reverse().forEach(index => {
      eventListeners.splice(index, 1);
    });
    
    // Clean up empty event arrays
    if (eventListeners.length === 0) {
      this.listeners.delete(event);
    }
  }

  /**
   * Remove all listeners for an event
   * @param {string} event - Event name (optional, removes all if not specified)
   */
  removeAllListeners(event = null) {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * Get number of listeners for an event
   * @param {string} event - Event name
   * @returns {number}
   */
  listenerCount(event) {
    return this.listeners.has(event) ? this.listeners.get(event).length : 0;
  }

  /**
   * Get all event names that have listeners
   * @returns {Array<string>}
   */
  eventNames() {
    return Array.from(this.listeners.keys());
  }

  /**
   * Check if event has any listeners
   * @param {string} event - Event name
   * @returns {boolean}
   */
  hasListeners(event) {
    return this.listeners.has(event) && this.listeners.get(event).length > 0;
  }
}
