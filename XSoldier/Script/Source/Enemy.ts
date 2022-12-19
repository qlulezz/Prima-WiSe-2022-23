namespace xsoldier {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  export class Enemy extends ƒAid.NodeSprite {
    private static count: number = 0;
    private flySpeed: number;
    private enemyType: number;

    constructor(_enemyType: number) {
      super("Enemy" + (Enemy.count++));
      this.enemyType = _enemyType;
      this.addComponent(new ƒ.ComponentTransform());
      this.mtxLocal.translateY(2.45);
      this.mtxLocal.rotateZ(180);
      this.mtxLocal.translateX(random(config.space.limitLeft, config.space.limitRight));
    }

    public move(): void {
      switch (this.enemyType) {
        case 0: {
          this.mtxLocal.translateY(this.flySpeed * ƒ.Loop.timeFrameReal / 1000);
          break;
        }
        case 1: {

          break;
        }
        case 2: {

          break;
        }
        case 3: {

          break;
        }
        case 4: {

          break;
        }
        case 5: {

          break;
        }
      }

    }

    public initializeAnimations(): void {
      this.setAnimation(enemyTypes[this.enemyType]);
      this.flySpeed = config.enemy[this.enemyType].speed;
      const tolerance: number = config.enemy[this.enemyType].speedTolerance;
      this.flySpeed += random(-tolerance, tolerance);
      this.setFrameDirection(0);
    }
  }
}