import gameConfig from "../config/game-config";

/**
 * Loads all images, based on passed Scene
 * called in Game scene's preload()
 */

export default class ImageLoader {
  constructor( scene ) {
    this.scene = scene;
    this.sceneName = gameConfig.loadedScene;
    this.loadBackground( this.sceneName );
    this.loadPeople();
    this.loadAnimals();
    this.loadItems();
  }

  // loads images, based on passed scene name
  loadBackground( sceneName ) {
    switch( sceneName ) {
      // farm backgrounds
      case 'sceneFarm': {
        this.scene.load.image( 'farm', 'assets/images/background/farm.png' );
        this.scene.load.tilemapTiledJSON( 'map-farm', 'assets/levels/homestead/farm-20px.json' );
        break;
      }
      case 'sceneHome': {
        this.scene.load.image( 'home', 'assets/images/background/home.png' );
        this.scene.load.tilemapTiledJSON( 'map-home', 'assets/levels/homestead/home-20px.json' );
        break;
      }
      case 'sceneCoop': {
        this.scene.load.image( 'coop', 'assets/images/background/chicken-coop.png' );
        this.scene.load.tilemapTiledJSON( 'map-coop', 'assets/levels/homestead/coop-20px.json' );
        break;
      }
      case 'sceneCowShed': {
        this.scene.load.image( 'cowshed', 'assets/images/background/cow-shed.png' );
        this.scene.load.tilemapTiledJSON( 'map-cowshed', 'assets/levels/homestead/cow-shed-20px.json' );
        break;
      }
      case 'sceneCave1': {
        this.scene.load.image( 'cave1', 'assets/images/background/cave1.png' );
        this.scene.load.tilemapTiledJSON( 'map-cave1', 'assets/levels/homestead/cave1-20px.json' );
        break;
      }
      case 'sceneToolShed': {
        this.scene.load.image( 'toolshed', 'assets/images/background/tool-shed.png' );
        this.scene.load.tilemapTiledJSON( 'map-toolshed', 'assets/levels/homestead/tool-shed-20px.json' );
        break;
      }

      // mountains
      case 'sceneCrossRoads': {
        this.scene.load.image( 'crossroads', 'assets/images/background/crossroads.png' );
        this.scene.load.tilemapTiledJSON( 'map-crossroads', 'assets/levels/mountains/crossroads-20px.json' );
        break;
      }
      case 'sceneMountains': {
        this.scene.load.image( 'mountains', 'assets/images/background/mountains-bare.png' );
        this.scene.load.tilemapTiledJSON( 'map-mountains', 'assets/levels/mountains/mountains-20px.json' );
        break;
      }
      case 'sceneCliff': {
        this.scene.load.image( 'cliff', 'assets/images/background/cliff.png' );
        // this.scene.load.tilemapTiledJSON( 'map-cliff', 'assets/levels/mountains/cliff-20px.json' );
        break;
      }
      case 'sceneCave2': {
        this.scene.load.image( 'cave2', 'assets/images/background/cave2.png' );
        // this.scene.load.tilemapTiledJSON( 'map-cave2', 'assets/levels/mountains/cave2-20px.json' );
        break;
      }
      case 'sceneMountainHome': {
        this.scene.load.image( 'mountain-home', 'assets/images/background/mountain-home.png' );
        this.scene.load.tilemapTiledJSON( 'map-mountain-home', 'assets/levels/mountains/mountain-home-20px.json' );
        break;
      }

      // town
      case 'sceneTown': {
        this.scene.load.image( 'town', 'assets/images/background/town.png' );
        this.scene.load.tilemapTiledJSON( 'map-town', 'assets/levels/town/town-20px.json' );
        break;
      }
      case 'sceneBar': {
        this.scene.load.image( 'bar', 'assets/images/background/building-bar.png' );
        this.scene.load.tilemapTiledJSON( 'map-bar', 'assets/levels/town/bar-20px.json' );
        break;
      }
      case 'sceneRestaurant': {
         this.scene.load.image( 'restaurant', 'assets/images/background/building-restaurant.png' );
         this.scene.load.tilemapTiledJSON( 'map-restaurant', 'assets/levels/town/restaurant-20px.json' );
        break;
      }
      case 'sceneToolShop': {
        this.scene.load.image( 'toolshop', 'assets/images/background/building-tools.png' );
        this.scene.load.tilemapTiledJSON( 'map-toolshop', 'assets/levels/town/tools-20px.json' );
        break;
      }
      case 'sceneFortuneTeller': {
        this.scene.load.image( 'fortuneteller', 'assets/images/background/building-fortuneteller.png' );
        this.scene.load.tilemapTiledJSON( 'map-fortuneteller', 'assets/levels/town/fortuneteller-20px.json' );
        break;
      }
      case 'sceneFlorist': {
        this.scene.load.image( 'florist', 'assets/images/background/building-florist.png' );
        this.scene.load.tilemapTiledJSON( 'map-florist', 'assets/levels/town/florist-20px.json' );
        break;
      }
      case 'sceneChurch': {
        this.scene.load.image( 'church', 'assets/images/background/building-church.png' );
        this.scene.load.tilemapTiledJSON( 'map-church', 'assets/levels/town/church-20px.json' );
        break;
      }
      case 'sceneManor': {
        this.scene.load.image( 'manor', 'assets/images/background/building-manor.png' );
        this.scene.load.tilemapTiledJSON( 'map-manor', 'assets/levels/town/manor-20px.json' );
        break;
      }
      case 'sceneAnimalShop': {
        this.scene.load.image( 'animal-shop', 'assets/images/background/building-animal-shop.png' );
        this.scene.load.tilemapTiledJSON( 'map-animal-shop', 'assets/levels/town/animal-shop-20px.json' );
        break;
      }

      // town bedrooms
      case 'sceneBedroomBar': {
        this.scene.load.image( 'bedroom-bar', 'assets/images/background/bedroom-bar.png' );
        this.scene.load.tilemapTiledJSON( 'map-bedroom-bar', 'assets/levels/town/bedroom-bar-20px.json' );
        break;
      }
      case 'sceneBedroomManor': {
        this.scene.load.image( 'bedroom-manor', 'assets/images/background/bedroom-manor.png' );
        this.scene.load.tilemapTiledJSON( 'map-bedroom-manor', 'assets/levels/town/bedroom-manor-20px.json' );
        break;
      }
      case 'sceneManorHallway': {
        this.scene.load.image( 'manor-hallway', 'assets/images/background/building-manor-hallway.png' );
        this.scene.load.tilemapTiledJSON( 'map-manor-hallway', 'assets/levels/town/manor-hallway-20px.json' );
        break;
      }
      case 'sceneBedroomRestaurant': {
        this.scene.load.image( 'bedroom-restaurant', 'assets/images/background/bedroom-restaurant.png' );
        this.scene.load.tilemapTiledJSON( 'map-bedroom-restaurant', 'assets/levels/town/bedroom-restaurant-20px.json' );
        break;
      }
      case 'sceneBedroomTools': {
        this.scene.load.image( 'bedroom-tools', 'assets/images/background/bedroom-tools.png' );
        this.scene.load.tilemapTiledJSON( 'map-bedroom-tools', 'assets/levels/town/bedroom-tools-20px.json' );
        break;
      }
      case 'sceneBedroomFlorist': {
        this.scene.load.image( 'bedroom-florist', 'assets/images/background/bedroom-florist.png' );
        this.scene.load.tilemapTiledJSON( 'map-bedroom-florist', 'assets/levels/town/bedroom-florist-20px.json' );
        break;
      }
      default:
        break;
    }
  }

