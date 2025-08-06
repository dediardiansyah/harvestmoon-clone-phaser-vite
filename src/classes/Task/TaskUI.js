/**
 *  Task UI - Clean, modular UI for task management
 * Follows component-based architecture with separation of concerns
 */
export default class TaskUI {
  constructor(scene, taskManager, config = {}) {
    this.scene = scene;
    this.taskManager = taskManager;
    this.config = {
      position: { x: "right", y: "top" }, // right/left/center, top/middle/bottom
      width: 320,
      maxHeight: 400,
      margin: 30, // Increased margin for better positioning
      maxVisibleTasks: 8,
      autoHide: false,
      showProgress: true,
      showPriority: true,
      animationDuration: 300,
      ...config,
    };

    // UI state
    this.isVisible = false;
    this.isInitialized = false;
    this.components = {};
    this.animations = [];

    // Theme configuration
    this.theme = {
      background: {
        color: 0x1a1a1a,
        alpha: 0.95,
        borderColor: 0x4caf50,
        borderWidth: 2,
        cornerRadius: 12,
      },
      text: {
        title: { fontSize: "18px", fill: "#4CAF50", fontStyle: "bold" },
        progress: { fontSize: "12px", fill: "#ffffff" },
        task: { fontSize: "11px", fill: "#ffffff", lineSpacing: 3 },
        completed: { fontSize: "11px", fill: "#4CAF50", lineSpacing: 3 },
        empty: { fontSize: "14px", fill: "#888888", fontStyle: "italic" },
      },
      colors: {
        primary: 0x4caf50,
        secondary: 0x2196f3,
        warning: 0xff9800,
        danger: 0xf44336,
        success: 0x4caf50,
        text: 0xffffff,
        textMuted: 0x888888,
      },
    };

    this.initialize();
  }

  /**
   * Initialize the UI
   */
  initialize() {
    if (this.isInitialized) return;

    this.createContainer();
    this.createComponents();
    this.setupEventListeners();
    this.updateContent();

    this.isInitialized = true;
  }

  /**
   * Create main container
   */
  createContainer() {
    this.components.container = this.scene.add.container(0, 0);
    this.components.container.setScrollFactor(0);
    this.components.container.setDepth(1000);
    this.components.container.setVisible(false);

    // Calculate position
    const position = this.calculatePosition();
    this.components.container.setPosition(position.x, position.y);
  }

  /**
   * Calculate UI position based on configuration
   * @returns {Object} Position coordinates
   */
  calculatePosition() {
    const screenWidth = this.scene.cameras.main.width;
    const screenHeight = this.scene.cameras.main.height;
    const { width } = this.config;
    const { margin } = this.config;

    let x, y;
    const contentHeight = this.calculateContentHeight();

    // Calculate X position
    switch (this.config.position.x) {
      case "left":
        x = width / 2 + margin;
        break;
      case "center":
        x = screenWidth / 2;
        break;
      case "right":
      default:
        // Ensure UI doesn't go off screen
        x = Math.min(
          screenWidth - width / 2 - margin,
          screenWidth - width / 2 - 10
        );
        break;
    }

    // Calculate Y position
    switch (this.config.position.y) {
      case "top":
        y = Math.max(contentHeight / 2 + margin, margin + contentHeight / 2);
        break;
      case "middle":
        y = screenHeight / 2;
        break;
      case "bottom":
        y = screenHeight - contentHeight / 2 - margin;
        break;
      default:
        y = Math.max(contentHeight / 2 + margin, margin + contentHeight / 2);
        break;
    }

    // Clamp positions to screen bounds
    x = Math.max(width / 2 + 10, Math.min(x, screenWidth - width / 2 - 10));
    y = Math.max(
      contentHeight / 2 + 10,
      Math.min(y, screenHeight - contentHeight / 2 - 10)
    );

    return { x, y };
  }

  /**
   * Create UI components
   */
  createComponents() {
    this.createBackground();
    this.createHeader();
    this.createContent();
    this.createFooter();
  }

  /**
   * Create background with rounded corners
   */
  createBackground() {
    const { width } = this.config;
    const height = this.calculateContentHeight();

    // Create background graphics
    this.components.background = this.scene.add.graphics();
    this.components.background.fillStyle(
      this.theme.background.color,
      this.theme.background.alpha
    );
    this.components.background.lineStyle(
      this.theme.background.borderWidth,
      this.theme.background.borderColor
    );

    // Draw rounded rectangle
    this.components.background.fillRoundedRect(
      -width / 2,
      -height / 2,
      width,
      height,
      this.theme.background.cornerRadius
    );
    this.components.background.strokeRoundedRect(
      -width / 2,
      -height / 2,
      width,
      height,
      this.theme.background.cornerRadius
    );

    this.components.container.add(this.components.background);
  }

