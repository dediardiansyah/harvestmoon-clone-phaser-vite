/**
 * Enhanced Task Indicator with better performance and modularity
 */
export default class TaskIndicator {
  constructor(scene, x, y, options = {}) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.options = {
      type: 'default',
      size: 8,
      color: 0x4caf50,
      glowIntensity: 1.0,
      animationSpeed: 1.0,
      interactive: true,
      autoDestroy: false,
      depth: 100,
      ...options
    };

    // State management
    this.isActive = true;
    this.isDestroyed = false;
    this.container = null;
    this.components = {};
    this.tweens = [];

    // Performance optimization
    this.lastUpdateTime = 0;
    this.updateInterval = 16; // ~60fps

    this.create();
  }

  /**
   * Create the indicator
   */
  create() {
    if (this.isDestroyed) return;

    this.createContainer();
    this.createComponents();
    this.setupAnimations();
    
    if (this.options.interactive) {
      this.makeInteractive();
    }
  }

  /**
   * Create main container
   */
  createContainer() {
    this.container = this.scene.add.container(this.x, this.y);
    this.container.setDepth(this.options.depth);
  }

  /**
   * Create visual components
   */
  createComponents() {
    const config = this.getTypeConfig(this.options.type);
    
    // Create glow layers
    this.createGlowLayers(config);
    
    // Create core indicator
    this.createCore(config);
    
    // Create icon if specified
    if (config.icon) {
      this.createIcon(config);
    }
    
    // Create border
    this.createBorder(config);
  }

  /**
   * Get configuration for indicator type
   * @param {string} type - Indicator type
   * @returns {Object}
   */
  getTypeConfig(type) {
    const configs = {
      default: {
        color: 0x4caf50,
        size: 8,
        glowSize: 16,
        icon: null,
        pulseSpeed: 1500,
        floatDistance: 5
      },
      animal: {
        color: 0x8bc34a,
        size: 10,
        glowSize: 18,
        icon: '🐄',
        pulseSpeed: 1200,
        floatDistance: 6
      },
    };

    return {
      ...configs.default,
      ...configs[type],
      ...this.options
    };
  }

  /**
   * Create glow layers
   * @param {Object} config - Configuration
   */
  createGlowLayers(config) {
    const intensity = this.options.glowIntensity;
    
    // Outer glow
    this.components.outerGlow = this.scene.add.circle(0, 0, config.glowSize * 1.8, config.color);
    this.components.outerGlow.setAlpha(0.15 * intensity);
    this.components.outerGlow.setBlendMode(Phaser.BlendModes.ADD);

    // Middle glow
    this.components.middleGlow = this.scene.add.circle(0, 0, config.glowSize * 1.2, config.color);
    this.components.middleGlow.setAlpha(0.25 * intensity);
    this.components.middleGlow.setBlendMode(Phaser.BlendModes.ADD);

    // Inner glow
    this.components.innerGlow = this.scene.add.circle(0, 0, config.glowSize * 0.8, config.color);
    this.components.innerGlow.setAlpha(0.4 * intensity);
    this.components.innerGlow.setBlendMode(Phaser.BlendModes.ADD);

    this.container.add([
      this.components.outerGlow,
      this.components.middleGlow,
      this.components.innerGlow
    ]);
  }

  /**
   * Create core indicator
   * @param {Object} config - Configuration
   */
  createCore(config) {
    this.components.core = this.scene.add.circle(0, 0, config.size, config.color);
    this.components.core.setAlpha(0.9);
    this.container.add(this.components.core);
  }

  /**
   * Create icon
   * @param {Object} config - Configuration
   */
  createIcon(config) {
    this.components.icon = this.scene.add.text(0, 0, config.icon, {
      fontSize: `${config.size + 2}px`,
      fill: '#ffffff'
    });
    this.components.icon.setOrigin(0.5);
    this.container.add(this.components.icon);
  }

  /**
   * Create border
   * @param {Object} config - Configuration
   */
  createBorder(config) {
    this.components.border = this.scene.add.circle(0, 0, config.size + 2, 0xffffff);
    this.components.border.setAlpha(0.3);
    this.components.border.setStrokeStyle(1, 0xffffff);
    this.components.border.setFillStyle(0x000000, 0); // Transparent fill
    this.container.add(this.components.border);
  }

  /**
   * Setup animations
   */
  setupAnimations() {
    const config = this.getTypeConfig(this.options.type);
    const speed = this.options.animationSpeed;

    this.setupPulseAnimation(config, speed);
    this.setupFloatAnimation(config, speed);
    this.setupRotationAnimation(config, speed);
  }

  /**
   * Setup pulse animation
   * @param {Object} config - Configuration
   * @param {number} speed - Animation speed multiplier
   */
  setupPulseAnimation(config, speed) {
    const duration = config.pulseSpeed / speed;
    
    const tween = this.scene.tweens.add({
      targets: [this.components.outerGlow, this.components.middleGlow, this.components.innerGlow],
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0.05,
      duration: duration,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.tweens.push(tween);
  }

  /**
   * Setup float animation
   * @param {Object} config - Configuration
   * @param {number} speed - Animation speed multiplier
   */
  setupFloatAnimation(config, speed) {
    const duration = 2000 / speed;
    
    const tween = this.scene.tweens.add({
      targets: this.container,
      y: this.y - config.floatDistance,
      duration: duration,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.tweens.push(tween);
  }

  /**
   * Setup rotation animation
   * @param {Object} config - Configuration
   * @param {number} speed - Animation speed multiplier
   */
  setupRotationAnimation(config, speed) {
    const duration = 4000 / speed;
    
    const tween = this.scene.tweens.add({
      targets: this.components.outerGlow,
      rotation: Math.PI * 2,
      duration: duration,
      repeat: -1,
      ease: 'Linear'
    });

    this.tweens.push(tween);
  }

  /**
   * Make indicator interactive
   */
  makeInteractive() {
    if (!this.components.core) return;

    this.components.core.setInteractive({ useHandCursor: true });

    // Hover effects
    this.components.core.on('pointerover', () => {
      if (!this.isActive) return;
      this.onHoverStart();
    });

    this.components.core.on('pointerout', () => {
      if (!this.isActive) return;
      this.onHoverEnd();
    });

    this.components.core.on('pointerdown', () => {
      if (!this.isActive) return;
      this.onClick();
    });
  }

  /**
   * Handle hover start
   */
  onHoverStart() {
    // Scale up core
    this.scene.tweens.add({
      targets: this.components.core,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 200,
      ease: 'Back.easeOut'
    });

    // Brighten glow
    [this.components.outerGlow, this.components.middleGlow, this.components.innerGlow].forEach(glow => {
      this.scene.tweens.add({
        targets: glow,
        alpha: '+=0.2',
        duration: 200
      });
    });
  }

  /**
   * Handle hover end
   */
  onHoverEnd() {
    // Scale down core
    this.scene.tweens.add({
      targets: this.components.core,
      scaleX: 1,
      scaleY: 1,
      duration: 200,
      ease: 'Back.easeOut'
    });

    // Dim glow
    [this.components.outerGlow, this.components.middleGlow, this.components.innerGlow].forEach(glow => {
      this.scene.tweens.add({
        targets: glow,
        alpha: '-=0.2',
        duration: 200
      });
    });
  }

  /**
   * Handle click
   */
  onClick() {
    // Quick scale animation
    this.scene.tweens.add({
      targets: this.components.core,
      scaleX: 0.9,
      scaleY: 0.9,
      duration: 100,
      yoyo: true,
      ease: 'Power2'
    });

    // Emit click event
    this.scene.events.emit('taskIndicator:click', this);
  }

  /**
   * Change indicator type
   * @param {string} type - New type
   */
  setType(type) {
    this.options.type = type;
    const config = this.getTypeConfig(type);
    
    // Update colors
    this.setColor(config.color);
    
    // Update icon
    if (this.components.icon && config.icon) {
      this.components.icon.setText(config.icon);
    }
    
    // Update size
    this.setSize(config.size);
  }

  /**
   * Change indicator color
   * @param {number} color - New color
   */
  setColor(color) {
    this.options.color = color;
    
    if (this.components.core) {
      this.components.core.setFillStyle(color);
    }
    
    [this.components.outerGlow, this.components.middleGlow, this.components.innerGlow].forEach(glow => {
      if (glow) {
        glow.setFillStyle(color);
      }
    });
  }

  /**
   * Change indicator size
   * @param {number} size - New size
   */
  setSize(size) {
    this.options.size = size;
    const glowSize = size * 2;
    
    if (this.components.core) {
      this.components.core.setRadius(size);
    }
    
    if (this.components.border) {
      this.components.border.setRadius(size + 2);
    }
    
    if (this.components.outerGlow) {
      this.components.outerGlow.setRadius(glowSize * 1.8);
    }
    
    if (this.components.middleGlow) {
      this.components.middleGlow.setRadius(glowSize * 1.2);
    }
    
    if (this.components.innerGlow) {
      this.components.innerGlow.setRadius(glowSize * 0.8);
    }
  }

  /**
   * Set indicator position
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  setPosition(x, y) {
    this.x = x;
    this.y = y;
    
    if (this.container) {
      this.container.setPosition(x, y);
    }
  }

  /**
   * Set indicator active state
   * @param {boolean} active - Active state
   */
  setActive(active) {
    this.isActive = active;
    
    if (this.container) {
      this.container.setAlpha(active ? 1 : 0.5);
    }
    
    // Pause/resume animations
    this.tweens.forEach(tween => {
      if (active) {
        tween.resume();
      } else {
        tween.pause();
      }
    });
  }

  /**
   * Play completion animation
   * @param {Function} callback - Completion callback
   */
  playCompletionAnimation(callback = null) {
    this.setActive(false);
    
    // Stop current animations
    this.tweens.forEach(tween => tween.stop());
    
    // Completion animation
    this.scene.tweens.add({
      targets: this.container,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      duration: 600,
      ease: 'Power2.easeOut',
      onComplete: () => {
        this.createCompletionParticles();
        if (callback) callback();
        if (this.options.autoDestroy) {
          this.destroy();
        }
      }
    });
  }

  /**
   * Create completion particle effect
   */
  createCompletionParticles() {
    const particleCount = 8;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = this.scene.add.circle(this.x, this.y, 3, this.options.color);
      particles.push(particle);
      
      const angle = (Math.PI * 2 / particleCount) * i;
      const distance = 40;
      
      this.scene.tweens.add({
        targets: particle,
        x: this.x + Math.cos(angle) * distance,
        y: this.y + Math.sin(angle) * distance,
        alpha: 0,
        scale: 0,
        duration: 500,
        delay: i * 50,
        ease: 'Power2.easeOut',
        onComplete: () => particle.destroy()
      });
    }
  }

  /**
   * Highlight indicator temporarily
   * @param {number} duration - Highlight duration
   */
  highlight(duration = 1000) {
    const originalColor = this.options.color;
    
    // Change to highlight color
    this.setColor(0xffd700);
    
    // Add extra glow
    const highlightGlow = this.scene.add.circle(0, 0, this.options.size * 3, 0xffd700);
    highlightGlow.setAlpha(0.5);
    highlightGlow.setBlendMode(Phaser.BlendModes.ADD);
    this.container.add(highlightGlow);
    
    // Restore after duration
    this.scene.time.delayedCall(duration, () => {
      this.setColor(originalColor);
      highlightGlow.destroy();
    });
  }

  /**
   * Get current position
   * @returns {Object}
   */
  getPosition() {
    return { x: this.x, y: this.y };
  }

  /**
   * Get container bounds
   * @returns {Object}
   */
  getBounds() {
    if (!this.container) return null;
    return this.container.getBounds();
  }

  /**
   * Check if point is within indicator bounds
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {boolean}
   */
  containsPoint(x, y) {
    const distance = Phaser.Math.Distance.Between(this.x, this.y, x, y);
    return distance <= this.options.size;
  }

  /**
   * Clean up and destroy
   */
  destroy() {
    if (this.isDestroyed) return;
    
    this.isDestroyed = true;
    this.isActive = false;
    
    // Stop all animations
    this.tweens.forEach(tween => {
      if (tween && tween.isActive()) {
        tween.stop();
      }
    });
    this.tweens = [];
    
    // Destroy container and all children
    if (this.container) {
      this.container.destroy();
      this.container = null;
    }
    
    // Clear components
    this.components = {};
  }

  /**
   * Set indicator visibility
   * @param {boolean} visible - Visibility state
   */
  setVisible(visible) {
    if (this.container) {
      this.container.setVisible(visible);
    }
  }

  /**
   * Get indicator visibility
   * @returns {boolean}
   */
  getVisible() {
    return this.container ? this.container.visible : false;
  }

  /**
   * Show indicator
   */
  show() {
    this.setVisible(true);
  }

  /**
   * Hide indicator  
   */
  hide() {
    this.setVisible(false);
  }

  /**
   * Static factory method for creating typed indicators
   * @param {Phaser.Scene} scene - Phaser scene
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {string} type - Indicator type
   * @param {Object} options - Additional options
   * @returns {TaskIndicator}
   */
  static create(scene, x, y, type, options = {}) {
    return new TaskIndicator(scene, x, y, { type, ...options });
  }
}