  // all people
  loadPeople() {
    this.spritesJack();
    this.spritesNPCs();
    this.spritesForestSpirits();
  }

  // all animals
  loadAnimals() {
    this.spritesCows();
    this.spritesChickens();
    this.spritesOtherAnimals();
  }

  // all items
  loadItems() {
    this.spritesFlowers();
    this.spritesFood();
    this.spritesMisc();
  }

  // jack sprites
  spritesJack() {
    this.scene.load.spritesheet( 'jack-walking', 'assets/images/people/jack/jack-walking.png', {
      frameWidth: 80,
      frameHeight: 120,
    } );
    this.scene.load.spritesheet( 'jack-standing', 'assets/images/people/jack/jack-standing.png', {
      frameWidth: 80,
      frameHeight: 115,
    } );
    this.scene.load.spritesheet( 'jack-sick', 'assets/images/people/jack/jack-sick.png', {
      frameWidth: 90,
      frameHeight: 120,
    } );
    this.scene.load.spritesheet( 'jack-eating', 'assets/images/people/jack/jack-eating.png', {
      frameWidth: 96,
      frameHeight: 120,
    } );
    this.scene.load.spritesheet( 'jack-ring-cowbell-down', 'assets/images/people/jack/jack-cowbell-down.png', {
      frameWidth: 120,
      frameHeight: 180,
    } );
    this.scene.load.spritesheet( 'jack-ring-cowbell-up', 'assets/images/people/jack/jack-cowbell-up.png', {
      frameWidth: 100,
      frameHeight: 150,
    } );
    this.scene.load.spritesheet( 'jack-ring-cowbell-left', 'assets/images/people/jack/jack-cowbell-left.png', {
      frameWidth: 150,
      frameHeight: 160,
    } );
    this.scene.load.spritesheet( 'jack-ring-cowbell-right', 'assets/images/people/jack/jack-cowbell-right.png', {
      frameWidth: 150,
      frameHeight: 160,
    } );
  }

