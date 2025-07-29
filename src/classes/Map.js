/**
 * Map generator for tilemap
 */

export default class Map {
  constructor(config) {
    this.scene = config.scene;
    this.key = config.key;
    this.imgKey = config.imgKey;
    this.tileSetName = config.tileSetName;
    this.bgLayerName = config.bgLayerName;
    this.blockedLayerName = config.blockedLayerName;
    this.tileSize = 20;

    this.createMap();
  }

  createMap() {
    // Create tilemap
    this.tilemap = this.scene.make.tilemap({ key: this.key });

    // Add tileset image
    this.tiles = this.tilemap.addTilesetImage(
      this.tileSetName, 
      this.imgKey, 
      this.tileSize, 
      this.tileSize, 
      0, 
      0
    );

    // Create layers
    this.backgroundLayer = this.tilemap.createLayer(this.bgLayerName, this.tiles, 0, 0);
    this.blockedLayer = this.tilemap.createLayer(this.blockedLayerName, this.tiles, 0, 0);

    // Set collision
    this.blockedLayer.setCollisionByExclusion(-1);

    //todo: Set collision by property
    // this.blockedLayer.setCollisionByProperty({ collides: true });
  }
}
