/**
 * Modal Box component
 */

import gameConfig from '../../config/game-config';

export default class ModalBox {
  constructor(scene) {
    this.scene = scene;
    this.btns = this.scene._BTNS;
    this.modal = this.scene._MODAL;

    // Box settings
    this.boxConfig = {
      height: 400,
      width: 1240, // gameConfig width - 40
      x: 20,
      y: 540, // gameConfig height - 420
      fill: 0x000000,
      alpha: 0.7
    };

    this.createBox();
  }

  createBox() {
    // creating graphics
    // this box will be the rounded menu box
    this.modal.box = this.scene.add.graphics( {
      fillStyle: {
        color: this.boxConfig.fill,
        alpha: this.boxConfig.alpha,
      },
      lineStyle: {
        width: 6
      }
    } ).setScrollFactor( 0 );

    // box that will be a mask for the text
    this.modal.maskBox = this.scene.add.graphics( {
      fillStyle: {
        alpha: 1
      }
    } ).setScrollFactor( 0 );

    // creating interactable elements
    this.createCloseBtn();
    this.createScrollBtn();

    // adding graphic to rounded rectangle
    this.modal.box.fillRoundedRect(
      this.boxConfig.x,
      this.boxConfig.y,
      this.boxConfig.width,
      this.boxConfig.height,
      0
    );

    // stroke for rounded rectangle
    this.modal.box.strokeRoundedRect(
      this.boxConfig.x,
      this.boxConfig.y,
      this.boxConfig.width,
      this.boxConfig.height,
      0
    );

    // rectangle for text mask
    this.modal.maskBox.fillRoundedRect(
      this.boxConfig.x,
      this.boxConfig.y,
      this.boxConfig.width,
      this.boxConfig.height - 20,
      0
    );

    // hide on game load
    this.hideBox();
  }

  // Create Close button
  createCloseBtn() {
    this.btns.closeBtn = this.scene.add.image(1230, 570, 'close-btn') // Hard-coded positions
        .setScrollFactor(0)
        .setInteractive({ useHandCursor: true });

    this.btns.closeBtn.on('pointerdown', (pointer, localX, localY, event) => {
      event.stopPropagation();
      gameConfig.taskMenuOpen = false;
      this.hideBox();
    });
  }

  createScrollBtn() {
    this.btns.scrollBtn = this.scene.add.image(1230, 915, 'scroll-btn') // Hard-coded positions
        .setScrollFactor(0)
        .setInteractive({ useHandCursor: true })
        .setVisible(false);

    this.btns.scrollBtn.on('pointerdown', (pointer) => {
      console.log('scroll clicked', pointer);
    });
  }

  addText( text ) {
    this.modal.textbox = this.scene.make.text({
      x: this.boxConfig.x,
      y: this.boxConfig.y,
      text: text,
      style: {
        font: '55px monospace',
        padding: { x: 25, y: 25 },
        wordWrap: { width: 1220 },
      }
    }).setScrollFactor( 0 ).setVisible( false );

    // create a mask on the box, will only show text
    this.modal.mask = this.modal.textbox.createBitmapMask();
    this.modal.maskBox.setMask( this.modal.mask );
  }

  // displays popup box
  loadBox( text ) {
    this.addText( text );
    this.modal.box.setVisible( true );
    this.modal.maskBox.setVisible( true );
    this.btns.closeBtn.setVisible( true );
    // this.btns.scrollBtn.setVisible( true );
  }

  // hides box
  hideBox() {
    this.modal.box.setVisible( false );
    this.modal.maskBox.setVisible( false );
    this.btns.closeBtn.setVisible( false );
    // this.scene.scrollBtn.setVisible( false );

    this.btns.statusBtn.setVisible( false );
    this.btns.statusBtnInactive.setVisible( false );
    this.btns.taskBtn.setVisible( false );
    this.btns.taskBtnInactive.setVisible( false );
  }

}