  // NPC sprites
  spritesNPCs() {
    this.scene.load.spritesheet( 'npc-drunk', 'assets/images/people/npc/drunk.png', {
      frameWidth: 135,
      frameHeight: 120,
    } );

    this.scene.load.spritesheet( 'fortune-teller-walk-side', 'assets/images/people/npc/fortune-teller-side.png', {
      frameWidth: 80,
      frameHeight: 110,
    } );

    this.scene.load.spritesheet( 'restaurant-owner-walk-side', 'assets/images/people/npc/restaurant-owner-side.png', {
      frameWidth: 85,
      frameHeight: 140,
    } );
  }

  // forest spirit sprites
  spritesForestSpirits() {
    this.scene.load.image( 'elf', 'assets/images/people/forestspirit/elf.png' );
  }

  // cow sprites
  spritesCows() {
    this.scene.load.image( 'cow', 'assets/images/animals/cow/cow.png' );

    this.scene.load.spritesheet( 'cow-eating-front', 'assets/images/animals/cow/cow-eating-front.png', {
      frameWidth: 85,
      frameHeight: 115,
    } );
    this.scene.load.spritesheet( 'cow-eating-side', 'assets/images/animals/cow/cow-eating-side.png', {
      frameWidth: 150,
      frameHeight: 105,
    } );
    this.scene.load.spritesheet( 'cow-happy-side', 'assets/images/animals/cow/cow-happy-side.png', {
      frameWidth: 135,
      frameHeight: 110,
    } );
    this.scene.load.spritesheet( 'cow-shocked', 'assets/images/animals/cow/cow-shocked.png', {
      frameWidth: 140,
      frameHeight: 115,
    } );
    this.scene.load.spritesheet( 'cow-sleeping-front', 'assets/images/animals/cow/cow-sleeping-front.png', {
      frameWidth: 85,
      frameHeight: 110,
    } );
    this.scene.load.spritesheet( 'cow-sleeping-side', 'assets/images/animals/cow/cow-sleeping-side.png', {
      frameWidth: 150,
      frameHeight: 100,
    } );

    // baby cow
    this.scene.load.spritesheet( 'cow-baby-happy', 'assets/images/animals/cow/cow-baby-happy.png', {
      frameWidth: 90,
      frameHeight: 80,
    } );
    this.scene.load.spritesheet( 'cow-baby-sleeping', 'assets/images/animals/cow/cow-baby-sleeping.png', {
      frameWidth: 120,
      frameHeight: 70,
    } );
    this.scene.load.spritesheet( 'cow-baby-sweating', 'assets/images/animals/cow/cow-baby-sweating.png', {
      frameWidth: 125,
      frameHeight: 80,
    } );
    this.scene.load.spritesheet( 'cow-baby-tail-wag', 'assets/images/animals/cow/cow-baby-tail-wag.png', {
      frameWidth: 105,
      frameHeight: 80,
    } );
  }

