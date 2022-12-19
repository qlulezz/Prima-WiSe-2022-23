namespace xsoldier {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  export class Projectile extends ƒAid.NodeSprite {
    private static count: number = 0;
    private flySpeed: number;
    private strength: number;
    private hasHit: boolean = false;

    constructor(_pos: ƒ.Vector2, _angle: number) {
      super("Projectile" + (Projectile.count++)) ;
      this.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
      this.mtxLocal.translateX(_pos.x);
      this.mtxLocal.translateY(_pos.y);
      this.mtxLocal.rotateZ(_angle);
    }

    public move(): void {
      if (!this.hasHit) {
        this.mtxLocal.translateY(this.flySpeed * ƒ.Loop.timeFrameReal / 1000);
      }
    }

    public initializeAnimations(projectileType: number, strength: number): void {
      this.setAnimation(projectileTypes[projectileType]);
      this.flySpeed = config.projectile[projectileType].speed;
      this.setFrameDirection(0);
      this.strength = strength;
    }

    public hit(projectileType: number): number {
      this.hasHit = true;
      this.framerate = 10;
      this.showFrame(1);

      if (projectileType > 0) {
        this.setFrameDirection(1);
        return 200;
      }
      this.setFrameDirection(0);
      return 50;
    }

    public getStrength(): number {
      return this.strength;
    }
  }
}