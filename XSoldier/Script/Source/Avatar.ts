namespace xsoldier {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  export class Avatar extends ƒAid.NodeSprite {
    public gunReady: boolean = true;
    public weaponType: number = 0;
    public powerLevel: number[] = [1, 1, 1];
    public invincible: boolean = true;
    public allowMovement: boolean = true;
    private lives: number = 3;

    private readonly maxPowerLevel: number = 8;

    constructor() {
      super("Mothership");
      this.addComponent(new ƒ.ComponentTransform());
    }

    public initializeAnimations(imgSpriteSheet: ƒ.TextureImage): void {
      let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);
      let animation: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("Fly", coat);
      animation.generateByGrid(ƒ.Rectangle.GET(0, 0, 32, 32), 6, 128, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.Y(32));

      this.resetPosition(true);
      this.setAnimation(animation);
      this.setFrameDirection(0);
    }

    // Item pickup
    // Increases overall powerLevel by 1 when item is powerup
    // Increases powerLevel of weaponType by 1 if same weapon is picked up
    public setItem(itemType: number): void {
      if (this.invincible)
        return;


      // When item is powerup
      if (itemType == 0) {
        for (let i: number = 0; i < this.powerLevel.length; i++) {
          if (this.powerLevel[i] < this.maxPowerLevel) {
            this.powerLevel[i] += 1;
          }
        }
        this.updatePowerLevel();
        return;
      }

      // When item is weapon
      if (itemType > 0) {
        if (this.weaponType == itemType - 1) {
          if (this.powerLevel[itemType - 1] < this.maxPowerLevel) {
            this.powerLevel[itemType - 1] += 1;
          }
          this.updatePowerLevel();
          return;
        }

        this.weaponType = itemType - 1;
        setWeaponSound(this.weaponType);
        this.updatePowerLevel();
        return;
      }
    }

    // Reduces hp by one if hit and not invincible
    // Game over if hp drops to 0
    public hit(): boolean {
      if (this.invincible)
        return false;

      this.resetPosition();
      this.lives--;
      //console.log("Lives left: " + this.lives);
      vui.hp = this.lives;

      if (this.lives == 0) {
        vui.info = "GAME OVER";
        return true;
      }
      return false;
    }

    // Reset avatar position and make invincible for 2s
    public resetPosition(initial: boolean = false): void {
      this.invincible = true;

      // First time render
      if (initial) {
        this.mtxLocal.set(new ƒ.Matrix4x4());
        this.mtxLocal.translateY(-2);

        ƒ.Time.game.setTimer(2000, 1, () => {
          this.invincible = false;
        });
        return;
      }

      // When hit
      this.allowMovement = false;
      ƒ.Time.game.setTimer(2000, 1, () => {
        this.mtxLocal.set(new ƒ.Matrix4x4());
        this.mtxLocal.translateY(-2);
        this.allowMovement = true;
      });

      ƒ.Time.game.setTimer(4000, 1, () => {
        this.invincible = false;
      });

    }

    private updatePowerLevel(): void {
      vui.power = `${this.powerLevel[0]}-${this.powerLevel[1]}-${this.powerLevel[2]}`;
    }
  }
}