namespace xsoldier {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  export class Star extends ƒAid.NodeSprite {
    private static count: number = 0;
    private flySpeed: number = -2.5;

    constructor() {
      super("Star" + (Star.count++));
      this.addComponent(new ƒ.ComponentTransform());
      this.resetPosition();
      this.mtxLocal.translateY(random(-3, 7));
      this.setAnimation(starTypes[Math.random() < 0.5 ? 0 : 1]);
      this.framerate = 6;
    }

    public move(): void {
      if (this.mtxLocal.translation.y < -7) {
        this.resetPosition();
        this.mtxLocal.translateY(random(4, 12));
        return;
      }
      this.mtxLocal.translateY(this.flySpeed * ƒ.Loop.timeFrameReal / 1000);
    }

    private resetPosition(): void {
      this.mtxLocal.set(new ƒ.Matrix4x4());
      this.mtxLocal.scale(new ƒ.Vector3(2, 2, 2));
      this.mtxLocal.translateZ(random(-1, -3));
      this.mtxLocal.translateX(random(config.space.limitLeft - 1, config.space.limitRight + 1));
    }
  }
}