  // chicken sprites
  spritesChickens() {
    this.scene.load.image( 'chicken', 'assets/images/animals/chicken/chicken.png' );
    this.scene.load.image( 'chicken2', 'assets/images/animals/chicken/chicken2.png' );

    this.scene.load.spritesheet( 'chicken-walking', 'assets/images/animals/chicken/chicken-walking.png', {
      frameWidth: 80,
      frameHeight: 80,
    } );
    this.scene.load.spritesheet( 'chicken-sleeping', 'assets/images/animals/chicken/chicken-sleeping.png', {
      frameWidth: 80,
      frameHeight: 75,
    } );

    // chick
    this.scene.load.spritesheet( 'chick-resting', 'assets/images/animals/chicken/chick-resting.png', {
      frameWidth: 40,
      frameHeight: 50,
    } );
    this.scene.load.spritesheet( 'chick-walking', 'assets/images/animals/chicken/chick-move-front.png', {
      frameWidth: 45,
      frameHeight: 55,
    } );
    this.scene.load.spritesheet( 'chick-move-back', 'assets/images/animals/chicken/chick-move-back.png', {
      frameWidth: 40,
      frameHeight: 55,
    } );
  }

  // other animal sprites
  spritesOtherAnimals() {
    this.scene.load.spritesheet( 'fish-flopping','assets/images/animals/other/fish-flopping.png', {
      frameWidth: 80,
      frameHeight: 65,
    } );

    this.scene.load.image( 'fish', 'assets/images/animals/other/fish.png' );
    this.scene.load.image( 'mole', 'assets/images/animals/other/mole.png' );

    this.scene.load.image( 'dog', 'assets/images/animals/other/dog.png' );
  }

  // flower sprites
  spritesFlowers() {
    this.scene.load.image( 'fancyflower-summer', 'assets/images/items/flowers/fancyflower-summer.png' );
    this.scene.load.image( 'fancyflower', 'assets/images/items/flowers/fancyflower.png' );
    this.scene.load.image( 'flower', 'assets/images/items/flowers/flower.png' );
    this.scene.load.image( 'herb', 'assets/images/items/flowers/herb.png' );
    this.scene.load.image( 'powerberry-flower', 'assets/images/items/flowers/powerberry-flower.png' );
    this.scene.load.image( 'weed-autumn', 'assets/images/items/flowers/weed-autumn.png' );
    this.scene.load.image( 'weed', 'assets/images/items/flowers/weed.png' );
    this.scene.load.image( 'winterflower', 'assets/images/items/flowers/winterflower.png' );
  }

  // food sprites
  spritesFood() {
    this.scene.load.image( 'berry-of-wild-grape', 'assets/images/items/food/berryofwildgrape.png' );
    this.scene.load.image( 'cake', 'assets/images/items/food/cake.png' );
    this.scene.load.image( 'corn', 'assets/images/items/food/corn.png' );
    this.scene.load.image( 'croissant', 'assets/images/items/food/croissant.png' );
    this.scene.load.image( 'dumpling', 'assets/images/items/food/dumpling.png' );
    this.scene.load.image( 'mushroom-poisonous', 'assets/images/items/food/mushroom-poisonous.png' );
    this.scene.load.image( 'mushroom', 'assets/images/items/food/mushroom.png' );
    this.scene.load.image( 'potato', 'assets/images/items/food/potato.png' );
    this.scene.load.image( 'powerberry', 'assets/images/items/food/powerberry.png' );
    this.scene.load.image( 'rice-cake', 'assets/images/items/food/rice-cake.png' );
    this.scene.load.image( 'summerfruit', 'assets/images/items/food/summerfruit.png' );
    this.scene.load.image( 'tomato', 'assets/images/items/food/tomato.png' );
    this.scene.load.image( 'turnip', 'assets/images/items/food/turnip.png' );
  }

  // misc sprites
  spritesMisc() {
    this.scene.load.image( 'pixel', 'assets/images/items/misc/pixel.png' );
    this.scene.load.image( 'close-btn', 'assets/images/items/misc/close-btn.png' );
    this.scene.load.image( 'scroll-btn', 'assets/images/items/misc/arrow-down.png' );
    this.scene.load.image( 'btn-status', 'assets/images/items/misc/btn-status.png' );
    this.scene.load.image( 'btn-status-inactive', 'assets/images/items/misc/btn-status-inactive.png' );
    this.scene.load.image( 'btn-tasks', 'assets/images/items/misc/btn-tasks.png' );
    this.scene.load.image( 'btn-tasks-inactive', 'assets/images/items/misc/btn-tasks-inactive.png' );

    this.scene.load.image( 'chicken-statue', 'assets/images/items/misc/chicken-statue.png' );
    this.scene.load.image( 'hay', 'assets/images/items/misc/hay.png' );
    this.scene.load.image( 'rock', 'assets/images/items/misc/rock.png' );
  }

}
