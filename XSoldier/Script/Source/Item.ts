namespace xsoldier {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  export class Item extends ƒAid.NodeSprite {
    private static count: number = 0;
    public type: number;
    private dropSpeed: number;

    constructor(_pos: ƒ.Vector2) {
      super("Item" + (Item.count++));
      this.addComponent(new ƒ.ComponentTransform());
      this.mtxLocal.translateX(_pos.x);
      this.mtxLocal.translateY(_pos.y);
    }
    
    public initialize(): void {
      this.dropSpeed = random(-0.2, -1.5);
      this.type = Math.floor(random(0, 4));
      this.setAnimation(itemSprite);
      this.setFrameDirection(0);
      this.showFrame(this.type);
    }

    public move(): void {
      this.mtxLocal.translateY(this.dropSpeed * ƒ.Loop.timeFrameReal / 1000);
    }
  }
}