  /**
   * Create header with title and progress
   */
  createHeader() {
    const { width } = this.config;
    const headerY = -this.calculateContentHeight() / 2 + 30;

    // Title
    this.components.title = this.scene.add.text(
      0,
      headerY - 15,
      "TASKS",
      this.theme.text.title
    );
    this.components.title.setOrigin(0.5);

    // Progress text
    this.components.progressText = this.scene.add.text(
      0,
      headerY + 8,
      "",
      this.theme.text.progress
    );
    this.components.progressText.setOrigin(0.5);

    // Progress bar background
    const progressBarWidth = width - 40;
    this.components.progressBarBg = this.scene.add.graphics();
    this.components.progressBarBg.fillStyle(0x333333);
    this.components.progressBarBg.fillRoundedRect(
      -progressBarWidth / 2,
      headerY + 20,
      progressBarWidth,
      4,
      2
    );

    // Progress bar fill
    this.components.progressBarFill = this.scene.add.graphics();

    this.components.container.add([
      this.components.title,
      this.components.progressText,
      this.components.progressBarBg,
      this.components.progressBarFill,
    ]);
  }

  /**
   * Create content area for task list
   */
  createContent() {
    const { width } = this.config;
    const contentY = -this.calculateContentHeight() / 2 + 80;

    // Task list container
    this.components.taskListContainer = this.scene.add.container(0, contentY);

    // Task list text
    this.components.taskList = this.scene.add.text(-width / 2 + 20, 0, "", {
      ...this.theme.text.task,
      wordWrap: { width: width - 40, useAdvancedWrap: true },
    });

    this.components.taskListContainer.add(this.components.taskList);
    this.components.container.add(this.components.taskListContainer);
  }

  /**
   * Create footer with controls info
   */
  createFooter() {
    const { width } = this.config;
    const footerY = this.calculateContentHeight() / 2 - 25;

    this.components.footer = this.scene.add.text(
      0,
      footerY,
      "Press T to toggle • ESC to close",
      {
        fontSize: "10px",
        fill: "#888888",
        align: "center",
      }
    );
    this.components.footer.setOrigin(0.5);

    this.components.container.add(this.components.footer);
  }

  /**
   * Calculate content height based on task count
   * @returns {number}
   */
  calculateContentHeight() {
    const baseHeight = 120; // Header + footer
    const taskHeight = 18; // Height per task line
    const tasks = this.taskManager.getTasksForDisplay({
      maxTasks: this.config.maxVisibleTasks,
    });
    const contentHeight = Math.max(tasks.length * taskHeight, 60); // Minimum content height

    return Math.min(baseHeight + contentHeight, this.config.maxHeight);
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Task manager events
    this.taskManager.on("task:progress", this.onTaskProgress.bind(this));
    this.taskManager.on("task:completed", this.onTaskCompleted.bind(this));
    this.taskManager.on("task:added", this.onTaskAdded.bind(this));
    this.taskManager.on("task:removed", this.onTaskRemoved.bind(this));

    // Scene events for responsive resizing
    this.scene.scale.on("resize", this.onScreenResize.bind(this));
  }

  /**
   * Handle task progress updates
   * @param {Task} task
   * @param {Object} progress
   */
  onTaskProgress(task, progress) {
    if (this.isVisible) {
      this.updateContent();
      this.playUpdateAnimation();
    }
  }

  /**
   * Handle task completion
   * @param {Task} task
   */
  onTaskCompleted(task) {
    if (this.isVisible) {
      this.updateContent();
      this.playCompletionAnimation();
    }
  }

  /**
   * Handle task addition
   * @param {Task} task
   */
  onTaskAdded(task) {
    if (this.isVisible) {
      this.updateContent();
    }
  }

  /**
   * Handle task removal
   * @param {Task} task
   */
  onTaskRemoved(task) {
    if (this.isVisible) {
      this.updateContent();
    }
  }

