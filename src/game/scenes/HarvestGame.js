/**
 * Harvest Moon Game Scene
 */

import { Scene, Geom } from 'phaser';
import gameConfig from '../../config/game-config';
import Map from '../../classes/Map';
import ObjectLoader from '../../classes/ObjectLoader';
import Player from '../../sprites/Player';
import BoxManager from '../../classes/Box/BoxManager';
import ImageLoader from '../../classes/ImageLoader';

export class HarvestGame extends Scene {
  constructor() {
    super('HarvestGame');
  }

  init() {
    this._ANIMS = {
      pressedCursor: 'down',
      actionAnimation: '',
    };

    this._BTNS = {};
    this._INPUTS = {};
    this._MAP = {};
    this._MODAL = {};
    this._PLAYER = {};
    this._SPRITES = {};
    this._UTILITY = {};
  }

  preload() {
    new ImageLoader(this);
  }

  create() {
    const mapVars = gameConfig.map[gameConfig.loadedScene];
    
    if (!mapVars) {
      console.error(`Map configuration not found for scene: ${gameConfig.loadedScene}`);
      console.log('Available scenes:', Object.keys(gameConfig.map));
      return;
    }

    this.createMap(mapVars);
    this.createPlayer(mapVars);
    this.setupCamera(mapVars);
    this.setupInput();
    this.setupObjects();
    this.setupEventListeners();
  }

  createMap(mapVars) {
    this._MAP = new Map({
      scene: this,
      key: mapVars.key,
      imgKey: mapVars.imgKey,
      tileSetName: mapVars.tileSetName,
      bgLayerName: 'background',
      blockedLayerName: 'blocked'
    });

    // Set world bounds
    this.physics.world.bounds.width = mapVars.mapBounds.width;
    this.physics.world.bounds.height = mapVars.mapBounds.height;
  }

  createPlayer(mapVars) {
    const playerCoords = this.getPlayerCoords(mapVars);
    const playerFrame = this.getPlayerDirection();

    this._PLAYER = new Player({
      scene: this,
      x: playerCoords.x,
      y: playerCoords.y,
      key: 'jack-standing',
      frame: playerFrame
    });
  }

  setupCamera(mapVars) {
    this.cameras.main.setBounds(0, 0, mapVars.mapBounds.width, mapVars.mapBounds.height);
    this.cameras.main.startFollow(this._PLAYER);
  }

  setupInput() {
    this._INPUTS = this.input.keyboard.createCursorKeys();
    
    // Additional keys
    this._INPUTS.enter = this.input.keyboard.addKey(13);
    this._INPUTS.escape = this.input.keyboard.addKey(27);
    this._INPUTS.shift = this.input.keyboard.addKey(16);
    this._INPUTS.space = this.input.keyboard.addKey(32);
  }

  setupObjects() {
    this._UTILITY.ObjectLoader = new ObjectLoader({
      scene: this,
      objectLayers: this._MAP.tilemap.objects
    });
    this._UTILITY.ObjectLoader.setup();

    this._UTILITY.boxManager = new BoxManager(this);
  }

  setupEventListeners() {
    this.input.keyboard.on('keydown', this.handleKeyDown.bind(this));
    this._PLAYER.on('animationcomplete', this.handleAnimationComplete.bind(this));
  }

  handleKeyDown() {
    if (this._INPUTS.enter.isDown && gameConfig.overlapData.isActive) {
      this._UTILITY.boxManager.createBox('dialog');
    } else if (this._INPUTS.shift.isDown) {
      this._UTILITY.boxManager.createBox('tasks');
    } else if (this._INPUTS.escape.isDown) {
      this._UTILITY.boxManager.hideBox();
    } else if (this._INPUTS.space.isDown) {
      this.handleSpacePress();
    } else if (this._INPUTS.space.isUp) {
      gameConfig.pauseUpdateLoop = false;
    }
  }

  handleSpacePress() {
    gameConfig.pauseUpdateLoop = true;
    this.stopPlayerAnim();

    const animMap = {
      down: 'ring-cowbell-down',
      up: 'ring-cowbell-up',
      left: 'ring-cowbell-left',
      right: 'ring-cowbell-right'
    };

    const anim = animMap[this._ANIMS.pressedCursor];
    if (anim) {
      this.playAnim(anim);
    } else {
      this._PLAYER.setTexture('jack-standing', 0);
    }
  }

  handleAnimationComplete() {
    const frameMap = {
      down: 0,
      up: 1,
      left: 2,
      right: 3
    };

    const frame = frameMap[this._ANIMS.pressedCursor] || 0;
    this._PLAYER.setTexture('jack-standing', frame);
  }

  update() {
    if (!gameConfig.pauseUpdateLoop) {
      this.updateMovement();
    }

    this.checkOverlaps();
  }

  updateMovement() {
    const { up, down, left, right } = this._INPUTS;
    const speed = gameConfig.playerSpeed;

    if (down.isDown) {
      this.movePlayer(0, speed, 'down', 'walking-down');
    } else if (up.isDown) {
      this.movePlayer(0, -speed, 'up', 'walking-up');
    } else if (left.isDown) {
      this.movePlayer(-speed, 0, 'left', 'walking-left');
    } else if (right.isDown) {
      this.movePlayer(speed, 0, 'right', 'walking-right');
    } else {
      this.stopPlayerAnim();
    }
  }

  movePlayer(velocityX, velocityY, direction, animKey) {
    this._PLAYER.body.setVelocity(velocityX, velocityY);
    this._ANIMS.pressedCursor = direction;
    this.playAnim(animKey);
  }

  playAnim(animKey) {
    if (!this._PLAYER.anims.isPlaying || this._PLAYER.anims.currentAnim.key !== animKey) {
      this._PLAYER.anims.play(animKey);
    }
  }

  stopPlayerAnim() {
    this._PLAYER.body.setVelocity(0, 0);
    this._PLAYER.anims.stop();
  }

  checkOverlaps() {
    if (gameConfig.overlapData.isActive && gameConfig.overlapData.sprite) {
      const isOverlapping = Geom.Intersects.RectangleToRectangle(
        this._PLAYER.getBounds(),
        gameConfig.overlapData.overlap.getBounds()
      );

      if (!isOverlapping) {
        gameConfig.overlapData.isActive = false;
        gameConfig.overlapData.sprite = {};
      }
    }
  }

  getPlayerDirection() {
    const directionMap = {
      down: 0,
      up: 1,
      left: 2,
      right: 3
    };
    return directionMap[gameConfig.previousData.direction] || 0;
  }

  getPlayerCoords(mapVars) {
    const prevScene = gameConfig.previousData.scene;
    const playerCoords = mapVars.playerStartPos;

    if (prevScene && playerCoords[prevScene]) {
      return playerCoords[prevScene];
    }
    return playerCoords.default;
  }
}
