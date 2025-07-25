/**
 * Creating item locations from Object layers
 */

import gameConfig from '../config/game-config';
import Cow from '../sprites/animals/Cow';
import Chicken from '../sprites/animals/Chicken';
import Sprite from '../sprites/Sprite';

export default class ObjectLoader {
  constructor(config) {
    this.scene = config.scene;
    this.player = this.scene._PLAYER;
    this.sprites = this.scene._SPRITES;
    this.mapData = config.objectLayers;

    // Physics groups
    this.exitGroup = this.scene.physics.add.group();
    this.interactiveGroup = this.scene.physics.add.group();
  }

  setup() {
    this.parseMapData();
    this.setCollision();
  }

  parseMapData() {
    this.mapData.forEach(layer => {
      switch (layer.name) {
        case 'exits':
          this.handleExits(layer);
          break;
        case 'animals':
          this.handleAnimals(layer);
          break;
        case 'interactive':
          this.handleInteractive(layer);
          break;
      }
    });
  }

  handleExits(layer) {
    layer.objects.forEach(obj => {
      const targetScene = this.findPropValue(obj.properties, 'exit');
      const exitSprite = this.addToPhysicsGroup(obj, this.exitGroup, 'exits', 'pixel');
      if (exitSprite && targetScene) {
        exitSprite.targetScene = targetScene;
      }
    });
  }

  handleAnimals(layer) {
    layer.objects.forEach(obj => {
      const type = obj.properties?.[1]?.value;
      const name = obj.properties?.[0]?.value;

      if (!type || !name) return;

      const config = { scene: this.scene, x: obj.x, y: obj.y };

      switch (type) {
        case 'cow':
          this.sprites[name] = new Cow({ ...config, key: 'cow' }, name, 'animal');
          break;
        case 'chicken':
          this.sprites[name] = new Chicken({ ...config, key: 'chicken2' }, name, 'animal');
          break;
      }
    });
  }

  handleInteractive(layer) {
    layer.objects.forEach(obj => {
      const objType = this.findPropValue(obj.properties, 'type');
      
      if (objType === 'sign') {
        this.addToPhysicsGroup(obj, this.interactiveGroup, 'interactive', 'pixel', 'interactive');
      } else {
        const key = this.findPropValue(obj.properties, 'name');
        if (key) {
          this.sprites[key] = new Sprite(
            { scene: this.scene, x: obj.x, y: obj.y, key },
            key,
            'interactive'
          );
        }
      }
    });
  }

  addToPhysicsGroup(obj, physicsGroup, layerName, keyName, type = '') {
    const newObj = this.scene._MAP.tilemap.createFromObjects(layerName, {
      id: obj.id,
      key: keyName
    });
    
    if (newObj?.length > 0 && newObj[0]) {
      const sprite = newObj[0];
      sprite.setOrigin(0.5, -0.5);
      sprite.name = keyName;
      sprite.creatureType = type;
      physicsGroup.add(sprite);
      return sprite;
    }
    
    console.warn(`Failed to create object: ${keyName}, layer: ${layerName}, id: ${obj.id}`);
    return null;
  }

  findPropValue(props, key) {
    if (!Array.isArray(props)) return undefined;
    return props.find(prop => prop.name === key)?.value;
  }

  setCollision() {
    // Exit overlaps
    this.exitGroup.children.entries.forEach(exit => {
      this.scene.physics.add.overlap(
        this.player,
        exit,
        () => {
          if (exit.targetScene) {
            this.newScene(exit.targetScene);
          }
        },
        null,
        this.scene
      );
    });

    // Interactive overlaps
    this.interactiveGroup.children.entries.forEach(entry => {
      this.scene.physics.add.overlap(
        this.player,
        entry,
        (player, elm) => {
          gameConfig.overlapData.isActive = true;
          gameConfig.overlapData.sprite = elm;
          gameConfig.overlapData.overlap = elm;
        },
        null,
        this.scene
      );
    });
  }

  newScene(sceneName) {
    // Update game config
    gameConfig.previousData.scene = gameConfig.loadedScene;
    gameConfig.loadedScene = sceneName;
    gameConfig.previousData.direction = this.scene._ANIMS.pressedCursor;
    gameConfig.previousData.coords = {
      x: this.player.x,
      y: this.player.y
    };

    // Restart scene
    this.scene.scene.restart();
  }
}