  /**
   * Handle screen resize
   */
  onScreenResize() {
    if (this.isVisible) {
      const position = this.calculatePosition();
      this.components.container.setPosition(position.x, position.y);
      // Recalculate and redraw all components for new screen size
      this.updateContent();
    }
  }

  /**
   * Update UI content
   */
  updateContent() {
    if (!this.isInitialized) return;

    this.updateBackground(); // Update background first to get correct dimensions
    this.updateProgress();
    this.updateTaskList();
  }

  /**
   * Update progress display
   */
  updateProgress() {
    const progress = this.taskManager.getOverallProgress();

    // Debug log to check progress values
    console.log("TaskUI Progress Update:", {
      completed: progress.completed,
      total: progress.total,
      percentage: progress.percentage,
      active: progress.active,
    });

    // Update progress text
    this.components.progressText.setText(
      `Progress: ${progress.completed}/${progress.total} (${progress.percentage}%)`
    );

    // Update progress bar
    const progressBarWidth = this.config.width - 40;
    const fillWidth = Math.max(
      0,
      (progressBarWidth * progress.percentage) / 100
    );
    const headerY = -this.calculateContentHeight() / 2 + 30;

    this.components.progressBarFill.clear();
    if (fillWidth > 0) {
      this.components.progressBarFill.fillStyle(this.theme.colors.primary);
      this.components.progressBarFill.fillRoundedRect(
        -progressBarWidth / 2,
        headerY + 20,
        fillWidth,
        4,
        2
      );
    }
  }

  /**
   * Update task list display
   */
  updateTaskList() {
    const tasks = this.taskManager.getTasksForDisplay({
      maxTasks: this.config.maxVisibleTasks,
      sortBy: "priority",
    });

    // Debug log to check task data
    console.log(
      "TaskUI Task List Update:",
      tasks.map((task) => ({
        id: task.id,
        title: task.title,
        progress: task.progress,
        status: task.status,
        progressString: task.progressString,
      }))
    );

    if (tasks.length === 0) {
      this.components.taskList.setText("🎉 All tasks completed!");
      this.components.taskList.setStyle(this.theme.text.completed);
      return;
    }

    // Format task list
    const taskText = tasks
      .map((task, index) => {
        const emoji = this.getTaskEmoji(task.type);
        const progressText = this.config.showProgress
          ? ` (${task.progress}%)`
          : "";
        const priorityIndicator =
          this.config.showPriority && task.priority > 0 ? "⭐ " : "";

        let displayText = task.progressString || task.title;
        if (displayText.length > 40) {
          displayText = displayText.substring(0, 37) + "...";
        }

        // Use different color for completed tasks
        const textColor = task.status === "completed" ? "#4CAF50" : "#ffffff";
        return `${
          index + 1
        }. ${emoji} ${priorityIndicator}${displayText}${progressText}`;
      })
      .join("\n");

    // Add "more tasks" indicator if needed
    const totalTasks = this.taskManager.getActiveTasks().length;
    let finalText = taskText;
    if (totalTasks > this.config.maxVisibleTasks) {
      const remaining = totalTasks - this.config.maxVisibleTasks;
      finalText += `\n\n📋 +${remaining} more task${remaining > 1 ? "s" : ""}`;
    }

    this.components.taskList.setText(finalText);
    this.components.taskList.setStyle(this.theme.text.task);
  }

  /**
   * Update background size based on content
   */
  updateBackground() {
    const newHeight = this.calculateContentHeight();
    const { width } = this.config;

    // Redraw background
    this.components.background.clear();
    this.components.background.fillStyle(
      this.theme.background.color,
      this.theme.background.alpha
    );
    this.components.background.lineStyle(
      this.theme.background.borderWidth,
      this.theme.background.borderColor
    );

    this.components.background.fillRoundedRect(
      -width / 2,
      -newHeight / 2,
      width,
      newHeight,
      this.theme.background.cornerRadius
    );
    this.components.background.strokeRoundedRect(
      -width / 2,
      -newHeight / 2,
      width,
      newHeight,
      this.theme.background.cornerRadius
    );

    // Update component positions
    this.updateComponentPositions();
  }

