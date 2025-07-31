/**
 * Harvest Moon Game Scene
 */

import { Scene, Geom } from "phaser";
import gameConfig from "../../config/game-config";
import Map from "../../classes/Map";
import ObjectLoader from "../../classes/ObjectLoader";
import Player from "../../sprites/Player";
import BoxManager from "../../classes/Box/BoxManager";
import ImageLoader from "../../classes/ImageLoader";

export class HarvestGame extends Scene {
  constructor() {
    super("HarvestGame");
    this.navMesh = null;
    this._autoPath = null;
    this._autoPathIndex = 0;
    this._autoTarget = null;
  }

  init() {
    this._ANIMS = {
      pressedCursor: "down",
      actionAnimation: "",
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
      console.error(
        `Map configuration not found for scene: ${gameConfig.loadedScene}`
      );
      console.log("Available scenes:", Object.keys(gameConfig.map));
      return;
    }

    this.createMap(mapVars);
    this.createPlayer(mapVars);
    this.createNavMesh();
    this.setupCamera(mapVars);
    this.setupInput();
    this.setupObjects();
    this.setupEventListeners();

    // Debug blocked layer: visualize blocked tiles
    // if (this._MAP && this._MAP.blockedLayer) {
    //   const graphics = this.add.graphics();
    //   graphics.lineStyle(1, 0x00ff00, 1);
    //   graphics.fillStyle(0x00ff00, 0.3);
    //   const layer = this._MAP.blockedLayer.layer;
    //   for (let y = 0; y < layer.height; y++) {
    //     for (let x = 0; x < layer.width; x++) {
    //       const tile = layer.data[y][x];
    //       if (tile && tile.collides) {
    //         graphics.fillRect(tile.pixelX, tile.pixelY, tile.width, tile.height);
    //         graphics.strokeRect(tile.pixelX, tile.pixelY, tile.width, tile.height);
    //       }
    //     }
    //   }
    // }

    // Mouse click to set auto path target
    this.input.on("pointerdown", (pointer) => {
      if (!this.navMesh) return;
      // Convert pointer to world coordinates
      const worldPoint = pointer.positionToCamera(this.cameras.main);
      const start = { x: this._PLAYER.x, y: this._PLAYER.y };
      const end = { x: worldPoint.x, y: worldPoint.y };
      // Find path using navMesh
      const path = this.navMesh.findPath(start, end);
      if (path && path.length > 0) {
        this._autoPath = path;
        this._autoPathIndex = 0;
        this._autoTarget = end;
        // this.navMesh.debugDrawPath(path, 0xffd900);
      } else {
        // No path found, stop auto movement
        this._autoPath = null;
        this._autoPathIndex = 0;
        this._autoTarget = null;
        this.stopPlayerAnim();
      }
    });
  }

  createMap(mapVars) {
    this._MAP = new Map({
      scene: this,
      key: mapVars.key,
      imgKey: mapVars.imgKey,
      tileSetName: mapVars.tileSetName,
      bgLayerName: "background",
      blockedLayerName: "blocked",
    });

    // Set world bounds
    this.physics.world.bounds.width = mapVars.mapBounds.width;
    this.physics.world.bounds.height = mapVars.mapBounds.height;
  }

  createNavMesh() {
    // Build navmesh from the blocked layer
    if (this._MAP && this._MAP.tilemap && this._MAP.blockedLayer) {
      this.navMesh = this.navMeshPlugin.buildMeshFromTilemap(
        "main-mesh",
        this._MAP.tilemap,
        [this._MAP.blockedLayer]
      );

      // this.navMesh.enableDebug();
    }
  }

  createPlayer(mapVars) {
    const playerCoords = this.getPlayerCoords(mapVars);
    const playerFrame = this.getPlayerDirection();

    this._PLAYER = new Player({
      scene: this,
      x: playerCoords.x,
      y: playerCoords.y,
      key: "jack-standing",
      frame: playerFrame,
    });
  }

  setupCamera(mapVars) {
    this.cameras.main.setBounds(
      0,
      0,
      mapVars.mapBounds.width,
      mapVars.mapBounds.height
    );
    this.cameras.main.startFollow(this._PLAYER);
  }

  setupInput() {
    this._INPUTS = this.input.keyboard.createCursorKeys();

    // Additional keys
    this._INPUTS.enter = this.input.keyboard.addKey(13);
    this._INPUTS.escape = this.input.keyboard.addKey(27);
    this._INPUTS.shift = this.input.keyboard.addKey(16);
    this._INPUTS.space = this.input.keyboard.addKey(32);
    this._INPUTS.debug = this.input.keyboard.addKey(68); // 'D' key for debug
  }

