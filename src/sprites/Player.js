/**
 * Player sprite with physics and animations
 */

import { GameObjects } from 'phaser';

export default class Player extends GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key, config.frame);
    this.scene = config.scene;
    this.init();
  }

  init() {
    // Add to scene
    this.scene.add.existing(this);

    // Add physics
    this.scene.physics.add.existing(this);
    this.body.setCollideWorldBounds(true);
    this.body.allowGravity = false;

    // Setup animations
    this.setAnimations();

    // Add collision with blocked layer
    this.scene.physics.add.collider(this, this.scene._MAP.blockedLayer);
  }

  setAnimations() {
    const animations = [
      {
        key: 'walking-down',
        frames: this.scene.anims.generateFrameNumbers('jack-walking', { frames: [0, 1] }),
        frameRate: 6,
        repeat: -1
      },
      {
        key: 'walking-up',
        frames: this.scene.anims.generateFrameNumbers('jack-walking', { frames: [2, 3] }),
        frameRate: 6,
        repeat: -1
      },
      {
        key: 'walking-left',
        frames: this.scene.anims.generateFrameNumbers('jack-walking', { frames: [4, 5] }),
        frameRate: 6,
        repeat: -1
      },
      {
        key: 'walking-right',
        frames: this.scene.anims.generateFrameNumbers('jack-walking', { frames: [6, 7] }),
        frameRate: 6,
        repeat: -1
      },
      {
        key: 'ring-cowbell-down',
        frames: this.scene.anims.generateFrameNumbers('jack-ring-cowbell-down', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: 0
      },
      {
        key: 'ring-cowbell-up',
        frames: this.scene.anims.generateFrameNumbers('jack-ring-cowbell-up', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: 0
      },
      {
        key: 'ring-cowbell-left',
        frames: this.scene.anims.generateFrameNumbers('jack-ring-cowbell-left', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: 0
      },
      {
        key: 'ring-cowbell-right',
        frames: this.scene.anims.generateFrameNumbers('jack-ring-cowbell-right', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: 0
      }
    ];

    animations.forEach(anim => {
      if (!this.scene.anims.get(anim.key)) {
        this.scene.anims.create(anim);
      }
    });
  }
}
