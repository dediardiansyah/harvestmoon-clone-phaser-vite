/**
 * Task System Exports
 * Central export file untuk semua komponen task system
 */

// Core classes
export { default as Task } from "./core/Task.js";
export { default as AnimalTask } from "./core/AnimalTask.js";
export { default as TaskFactory } from "./core/TaskFactory.js";
export { default as TaskEventEmitter } from "./core/TaskEventEmitter.js";

// Main components
export { default as TaskManager } from "./TaskManager.js";
export { default as TaskUI } from "./TaskUI.js";
export { default as TaskIndicator } from "./TaskIndicator.js";
export { default as TaskSystemIntegration } from "./TaskSystemIntegration.js";

// Configuration
export {
  default as modernTaskConfig,
  TaskConfigManager,
} from "../../config/task-config.js";

// Convenience exports
export {
  TaskSystemIntegration as TaskSystem,
  TaskManager as TaskManager,
  TaskUI as TaskUI,
  TaskIndicator as TaskIndicator,
};

/**
 * Quick setup function untuk mudah implementasi
 * @param {Phaser.Scene} scene - Phaser scene instance
 * @param {Object} config - Configuration options
 * @returns {TaskSystemIntegration}
 */
export function createTaskSystem(scene) {
  return new TaskSystemIntegration(scene);
}
