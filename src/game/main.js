import { HarvestGame } from './scenes/HarvestGame';
import { AUTO, Game, Scale } from 'phaser';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
import { PhaserNavMeshPlugin } from 'phaser-navmesh';
const config = {
    type: AUTO,
    width: 1280,
    height: 960,
    parent: 'game-container',
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        },
    },
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH
    },
    plugins: {
        scene: [
            {
                key: 'PhaserNavMeshPlugin',
                plugin: PhaserNavMeshPlugin,
                mapping: 'navMeshPlugin',
                start: true
            }
        ]
    },
    scene: [
        HarvestGame
    ],
    pixelArt: true,
    roundPixels: true,
};

const StartGame = (parent) => {

    return new Game({ ...config, parent });

}

export default StartGame;
