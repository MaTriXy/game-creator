import Phaser from 'phaser';
import { CLAVICULAR, GAME, PX } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';

/**
 * Clavicular -- the player character.
 * A lean figure with prominent angular shoulders/collarbones, sharp jawline,
 * and styled-up hair. Gold/amber tones. "The clavicle guy."
 */
export class Clavicular {
  constructor(scene) {
    this.scene = scene;
    this.facingRight = true;

    // Build the character using Graphics API
    const gfx = scene.add.graphics();
    this.drawCharacter(gfx);

    // Create physics container
    this.sprite = scene.add.container(CLAVICULAR.START_X, CLAVICULAR.START_Y, [gfx]);
    scene.physics.add.existing(this.sprite);

    this.sprite.body.setSize(CLAVICULAR.WIDTH * 0.8, CLAVICULAR.HEIGHT * 0.85);
    this.sprite.body.setOffset(-CLAVICULAR.WIDTH * 0.4, -CLAVICULAR.HEIGHT * 0.5);
    this.sprite.body.setCollideWorldBounds(true);
    // No gravity on player -- horizontal movement only
    this.sprite.body.setAllowGravity(false);

    // Store reference for collision detection
    this.sprite.entity = this;
  }

  drawCharacter(gfx) {
    const w = CLAVICULAR.WIDTH;
    const h = CLAVICULAR.HEIGHT;
    const cx = 0; // Centered in container

    // --- Hair (styled up, dark) ---
    gfx.fillStyle(CLAVICULAR.COLOR_HAIR, 1);
    // Main hair block (tall, styled up)
    gfx.fillRoundedRect(cx - w * 0.18, -h * 0.50, w * 0.36, h * 0.15, 4 * PX);
    // Hair spike left
    gfx.fillTriangle(
      cx - w * 0.16, -h * 0.50,
      cx - w * 0.08, -h * 0.58,
      cx - w * 0.02, -h * 0.50
    );
    // Hair spike center
    gfx.fillTriangle(
      cx - w * 0.06, -h * 0.50,
      cx + w * 0.02, -h * 0.56,
      cx + w * 0.10, -h * 0.50
    );
    // Hair spike right
    gfx.fillTriangle(
      cx + w * 0.04, -h * 0.50,
      cx + w * 0.14, -h * 0.55,
      cx + w * 0.20, -h * 0.50
    );

    // --- Head (skin tone, angular jaw) ---
    gfx.fillStyle(CLAVICULAR.COLOR_SKIN, 1);
    // Head oval
    gfx.fillRoundedRect(cx - w * 0.15, -h * 0.42, w * 0.30, h * 0.18, 6 * PX);
    // Sharp jaw (triangle pointing down)
    gfx.fillStyle(CLAVICULAR.COLOR_JAW, 1);
    gfx.fillTriangle(
      cx - w * 0.12, -h * 0.26,
      cx, -h * 0.18,
      cx + w * 0.12, -h * 0.26
    );
    // Jaw fill (skin)
    gfx.fillStyle(CLAVICULAR.COLOR_SKIN, 1);
    gfx.fillTriangle(
      cx - w * 0.10, -h * 0.27,
      cx, -h * 0.20,
      cx + w * 0.10, -h * 0.27
    );

    // --- Eyes (small, intense) ---
    gfx.fillStyle(0x000000, 1);
    gfx.fillCircle(cx - w * 0.06, -h * 0.34, 2 * PX);
    gfx.fillCircle(cx + w * 0.06, -h * 0.34, 2 * PX);

    // --- Neck ---
    gfx.fillStyle(CLAVICULAR.COLOR_SKIN, 1);
    gfx.fillRect(cx - w * 0.06, -h * 0.22, w * 0.12, h * 0.06);

    // --- CLAVICLES (the signature feature) ---
    // Prominent angular shoulder bones extending outward
    gfx.lineStyle(3 * PX, CLAVICULAR.COLOR_CLAVICLE, 1);
    // Left clavicle
    gfx.beginPath();
    gfx.moveTo(cx - w * 0.04, -h * 0.16);
    gfx.lineTo(cx - w * 0.38, -h * 0.22);
    gfx.strokePath();
    // Right clavicle
    gfx.beginPath();
    gfx.moveTo(cx + w * 0.04, -h * 0.16);
    gfx.lineTo(cx + w * 0.38, -h * 0.22);
    gfx.strokePath();

    // Clavicle bone bumps (small circles at endpoints)
    gfx.fillStyle(CLAVICULAR.COLOR_CLAVICLE, 1);
    gfx.fillCircle(cx - w * 0.38, -h * 0.22, 3 * PX);
    gfx.fillCircle(cx + w * 0.38, -h * 0.22, 3 * PX);

    // --- Shoulders (angular, wide) ---
    gfx.fillStyle(CLAVICULAR.COLOR_BODY, 1);
    // Left shoulder
    gfx.fillTriangle(
      cx - w * 0.40, -h * 0.20,
      cx - w * 0.10, -h * 0.16,
      cx - w * 0.35, -h * 0.06
    );
    // Right shoulder
    gfx.fillTriangle(
      cx + w * 0.40, -h * 0.20,
      cx + w * 0.10, -h * 0.16,
      cx + w * 0.35, -h * 0.06
    );

    // --- Torso (lean, V-shape) ---
    gfx.fillStyle(CLAVICULAR.COLOR_BODY, 1);
    // Main torso (tapered rectangle)
    gfx.beginPath();
    gfx.moveTo(cx - w * 0.30, -h * 0.12);
    gfx.lineTo(cx + w * 0.30, -h * 0.12);
    gfx.lineTo(cx + w * 0.18, h * 0.15);
    gfx.lineTo(cx - w * 0.18, h * 0.15);
    gfx.closePath();
    gfx.fillPath();

    // --- Tank top neckline detail ---
    gfx.lineStyle(2 * PX, 0xB8860B, 0.8);
    gfx.beginPath();
    gfx.moveTo(cx - w * 0.15, -h * 0.14);
    gfx.lineTo(cx, -h * 0.08);
    gfx.lineTo(cx + w * 0.15, -h * 0.14);
    gfx.strokePath();

    // --- Arms ---
    gfx.fillStyle(CLAVICULAR.COLOR_SKIN, 1);
    // Left arm
    gfx.fillRoundedRect(cx - w * 0.40, -h * 0.10, w * 0.10, h * 0.25, 3 * PX);
    // Right arm
    gfx.fillRoundedRect(cx + w * 0.30, -h * 0.10, w * 0.10, h * 0.25, 3 * PX);

    // --- Legs ---
    gfx.fillStyle(0x2C2C54, 1); // Dark pants
    // Left leg
    gfx.fillRoundedRect(cx - w * 0.16, h * 0.15, w * 0.14, h * 0.30, 3 * PX);
    // Right leg
    gfx.fillRoundedRect(cx + w * 0.02, h * 0.15, w * 0.14, h * 0.30, 3 * PX);

    // --- Shoes ---
    gfx.fillStyle(0xFFFFFF, 1);
    gfx.fillRoundedRect(cx - w * 0.18, h * 0.42, w * 0.17, h * 0.06, 2 * PX);
    gfx.fillRoundedRect(cx + w * 0.01, h * 0.42, w * 0.17, h * 0.06, 2 * PX);
  }

  update(left, right) {
    const body = this.sprite.body;

    if (left) {
      body.setVelocityX(-CLAVICULAR.SPEED);
      if (this.facingRight) {
        this.sprite.setScale(-1, 1);
        this.facingRight = false;
      }
      eventBus.emit(Events.SPECTACLE_ACTION, { direction: 'left' });
    } else if (right) {
      body.setVelocityX(CLAVICULAR.SPEED);
      if (!this.facingRight) {
        this.sprite.setScale(1, 1);
        this.facingRight = true;
      }
      eventBus.emit(Events.SPECTACLE_ACTION, { direction: 'right' });
    } else {
      body.setVelocityX(0);
    }

    // Keep vertical position fixed
    body.setVelocityY(0);
  }

  /**
   * Flash red when hit
   */
  flashDamage() {
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0.3,
      duration: 80,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        this.sprite.setAlpha(1);
      }
    });
  }

  reset() {
    this.sprite.setPosition(CLAVICULAR.START_X, CLAVICULAR.START_Y);
    this.sprite.body.setVelocity(0, 0);
    this.sprite.setAlpha(1);
    this.sprite.setScale(1, 1);
    this.facingRight = true;
  }

  destroy() {
    this.sprite.destroy();
  }
}