  /**
   * Update component positions after background resize
   */
  updateComponentPositions() {
    const height = this.calculateContentHeight();

    // Update header positions
    const headerY = -height / 2 + 30;
    this.components.title.setY(headerY - 15);
    this.components.progressText.setY(headerY + 8);

    // Update progress bar background
    const progressBarWidth = this.config.width - 40;
    this.components.progressBarBg.clear();
    this.components.progressBarBg.fillStyle(0x333333);
    this.components.progressBarBg.fillRoundedRect(
      -progressBarWidth / 2,
      headerY + 20,
      progressBarWidth,
      4,
      2
    );

    // Update task list position
    this.components.taskListContainer.setY(-height / 2 + 80);

    // Update footer position
    this.components.footer.setY(height / 2 - 25);

    // Re-update progress bar fill after repositioning
    this.updateProgress();
  }

  /**
   * Get emoji for task type
   * @param {string} type - Task type
   * @returns {string}
   */
  getTaskEmoji(type) {
    const emojis = {
      animal: "🐄",
    };
    return emojis[type] || "📝";
  }

  /**
   * Play update animation
   */
  playUpdateAnimation() {
    this.scene.tweens.add({
      targets: this.components.background,
      scaleX: 1.02,
      scaleY: 1.02,
      duration: 150,
      yoyo: true,
      ease: "Power2",
    });
  }

  /**
   * Play completion animation
   */
  playCompletionAnimation() {
    // Flash green
    this.scene.tweens.add({
      targets: this.components.background,
      alpha: 0.7,
      duration: 100,
      yoyo: true,
      repeat: 2,
      ease: "Power2",
    });

    // Particle effect
    this.createCompletionParticles();
  }

  /**
   * Create completion particle effect
   */
  createCompletionParticles() {
    const containerPos = this.components.container;

    for (let i = 0; i < 6; i++) {
      const particle = this.scene.add.circle(
        containerPos.x,
        containerPos.y,
        3,
        this.theme.colors.success
      );

      particle.setScrollFactor(0);
      particle.setDepth(1001);

      const angle = ((Math.PI * 2) / 6) * i;
      const distance = 40;

      this.scene.tweens.add({
        targets: particle,
        x: containerPos.x + Math.cos(angle) * distance,
        y: containerPos.y + Math.sin(angle) * distance,
        alpha: 0,
        scale: 0,
        duration: 500,
        ease: "Power2",
        onComplete: () => particle.destroy(),
      });
    }
  }

  /**
   * Show the UI
   */
  show() {
    if (this.isVisible) return;

    this.isVisible = true;

    // Update position first
    this.updatePosition();

    this.updateContent();
    this.components.container.setVisible(true);

    // Entrance animation
    this.components.container.setScale(0.8);
    this.components.container.setAlpha(0);

    this.scene.tweens.add({
      targets: this.components.container,
      scale: 1,
      alpha: 1,
      duration: this.config.animationDuration,
      ease: "Back.easeOut",
    });
  }

  /**
   * Hide the UI
   */
  hide() {
    if (!this.isVisible) return;

    this.isVisible = false;

    // Exit animation
    this.scene.tweens.add({
      targets: this.components.container,
      scale: 0.8,
      alpha: 0,
      duration: this.config.animationDuration,
      ease: "Back.easeIn",
      onComplete: () => {
        this.components.container.setVisible(false);
      },
    });
  }

  /**
   * Toggle UI visibility
   */
  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Check if UI is visible
   * @returns {boolean}
   */
  getVisibility() {
    return this.isVisible;
  }

  /**
   * Update theme
   * @param {Object} newTheme - New theme configuration
   */
  updateTheme(newTheme) {
    this.theme = { ...this.theme, ...newTheme };
    if (this.isVisible) {
      this.updateContent();
    }
  }

  /**
   * Force update position - useful for debugging or manual positioning
   */
  updatePosition() {
    if (this.components.container) {
      const position = this.calculatePosition();
      this.components.container.setPosition(position.x, position.y);
      console.log("TaskUI Position Updated:", position);
    }
  }

  /**
   * Clean up resources
   */
  destroy() {
    // Stop all animations
    this.scene.tweens.killTweensOf(this.components.container);
    this.scene.tweens.killTweensOf(this.components.background);

    // Remove event listeners
    this.taskManager.off("task:progress", this.onTaskProgress);
    this.taskManager.off("task:completed", this.onTaskCompleted);
    this.taskManager.off("task:added", this.onTaskAdded);
    this.taskManager.off("task:removed", this.onTaskRemoved);

    if (this.scene.scale) {
      this.scene.scale.off("resize", this.onScreenResize);
    }

    // Destroy components
    if (this.components.container) {
      this.components.container.destroy();
    }

    this.isInitialized = false;
  }
}