  setupObjects() {
    this._UTILITY.ObjectLoader = new ObjectLoader({
      scene: this,
      objectLayers: this._MAP.tilemap.objects,
    });
    this._UTILITY.ObjectLoader.setup();

    this._UTILITY.boxManager = new BoxManager(this);
  }

  setupEventListeners() {
    this.input.keyboard.on("keydown", this.handleKeyDown.bind(this));
    this._PLAYER.on(
      "animationcomplete",
      this.handleAnimationComplete.bind(this)
    );
  }

  handleKeyDown() {
    if (this._INPUTS.enter.isDown && gameConfig.overlapData.isActive) {
      this._UTILITY.boxManager.createBox("dialog");
    } else if (this._INPUTS.shift.isDown) {
      this._UTILITY.boxManager.createBox("tasks");
    } else if (this._INPUTS.escape.isDown) {
      this._UTILITY.boxManager.hideBox();
    } else if (this._INPUTS.debug.isDown) {
      this.toggleDebugMode();
    } else if (this._INPUTS.space.isDown) {
      this.handleSpacePress();
    }
  }

  toggleDebugMode() {
    if (!gameConfig.debug) {
      gameConfig.debug = { showExitZones: false };
    }
    gameConfig.debug.showExitZones = !gameConfig.debug.showExitZones;

    // Restart scene to apply debug changes
    this.scene.restart();
  }

  handleSpacePress() {
    const animMap = {
      down: "ring-cowbell-down",
      up: "ring-cowbell-up",
      left: "ring-cowbell-left",
      right: "ring-cowbell-right",
    };

    const anim = animMap[this._ANIMS.pressedCursor];
    if (anim) {
      this.playAnim(anim);
    } else {
      this._PLAYER.setTexture("jack-standing", 0);
    }
  }

  handleAnimationComplete() {
    const frameMap = {
      down: 0,
      up: 1,
      left: 2,
      right: 3,
    };

    const frame = frameMap[this._ANIMS.pressedCursor] || 0;
    this._PLAYER.setTexture("jack-standing", frame);
  }

  update() {
    if (gameConfig.taskMenuOpen) {
      this._autoPath = null;
      this._autoPathIndex = 0;
      this._autoTarget = null;
      this.stopPlayerAnim();
    }

    if (this._autoPath && this._autoPathIndex < this._autoPath.length) {
      this.updateAutoPath();
    } else {
      this.updateMovement();
    }
  }

  updateAutoPath() {
    if (!this._autoPath || this._autoPathIndex >= this._autoPath.length) {
      this._autoPath = null;
      this._autoPathIndex = 0;
      this._autoTarget = null;
      this.stopPlayerAnim();
      return;
    }

    const target = this._autoPath[this._autoPathIndex];
    const player = this._PLAYER;
    const speed = gameConfig.playerSpeed;
    const tolerance = 4; // pixels

    const dx = target.x - player.x;
    const dy = target.y - player.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < tolerance) {
      // Arrived at this node, go to next
      this._autoPathIndex++;
      if (this._autoPathIndex >= this._autoPath.length) {
        this._autoPath = null;
        this._autoPathIndex = 0;
        this._autoTarget = null;
        this.stopPlayerAnim();
      }
      return;
    }

    // Normalize direction
    const vx = (dx / dist) * speed;
    const vy = (dy / dist) * speed;
    player.body.setVelocity(vx, vy);

    // Set animation based on direction
    let direction = "down";
    let animKey = "walking-down";
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) {
        direction = "right";
        animKey = "walking-right";
      } else {
        direction = "left";
        animKey = "walking-left";
      }
    } else {
      if (dy > 0) {
        direction = "down";
        animKey = "walking-down";
      } else {
        direction = "up";
        animKey = "walking-up";
      }
    }
    this._ANIMS.pressedCursor = direction;
    this.playAnim(animKey);
  }

  updateMovement() {
    const { up, down, left, right } = this._INPUTS;
    const speed = gameConfig.playerSpeed;

    if (down.isDown) {
      this.movePlayer(0, speed, "down", "walking-down");
    } else if (up.isDown) {
      this.movePlayer(0, -speed, "up", "walking-up");
    } else if (left.isDown) {
      this.movePlayer(-speed, 0, "left", "walking-left");
    } else if (right.isDown) {
      this.movePlayer(speed, 0, "right", "walking-right");
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
    if (
      !this._PLAYER.anims.isPlaying ||
      this._PLAYER.anims.currentAnim.key !== animKey
    ) {
      this._PLAYER.anims.play(animKey);
    }
  }

  stopPlayerAnim() {
    this._PLAYER.body.setVelocity(0, 0);
    this._PLAYER.anims.stop();
  }

  getPlayerDirection() {
    const directionMap = {
      down: 0,
      up: 1,
      left: 2,
      right: 3,
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
