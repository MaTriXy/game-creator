import Phaser from 'phaser';
import { ANDROGENIC, GAME, PX } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';

/**
 * Androgenic -- the opponent NPC.
 * A tall (6'5") Australian figure with a cap hiding a wig.
 * Stands at top of screen, sways side-to-side, throws attacks downward.
 * When frame mog triggers, his hat flies off revealing the wig/bald head.
 */
export class Androgenic {
  constructor(scene) {
    this.scene = scene;
    this.wigExposed = false;
    this.wigTimer = null;
    this.swayTime = 0;

    // Build the character using Graphics API
    this.gfxNormal = scene.add.graphics();
    this.gfxExposed = scene.add.graphics();
    this.drawCharacter(this.gfxNormal, false);
    this.drawCharacter(this.gfxExposed, true);
    this.gfxExposed.setVisible(false);

    // Create container
    this.sprite = scene.add.container(ANDROGENIC.X, ANDROGENIC.Y, [
      this.gfxNormal,
      this.gfxExposed,
    ]);

    // Store reference
    this.sprite.entity = this;
  }

  drawCharacter(gfx, wigExposed) {
    const w = ANDROGENIC.WIDTH;
    const h = ANDROGENIC.HEIGHT;
    const cx = 0;

    if (!wigExposed) {
      // --- Cap/Hat ---
      gfx.fillStyle(ANDROGENIC.COLOR_CAP, 1);
      // Cap top
      gfx.fillRoundedRect(cx - w * 0.22, -h * 0.50, w * 0.44, h * 0.10, 4 * PX);
      // Cap brim (wider)
      gfx.fillRect(cx - w * 0.30, -h * 0.41, w * 0.60, h * 0.03);
    } else {
      // --- Bald head with sparse hair strands ---
      gfx.fillStyle(ANDROGENIC.COLOR_BALD, 1);
      gfx.fillRoundedRect(cx - w * 0.18, -h * 0.50, w * 0.36, h * 0.12, 6 * PX);
      // Receding hairline -- sparse strands
      gfx.lineStyle(1.5 * PX, ANDROGENIC.COLOR_WIG, 0.7);
      for (let i = -3; i <= 3; i++) {
        const sx = cx + i * w * 0.04;
        gfx.beginPath();
        gfx.moveTo(sx, -h * 0.50);
        gfx.lineTo(sx + w * 0.01, -h * 0.55);
        gfx.strokePath();
      }
    }

    // --- Head (skin tone) ---
    gfx.fillStyle(ANDROGENIC.COLOR_SKIN, 1);
    gfx.fillRoundedRect(cx - w * 0.16, -h * 0.42, w * 0.32, h * 0.16, 5 * PX);

    // --- Eyes (slightly menacing) ---
    gfx.fillStyle(0x000000, 1);
    gfx.fillCircle(cx - w * 0.07, -h * 0.35, 2.5 * PX);
    gfx.fillCircle(cx + w * 0.07, -h * 0.35, 2.5 * PX);
    // Eyebrows (angled down = menacing)
    gfx.lineStyle(2 * PX, 0x000000, 1);
    gfx.beginPath();
    gfx.moveTo(cx - w * 0.12, -h * 0.39);
    gfx.lineTo(cx - w * 0.03, -h * 0.38);
    gfx.strokePath();
    gfx.beginPath();
    gfx.moveTo(cx + w * 0.12, -h * 0.39);
    gfx.lineTo(cx + w * 0.03, -h * 0.38);
    gfx.strokePath();

    // --- Smirk ---
    gfx.lineStyle(1.5 * PX, 0x000000, 0.8);
    gfx.beginPath();
    gfx.moveTo(cx - w * 0.06, -h * 0.30);
    gfx.lineTo(cx + w * 0.06, -h * 0.31);
    gfx.lineTo(cx + w * 0.08, -h * 0.32);
    gfx.strokePath();

    // --- Neck (thick) ---
    gfx.fillStyle(ANDROGENIC.COLOR_SKIN, 1);
    gfx.fillRect(cx - w * 0.08, -h * 0.27, w * 0.16, h * 0.06);

    // --- Shoulders (broad, tall frame) ---
    gfx.fillStyle(ANDROGENIC.COLOR_BODY, 1);
    // Left shoulder
    gfx.fillTriangle(
      cx - w * 0.45, -h * 0.18,
      cx - w * 0.10, -h * 0.22,
      cx - w * 0.40, -h * 0.06
    );
    // Right shoulder
    gfx.fillTriangle(
      cx + w * 0.45, -h * 0.18,
      cx + w * 0.10, -h * 0.22,
      cx + w * 0.40, -h * 0.06
    );

    // --- Torso (large, V-shape for tall frame) ---
    gfx.fillStyle(ANDROGENIC.COLOR_BODY, 1);
    gfx.beginPath();
    gfx.moveTo(cx - w * 0.38, -h * 0.16);
    gfx.lineTo(cx + w * 0.38, -h * 0.16);
    gfx.lineTo(cx + w * 0.25, h * 0.12);
    gfx.lineTo(cx - w * 0.25, h * 0.12);
    gfx.closePath();
    gfx.fillPath();

    // --- Arms ---
    gfx.fillStyle(ANDROGENIC.COLOR_SKIN, 1);
    gfx.fillRoundedRect(cx - w * 0.45, -h * 0.12, w * 0.10, h * 0.28, 3 * PX);
    gfx.fillRoundedRect(cx + w * 0.35, -h * 0.12, w * 0.10, h * 0.28, 3 * PX);

    // --- Legs ---
    gfx.fillStyle(0x1A1A3E, 1); // Dark pants
    gfx.fillRoundedRect(cx - w * 0.22, h * 0.12, w * 0.18, h * 0.32, 3 * PX);
    gfx.fillRoundedRect(cx + w * 0.04, h * 0.12, w * 0.18, h * 0.32, 3 * PX);

    // --- Shoes ---
    gfx.fillStyle(0x111111, 1);
    gfx.fillRoundedRect(cx - w * 0.24, h * 0.41, w * 0.22, h * 0.06, 2 * PX);
    gfx.fillRoundedRect(cx + w * 0.02, h * 0.41, w * 0.22, h * 0.06, 2 * PX);
  }

  update(delta) {
    // Gentle side-to-side sway
    this.swayTime += delta * 0.001;
    const swayX = ANDROGENIC.X + Math.sin(this.swayTime * ANDROGENIC.SWAY_SPEED) * ANDROGENIC.SWAY_RANGE;
    this.sprite.x = Phaser.Math.Clamp(swayX, ANDROGENIC.WIDTH, GAME.WIDTH - ANDROGENIC.WIDTH);
  }

  /**
   * Expose the wig (hat flies off) during frame mog.
   */
  exposeWig(duration) {
    if (this.wigExposed) return;
    this.wigExposed = true;
    this.gfxNormal.setVisible(false);
    this.gfxExposed.setVisible(true);

    eventBus.emit(Events.ANDROGENIC_WIG_EXPOSED);

    // Shake Androgenic in surprise
    this.scene.tweens.add({
      targets: this.sprite,
      x: this.sprite.x + 10 * PX,
      duration: 50,
      yoyo: true,
      repeat: 5,
    });

    // Restore after duration
    if (this.wigTimer) clearTimeout(this.wigTimer);
    this.wigTimer = setTimeout(() => {
      this.wigExposed = false;
      this.gfxNormal.setVisible(true);
      this.gfxExposed.setVisible(false);
    }, duration);
  }

  destroy() {
    if (this.wigTimer) clearTimeout(this.wigTimer);
    this.sprite.destroy();
  }
}
